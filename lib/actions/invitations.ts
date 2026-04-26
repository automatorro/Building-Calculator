'use server'

import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

export async function inviteMemberAction(projectId: string, email: string, role: string) {
  const supabase = await createClient()
  
  // 1. Check current user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Trebuie să fii autentificat pentru a trimite invitații.' }

  // 2. Check if project exists and get name
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('name')
    .eq('id', projectId)
    .single()
  
  if (projectError || !project) return { error: 'Proiectul nu a fost găsit.' }

  // 3. Generate secure token
  const token = crypto.randomUUID()

  // 4. Insert into project_invitations
  const { error: inviteError } = await supabase
    .from('project_invitations')
    .insert({
      project_id: projectId,
      email: email.toLowerCase(),
      role,
      token,
      inviter_id: user.id
    })

  if (inviteError) {
    if (inviteError.code === '23505') {
      return { error: 'O invitație este deja activă pentru acest email.' }
    }
    return { error: inviteError.message }
  }

  // 5. Send Email
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const inviteLink = `${baseUrl}/invite/${token}`
  
  try {
    const { data, error } = await getResend().emails.send({
      from: 'Santier.app <onboarding@resend.dev>',
      to: email,
      subject: `Invitație colaborare proiect: ${project.name}`,
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #E8500A; margin-bottom: 20px;">Salut!</h2>
          <p style="font-size: 16px; color: #1E2329; line-height: 1.5;">
            Ai fost invitat să colaborezi la proiectul <strong>${project.name}</strong> pe Santier.app.
          </p>
          <p style="font-size: 16px; color: #1E2329; line-height: 1.5;">
            Rolul tău va fi de: <strong>${role}</strong>.
          </p>
          <div style="margin: 35px 0;">
            <a href="${inviteLink}" style="background-color: #E8500A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(232, 80, 10, 0.2);">
              Acceptă Invitația
            </a>
          </div>
          <p style="font-size: 14px; color: #6B6860; margin-top: 30px;">
            Dacă nu ai cont, va trebui să îți creezi unul folosind această adresă de email pentru a accesa proiectul.
          </p>
          <p style="font-size: 12px; color: #A8A59E;">
            Dacă nu te așteptai la această invitație, poți ignora acest email.
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 20px;">
          <p style="font-size: 10px; color: #A8A59E; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
            © 2026 Santier.app — Software pentru Construcții
          </p>
        </div>
      `
    })

    if (error) {
        console.error('Resend error:', error)
        // Dăm un mesaj mai specific dacă eroarea e de la domenii neverificate
        const errorMsg = error.message.includes('verify your domain') 
          ? 'Resend permite trimiterea email-urilor doar către adresa ta proprie (lucian.cebuc@gmail.com) până când îți verifici un domeniu propriu.'
          : 'Eroare Resend: ' + error.message;
        return { error: errorMsg }
    }

    return { success: true }
  } catch (e: any) {
    console.error('Email send exception:', e)
    return { error: 'Eroare neprevăzută la trimiterea email-ului.' }
  }
}

export async function acceptInvitationAction(token: string) {
  const supabase = await createClient()
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Trebuie să fii autentificat pentru a accepta invitația.' }

  // 2. Find invitation
  const { data: invite, error: inviteError } = await supabase
    .from('project_invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (inviteError || !invite) {
    return { error: 'Invitația nu a fost găsită sau a expirat.' }
  }

  // 3. Add to members
  const { error: memberError } = await supabase
    .from('project_members')
    .insert({
      project_id: invite.project_id,
      user_id: user.id,
      user_email: user.email,
      role: invite.role
    })

  if (memberError) {
    if (memberError.code === '23505') {
       // already a member
       await supabase.from('project_invitations').delete().eq('id', invite.id)
       return { success: true, projectId: invite.project_id }
    }
    return { error: memberError.message }
  }

  // 4. Delete invitation
  await supabase.from('project_invitations').delete().eq('id', invite.id)

  return { success: true, projectId: invite.project_id }
}

export async function removeMemberAction(memberId: string) {
  const supabase = await createClient()
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Neautentificat.' }

  // 2. We delete directly - RLS will handle the permission check
  // (Owner can delete anyone, members can only delete themselves)
  const { error, count } = await supabase
    .from('project_members')
    .delete({ count: 'exact' })
    .eq('id', memberId)

  if (error) return { error: error.message }
  if (count === 0) return { error: 'Nu ai permisiunea de a elimina acest membru sau membrul nu mai există.' }
  
  return { success: true }
}

export async function deleteInvitationAction(invitationId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('project_invitations')
    .delete()
    .eq('id', invitationId)
  
  if (error) return { error: error.message }
  return { success: true }
}
