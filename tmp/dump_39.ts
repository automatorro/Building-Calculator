import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if(!sbUrl || !sbKey) throw new Error('Missing Supabase env vars');

const supabase = createClient(sbUrl, sbKey);

async function run() {
  const { data, error } = await supabase
    .from('catalog_norms')
    .select('symbol, name, category, has_components, unit');

  if (error) {
    console.error('Error fetching norms:', error);
    return;
  }
  
  const withoutComps = data.filter(n => (n.has_components === false || n.has_components === null) && n.category !== 'Diverse');
  console.log('Without comps (Excluding Diverse):', withoutComps.length);
  
  fs.writeFileSync('tmp/39_norms.json', JSON.stringify(withoutComps, null, 2));
}

run();
