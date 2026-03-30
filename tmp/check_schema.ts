import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching purchases:', error)
  } else {
    console.log('Purchases sample data (to see columns):', data)
  }
  
  // Also try to insert a test record with just columns we know
  const testInsert = {
    project_id: '81d17878-6982-4edc-acf7-02870bb43b98', // Use an existing ID from subagent find or just mock
    amount_total: 1
  }
  // Try to find an existing project first
  const { data: projects } = await supabase.from('projects').select('id').limit(1)
  if (projects && projects.length > 0) {
     const { error: insError } = await supabase.from('purchases').insert({
       project_id: projects[0].id,
       amount_total: 0,
       name: 'Schema Check'
     })
     if (insError) console.error('Insert Error Detail:', insError)
  }
}

checkSchema()
