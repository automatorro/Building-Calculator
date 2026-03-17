import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, HardHat, Hammer, Truck, Box } from 'lucide-react'

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  // Preia detaliile articolului
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select(`
      *,
      categories (name),
      normatives (code, name)
    `)
    .eq('id', id)
    .single()

  if (itemError || !item) {
    return notFound()
  }

  // Preia resursele (consumurile)
  const { data: resources, error: resError } = await supabase
    .from('resources')
    .select('*')
    .eq('item_id', id)
    .order('type')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'material': return <Box className="w-4 h-4" />
      case 'labor': return <HardHat className="w-4 h-4" />
      case 'equipment': return <Hammer className="w-4 h-4" />
      case 'transport': return <Truck className="w-4 h-4" />
      default: return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'material': return 'text-blue-600 bg-blue-50'
      case 'labor': return 'text-orange-600 bg-orange-50'
      case 'equipment': return 'text-purple-600 bg-purple-50'
      case 'transport': return 'text-green-600 bg-green-50'
      default: return ''
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <a href="/catalog" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Înapoi la Catalog
      </a>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-primary text-white text-sm font-mono font-bold rounded">
            {item.normatives?.code} {item.code}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">
            {item.categories?.name}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border inline-block">
          <span className="text-slate-500 mr-2">Unitate de măsură:</span>
          <span className="font-bold text-lg">{item.um}</span>
        </div>
      </div>

      <section className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-semibold">Analiza Resurselor (Consumuri specifice)</h2>
          <p className="text-sm text-slate-500 mt-1">
            Resursele necesare pentru realizarea unei unități ({item.um}) conform normativului {item.normatives?.name}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Tip</th>
                <th className="px-6 py-4 font-bold">Denumire Resursă</th>
                <th className="px-6 py-4 font-bold">U.M.</th>
                <th className="px-6 py-4 font-bold text-right">Consum</th>
                <th className="px-6 py-4 font-bold text-right">Preț Unitar (estimat)</th>
                <th className="px-6 py-4 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {resources?.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold uppercase ${getTypeColor(res.type)}`}>
                      {getTypeIcon(res.type)}
                      {res.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{res.name}</td>
                  <td className="px-6 py-4 text-slate-500">{res.um}</td>
                  <td className="px-6 py-4 text-right font-mono">{res.quantity}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-500">{res.default_price} lei</td>
                  <td className="px-6 py-4 text-right font-mono font-bold">
                    {(res.quantity * res.default_price).toFixed(2)} lei
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-primary/5 font-bold">
                <td colSpan={5} className="px-6 py-4 text-right text-primary uppercase tracking-wider">Total Cost Direct / {item.um}</td>
                <td className="px-6 py-4 text-right text-xl text-primary">
                  {resources?.reduce((acc, res) => acc + (res.quantity * res.default_price), 0).toFixed(2)} lei
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border border-dashed border-border rounded-2xl bg-slate-50/30">
          <h3 className="font-bold mb-2">Note Tehnice</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Prețurile afișate sunt estimative și nu includ TVA. Consumurile sunt extrase din indicatorul {item.normatives?.code} și includ pierderile tehnologice standard.
          </p>
        </div>
      </div>
    </main>
  )
}
