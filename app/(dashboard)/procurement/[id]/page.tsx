"use client"

import { useState, useEffect } from "react"
import { Package, Search, Filter, Warehouse, CheckCircle2 } from "lucide-react"

// Hardcoded for MVP presentation
const MOCK_SUPRAFATA = 150 // mp

// Generate mockup suppliers and prices per material
const generateSuppliers = (basePrice: number) => [
  { id: 's1', name: 'Construct Depot', price: Math.round(basePrice * 0.95), delivery: '2 zile' },
  { id: 's2', name: 'BricoExpert', price: Math.round(basePrice * 1.05), delivery: '1 zi' },
  { id: 's3', name: 'Materiale.ro', price: Math.round(basePrice * 1.0), delivery: '3 zile' },
]

const MATERIAL_CATALOG = [
  { id: '1', name: 'Beton B250', category: 'Fundație & Structură', coef: 0.4, unit: 'mc', basePrice: 350 },
  { id: '2', name: 'Fier Beton PC52', category: 'Structură', coef: 25, unit: 'kg', basePrice: 4.5 },
  { id: '3', name: 'BCA 20x24x60', category: 'Zidărie', coef: 0.5, unit: 'mc', basePrice: 550 },
  { id: '4', name: 'Lemn Construcții', category: 'Acoperiș', coef: 0.05, unit: 'mc', basePrice: 900 },
  { id: '5', name: 'Țiglă Metalică', category: 'Acoperiș', coef: 1.2, unit: 'mp', basePrice: 45 },
]

export default function ProcurementPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [selectedSuppliers, setSelectedSuppliers] = useState<Record<string, string>>({}) // material_id -> supplier_id

  useEffect(() => {
    // Calcul cantități și generare furnizori
    const calcs = MATERIAL_CATALOG.map(mat => {
      const quantity = Math.round(MOCK_SUPRAFATA * mat.coef)
      const suppliers = generateSuppliers(mat.basePrice)
      return { ...mat, quantity, suppliers }
    })
    setMaterials(calcs)
    
    // Auto-select cheapest supplier by default
    const initialSelections: Record<string, string> = {}
    calcs.forEach(mat => {
      const cheapest = mat.suppliers.reduce((prev, curr) => prev.price < curr.price ? prev : curr)
      initialSelections[mat.id] = cheapest.id
    })
    setSelectedSuppliers(initialSelections)
  }, [])

  const handleSelectSupplier = (materialId: string, supplierId: string) => {
    setSelectedSuppliers(prev => ({ ...prev, [materialId]: supplierId }))
  }

  // Calculate total optimized cost
  const totalCost = materials.reduce((acc, mat) => {
    const selectedId = selectedSuppliers[mat.id]
    const supplier = mat.suppliers.find((s: any) => s.id === selectedId)
    const price = supplier ? supplier.price : 0
    return acc + (mat.quantity * price)
  }, 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Achiziții Materiale
          </h1>
          <p className="text-slate-500 mt-1">Compară prețurile furnizorilor și optimizează costul final de achiziție.</p>
        </div>
        
        <div className="glass-card px-6 py-3 border-green-200 bg-green-50/50 flex items-center gap-4">
           <div className="text-sm text-green-700 font-medium">Cost Achiziție Optimizat:</div>
           <div className="text-2xl font-bold text-green-700">{totalCost.toLocaleString('ro-RO')} RON</div>
        </div>
      </div>

      <div className="space-y-6">
        {materials.map((mat) => (
          <div key={mat.id} className="glass-card overflow-hidden">
            {/* Material Header */}
            <div className="p-5 border-b border-slate-200 bg-white/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{mat.name}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">{mat.category}</span>
                  <span>Necesar: <strong className="text-slate-700">{mat.quantity} {mat.unit}</strong></span>
                </div>
              </div>
            </div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50/50">
              {mat.suppliers.map((supplier: any) => {
                const isSelected = selectedSuppliers[mat.id] === supplier.id
                const costForThisSupplier = supplier.price * mat.quantity
                
                return (
                  <button 
                    key={supplier.id}
                    onClick={() => handleSelectSupplier(mat.id, supplier.id)}
                    className={`relative p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/30 shadow-md shadow-blue-500/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Warehouse className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                        {supplier.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Preț unitar</div>
                        <div className="font-medium text-slate-900">{supplier.price} RON/{mat.unit}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 mb-0.5">Cost total</div>
                        <div className={`font-bold ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                          {costForThisSupplier.toLocaleString('ro-RO')} RON
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                      Livrează în {supplier.delivery}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
