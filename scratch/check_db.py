from dotenv import load_dotenv
load_dotenv()
import os
from supabase import create_client

sb = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])
r = sb.table('dedeman_catalog').select('cod_produs,nume,pret,rating', count='exact').execute()
print(f"Total rows in dedeman_catalog: {r.count}")
for d in r.data[:5]:
    print(f"  {d['cod_produs']} | {d['nume'][:60]} | {d['pret']} RON | rating={d['rating']}")
