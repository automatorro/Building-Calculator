import { redirect } from 'next/navigation'

export default async function TimelinePage({ params }: { params: { id: string } }) {
  const { id } = await params
  redirect(`/projects/${id}?tab=timeline`)
}
