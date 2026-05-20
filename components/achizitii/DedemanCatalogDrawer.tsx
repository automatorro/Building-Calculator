'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Search, ShoppingCart, X, Plus, Minus,
  ExternalLink, FileDown, ArrowLeftRight,
  ChevronDown, ChevronUp, Star,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────
interface DedemanProduct {
  id: string
  cod_produs: string
  ean?: string
  nume: string
  brand?: string
  categorie?: string
  subcategorie?: string
  pret?: number
  pret_vechi?: number
  discount_procent?: number
  moneda?: string
  disponibilitate?: string
  unitate_masura?: string
  descriere_scurta?: string
  specificatii?: Record<string, string>
  imagini?: string[]
  rating?: number
  nr_review?: number
  url?: string
}

interface PriceComparison {
  furnizor: string
  pret_furnizor?: number
  diferenta_procent?: number
  cel_mai_ieftin?: string
  disponibilitate_furnizor?: string
  url_furnizor?: string
}

interface CartEntry {
  product: DedemanProduct
  qty: number
}

interface CartMap {
  [cod_produs: string]: CartEntry
}

interface SearchParams {
  query?: string
  categorie?: string
  sortBy?: string
  page?: number
  pageSize?: number
  pretMax?: number | null
  disponibil?: boolean
}

export interface DedemanOrderItem {
  furnizor: string
  cod_produs: string
  ean?: string
  nume: string
  brand?: string
  cantitate: number
  unitate_masura?: string
  pret_unitar?: number
  total?: number
  url?: string
  imagine_url?: string
}

// ── Constants ────────────────────────────────────────────────
const CATEGORII = [
  'Toate',
  'Materiale de constructii',
  'Izolatie',
  'Tencuieli si gleturi',
  'Adezivi si chituri',
  'Pardoseli',
  'Gresie si faianta',
  'Instalatii sanitare',
  'Vopsele si lacuri',
  'Instalatii electrice',
  'Usi si ferestre',
]

// ── Hook: catalog search ─────────────────────────────────────
function useCatalogSearch() {
  const [results, setResults]   = useState<DedemanProduct[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [totalCount, setTotal]  = useState(0)
  const abortRef                = useRef<AbortController | null>(null)
  const supabase                = createClient()

  const search = useCallback(async ({
    query = '',
    categorie = 'Toate',
    sortBy = 'relevance',
    page = 0,
    pageSize = 24,
    pretMax = null,
    disponibil = false,
  }: SearchParams) => {
    setLoading(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    try {
      let q = supabase
        .from('dedeman_catalog')
        .select('*', { count: 'exact' })
        .eq('activ', true)
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (query.trim().length >= 2) {
        q = q.textSearch('nume', query.trim(), { type: 'websearch', config: 'romanian' })
      }
      if (categorie && categorie !== 'Toate') {
        q = q.ilike('categorie', `%${categorie}%`)
      }
      if (pretMax) q = q.lte('pret', pretMax)
      if (disponibil) q = q.ilike('disponibilitate', '%stoc%')

      if (sortBy === 'pret_asc')       q = q.order('pret', { ascending: true })
      else if (sortBy === 'pret_desc') q = q.order('pret', { ascending: false })
      else if (sortBy === 'rating')    q = q.order('rating', { ascending: false })
      else                             q = q.order('nr_review', { ascending: false })

      const { data, error: sbErr, count } = await q
      if (sbErr) throw sbErr

      setResults((data as DedemanProduct[]) || [])
      setTotal(count || 0)
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, totalCount, search }
}

// ── Hook: price comparison ───────────────────────────────────
function usePriceComparison(ean?: string) {
  const [comparisons, setComparisons] = useState<PriceComparison[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!ean) return
    supabase
      .from('v_price_comparison')
      .select('*')
      .eq('ean', ean)
      .then(({ data }) => setComparisons((data as PriceComparison[]) || []))
  }, [ean])

  return comparisons
}

// ── ProductCard ──────────────────────────────────────────────
function ProductCard({
  product, qty, onAdd, onRemove, onShowDetails,
}: {
  product: DedemanProduct
  qty: number
  onAdd: (p: DedemanProduct) => void
  onRemove: (p: DedemanProduct) => void
  onShowDetails: (p: DedemanProduct) => void
}) {
  const isInCart = qty > 0

  return (
    <div className={`relative border rounded-xl p-3 bg-white flex flex-col gap-2 transition-all duration-150
      ${isInCart ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>

      {(product.discount_procent ?? 0) > 0 && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          -{product.discount_procent}%
        </span>
      )}

      {product.imagini?.[0] ? (
        <img
          src={product.imagini[0]}
          alt={product.nume}
          className="w-full h-32 object-contain rounded-lg bg-gray-50"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
          Fără imagine
        </div>
      )}

      <div className="flex-1">
        <p className="text-xs text-gray-400 font-mono">{product.cod_produs}</p>
        <h4
          className="text-sm font-medium text-gray-800 leading-tight mt-0.5 cursor-pointer hover:text-blue-600"
          onClick={() => onShowDetails(product)}
          title={product.nume}
        >
          {product.nume.length > 60 ? product.nume.slice(0, 57) + '…' : product.nume}
        </h4>
        {product.brand && <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>}
      </div>

      <div className="flex items-end gap-2">
        {product.pret ? (
          <>
            <span className="text-lg font-bold text-gray-900">
              {product.pret.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">RON</span>
              {product.unitate_masura && (
                <span className="text-xs text-gray-400">/{product.unitate_masura}</span>
              )}
            </span>
            {product.pret_vechi && (
              <span className="text-xs line-through text-gray-400">{product.pret_vechi.toFixed(2)}</span>
            )}
          </>
        ) : (
          <span className="text-sm text-gray-400 italic">Preț indisponibil</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${
          product.disponibilitate?.toLowerCase().includes('stoc') ? 'bg-green-400' : 'bg-gray-300'
        }`} />
        <span className="text-xs text-gray-500 truncate">{product.disponibilitate || 'Necunoscut'}</span>
      </div>

      {product.rating && (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-current" />
          <span className="text-xs text-gray-500">{product.rating} ({product.nr_review})</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline flex items-center gap-0.5"
        >
          <ExternalLink className="w-3 h-3" />
          Dedeman
        </a>
        <div className="flex items-center gap-1">
          {isInCart && (
            <button
              onClick={() => onRemove(product)}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
          )}
          <span className={`text-sm font-semibold min-w-[20px] text-center ${isInCart ? 'text-blue-600' : 'text-transparent'}`}>
            {qty}
          </span>
          <button
            onClick={() => onAdd(product)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isInCart
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── ProductDetailModal ───────────────────────────────────────
function ProductDetailModal({
  product, onClose, onAdd,
}: {
  product: DedemanProduct
  onClose: () => void
  onAdd: (p: DedemanProduct) => void
}) {
  const comparisons = usePriceComparison(product.ean)
  const [specsOpen, setSpecsOpen] = useState(false)
  const specEntries = Object.entries(product.specificatii || {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b">
          <div>
            <p className="text-xs text-gray-400 font-mono mb-1">{product.cod_produs} · {product.ean}</p>
            <h3 className="text-lg font-semibold text-gray-900">{product.nume}</h3>
            {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {product.pret?.toFixed(2)} <span className="text-lg text-gray-400">RON</span>
            </span>
            {product.pret_vechi && (
              <span className="text-lg line-through text-gray-400">{product.pret_vechi.toFixed(2)}</span>
            )}
            {(product.discount_procent ?? 0) > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                -{product.discount_procent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
              product.disponibilitate?.toLowerCase().includes('stoc') ? 'bg-green-400' : 'bg-red-400'
            }`} />
            {product.disponibilitate || 'Necunoscut'}
          </div>

          {product.descriere_scurta && (
            <p className="text-sm text-gray-600">{product.descriere_scurta}</p>
          )}

          {comparisons.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <ArrowLeftRight className="w-4 h-4" />
                Comparare prețuri
              </h4>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 text-xs">
                      <th className="text-left px-3 py-2">Furnizor</th>
                      <th className="text-right px-3 py-2">Preț</th>
                      <th className="text-right px-3 py-2">Diferență</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-3 py-2 font-medium text-green-700">Dedeman</td>
                      <td className="text-right px-3 py-2 font-semibold">
                        {product.pret?.toFixed(2)} RON
                      </td>
                      <td className="text-right px-3 py-2 text-gray-400">—</td>
                      <td className="px-3 py-2"></td>
                    </tr>
                    {comparisons.map((c) => (
                      <tr key={c.furnizor} className="border-t border-gray-200">
                        <td className="px-3 py-2 font-medium capitalize">{c.furnizor}</td>
                        <td className="text-right px-3 py-2">
                          {c.pret_furnizor ? `${c.pret_furnizor.toFixed(2)} RON` : '—'}
                        </td>
                        <td className={`text-right px-3 py-2 text-xs font-semibold ${
                          (c.diferenta_procent ?? 0) > 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {c.diferenta_procent != null
                            ? `${c.diferenta_procent > 0 ? '+' : ''}${c.diferenta_procent}%`
                            : '—'}
                        </td>
                        <td className="px-3 py-2">
                          {c.cel_mai_ieftin === c.furnizor && (
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Cel mai ieftin</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {specEntries.length > 0 && (
            <div>
              <button
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2"
                onClick={() => setSpecsOpen((v) => !v)}
              >
                Specificații tehnice ({specEntries.length})
                {specsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {specsOpen && (
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {specEntries.map(([k, v], i) => (
                        <tr key={k} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 text-gray-500 font-medium w-1/2">{k}</td>
                          <td className="px-3 py-1.5 text-gray-800">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { onAdd(product); onClose() }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adaugă în comandă
            </button>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-1 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Dedeman.ro
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PDF generator ────────────────────────────────────────────
function generatePurchaseOrderPDF(cartItems: CartEntry[], projectName = 'Proiect') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('COMANDĂ DE ACHIZIȚIE', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Proiect: ${projectName}`, 14, 30)
  doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, 14, 36)
  doc.text(`Nr. articole: ${cartItems.length}`, 14, 42)

  const total = cartItems.reduce((s, i) => s + (i.product.pret || 0) * i.qty, 0)
  doc.text(`Total estimat: ${total.toFixed(2)} RON (fără TVA)`, 14, 48)

  autoTable(doc, {
    startY: 58,
    head: [['Cod', 'Produs', 'Brand', 'U.M.', 'Cant.', 'Preț unit.', 'Total']],
    body: cartItems.map((item) => [
      item.product.cod_produs || '—',
      item.product.nume.slice(0, 45),
      item.product.brand || '—',
      item.product.unitate_masura || 'buc',
      item.qty,
      item.product.pret ? `${item.product.pret.toFixed(2)} RON` : '—',
      item.product.pret ? `${(item.product.pret * item.qty).toFixed(2)} RON` : '—',
    ]),
    foot: [['', '', '', '', '', 'TOTAL:', `${total.toFixed(2)} RON`]],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    footStyles: { fontStyle: 'bold', fillColor: [243, 244, 246] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 65 },
      2: { cellWidth: 25 },
      3: { cellWidth: 12 },
      4: { cellWidth: 12 },
      5: { cellWidth: 22 },
      6: { cellWidth: 22 },
    },
  })

  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text(
    'Generat de BuildingCalc | Prețuri orientative — confirmați la momentul comenzii cu furnizorul.',
    14,
    pageHeight - 10,
  )

  doc.save(`comanda_dedeman_${new Date().toISOString().slice(0, 10)}.pdf`)
}

// ── Main component ───────────────────────────────────────────
export interface DedemanCatalogDrawerProps {
  open: boolean
  onClose: () => void
  onAddItems: (items: DedemanOrderItem[]) => void
  projectName?: string
}

export default function DedemanCatalogDrawer({
  open, onClose, onAddItems, projectName,
}: DedemanCatalogDrawerProps) {
  const { results, loading, error, totalCount, search } = useCatalogSearch()

  const [query, setQuery]         = useState('')
  const [categorie, setCategorie] = useState('Toate')
  const [sortBy, setSortBy]       = useState('relevance')
  const [page, setPage]           = useState(0)
  const [disponibil, setDisponibil] = useState(false)
  const [detailProduct, setDetailProduct] = useState<DedemanProduct | null>(null)

  const [cart, setCart] = useState<CartMap>({})
  const cartItems  = Object.values(cart)
  const cartCount  = cartItems.reduce((s, i) => s + i.qty, 0)
  const cartTotal  = cartItems.reduce((s, i) => s + (i.product.pret || 0) * i.qty, 0)

  useEffect(() => {
    if (!open) return
    setPage(0)
    search({ query, categorie, sortBy, page: 0, disponibil })
  }, [query, categorie, sortBy, disponibil, open])

  useEffect(() => {
    if (!open) return
    search({ query, categorie, sortBy, page, disponibil })
  }, [page])

  const addToCart = (product: DedemanProduct) => {
    setCart((prev) => ({
      ...prev,
      [product.cod_produs]: {
        product,
        qty: (prev[product.cod_produs]?.qty || 0) + 1,
      },
    }))
  }

  const removeFromCart = (product: DedemanProduct) => {
    setCart((prev) => {
      const qty = (prev[product.cod_produs]?.qty || 0) - 1
      if (qty <= 0) {
        const { [product.cod_produs]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [product.cod_produs]: { product, qty } }
    })
  }

  const handleConfirmOrder = () => {
    onAddItems(cartItems.map((item) => ({
      furnizor: 'Dedeman',
      cod_produs: item.product.cod_produs,
      ean: item.product.ean,
      nume: item.product.nume,
      brand: item.product.brand,
      cantitate: item.qty,
      unitate_masura: item.product.unitate_masura,
      pret_unitar: item.product.pret,
      total: (item.product.pret || 0) * item.qty,
      url: item.product.url,
      imagine_url: item.product.imagini?.[0],
    })))
    setCart({})
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-gray-50 z-40 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-white border-b px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Catalog Dedeman</h2>
              <p className="text-xs text-gray-400">
                {totalCount > 0 ? `${totalCount.toLocaleString()} produse` : 'Caută produse'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border-b px-5 py-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută produse... (ex: adeziv weber, rigips, polistiren)"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORII.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevanță</option>
              <option value="pret_asc">Preț crescător</option>
              <option value="pret_desc">Preț descrescător</option>
              <option value="rating">Rating</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
              <input
                type="checkbox"
                checked={disponibil}
                onChange={(e) => setDisponibil(e.target.checked)}
                className="rounded"
              />
              Doar în stoc
            </label>
            <span className="text-xs text-gray-400 ml-auto">
              {totalCount > 0 && `${totalCount.toLocaleString()} rezultate`}
            </span>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3" />
              Se caută...
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">Eroare: {error}</div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Niciun produs găsit.</p>
              <p className="text-xs mt-1">Încearcă un alt termen de căutare.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qty={cart[product.cod_produs]?.qty || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onShowDetails={setDetailProduct}
              />
            ))}
          </div>

          {totalCount > 24 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-30 hover:bg-gray-100"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500">
                Pagina {page + 1} din {Math.ceil(totalCount / 24)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * 24 >= totalCount}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-30 hover:bg-gray-100"
              >
                Următor →
              </button>
            </div>
          )}
        </div>

        {/* Footer sticky coș — apare automat când ai produse selectate */}
        {cartCount > 0 && (
          <div className="bg-green-600 px-5 py-4 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base">
                {cartCount} {cartCount === 1 ? 'produs selectat' : 'produse selectate'}
                <span className="ml-3 text-green-200 text-sm font-normal">
                  Total: {cartTotal.toFixed(2)} RON
                </span>
              </p>
              <p className="text-green-200 text-xs truncate">
                {cartItems.map(i => `${i.qty}× ${i.product.nume}`).join(' · ')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => generatePurchaseOrderPDF(cartItems, projectName)}
                className="flex items-center gap-1.5 text-sm border border-green-400 text-white px-3 py-2 rounded-xl hover:bg-green-700"
              >
                <FileDown className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2 rounded-xl hover:bg-green-50 text-sm shadow"
              >
                <ShoppingCart className="w-4 h-4" />
                Adaugă în Achiziții
              </button>
            </div>
          </div>
        )}
      </div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAdd={addToCart}
        />
      )}
    </>
  )
}
