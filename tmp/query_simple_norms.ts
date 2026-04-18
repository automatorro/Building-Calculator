import { createClient } from '@supabase/supabase-js';

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
  
  console.log('Total norms:', data.length);
  const withoutComps = data.filter(n => n.has_components === false || n.has_components === null);
  console.log('Without comps:', withoutComps.length);
  
  const categorized = withoutComps.reduce((acc, norm) => {
    if(!acc[norm.category]) acc[norm.category] = [];
    acc[norm.category].push(norm);
    return acc;
  }, {} as Record<string, any[]>);

  for(const [cat, norms] of Object.entries(categorized)) {
    console.log('\n### ' + cat + ' (' + norms.length + ')');
    for(const n of norms.slice(0, 10)) {
      console.log(`- **${n.symbol}** (${n.unit}): ${n.name}`);
    }
    if (norms.length > 10) console.log(`  ... și încă ${norms.length - 10}`);
  }
}

run();
