const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');

let url = '', key = '';
env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function setAdmin() {
  const email = 'lucian.cebuc@gmail.com';
  
  // Get user by email (Supabase admin api)
  const { data: usersData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }
  
  const user = usersData.users.find(u => u.email === email);
  if (!user) {
    console.log(`User ${email} not found in auth.users.`);
    return;
  }
  
  console.log(`Found user ${user.id} for ${email}`);
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_admin: true, subscription_plan: 'echipa' })
    .eq('id', user.id);
    
  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Successfully updated is_admin and subscription_plan to echipa!');
  }
}

setAdmin();
