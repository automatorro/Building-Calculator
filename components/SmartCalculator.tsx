'use client'

import { useMemo, useState } from 'react'
import { X, Lightbulb, ArrowRight, ArrowLeft, Check, Plus, Minus, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/* ─── Tipuri ───────────────────────────────────────────────────────────────── */
interface Dimensions {
  length: number; width: number; height: number
  foundation_depth: number; foundation_width: number
  slab_thickness: number; wall_thickness: number
  [key: string]: number
}

interface SmartCalculatorProps {
  projectId: string
  initialDimensions: Dimensions
  onSave: (dimensions: Dimensions) => Promise<void>
  onClose: () => void
}

type ProjectType = 'house' | 'apartment' | 'foundation' | 'roof' | 'bathroom'

interface GeneratedLine {
  name: string
  unit: string
  quantity: number
  stage: string
  symbol?: string
  include: boolean
  calc?: string
}

/* ─── Generare linii din parametri ─────────────────────────────────────────── */
function generateLines(type: ProjectType, params: Record<string, number>): GeneratedLine[] {
  const { suprafata = 0, niveluri = 1, perimetru, adancime, latime, inaltime = 3, slab_thickness, wall_thickness, goluri_percent } = params
  const perim = perimetru || Math.sqrt(suprafata) * 4
  const desfasurata = suprafata * niveluri

  switch (type) {
    case 'house': {
      const wallAreaGross = perim * inaltime * niveluri
      const openingsPercent = goluri_percent || 0
      const wallAreaNet = wallAreaGross * (1 - (openingsPercent / 100))
      const wallThickness = wall_thickness || 0.25
      const slabThickness = slab_thickness || 0.15
      return [
        { name: 'Săpătură fundații cu excavatorul', unit: 'mc', quantity: +(suprafata * 0.8).toFixed(1), stage: 'Fundație', symbol: 'TsA02A1', include: true, calc: `${suprafata} * 0.8 = ${(suprafata * 0.8).toFixed(1)} mc` },
        { name: 'Umplutură cu piatră spartă/balast sub fundații', unit: 'mc', quantity: +(suprafata * 0.15).toFixed(1), stage: 'Fundație', symbol: 'TsA07A1', include: true, calc: `${suprafata} * 0.15 = ${(suprafata * 0.15).toFixed(1)} mc` },
        { name: 'Beton simplu fundații continue B150 (C12/15)', unit: 'mc', quantity: +(perim * (latime || 0.6) * (adancime || 0.8)).toFixed(1), stage: 'Fundație', symbol: 'BcA01B1', include: true, calc: `${perim.toFixed(1)} * ${(latime || 0.6).toFixed(2)} * ${(adancime || 0.8).toFixed(2)} = ${(perim * (latime || 0.6) * (adancime || 0.8)).toFixed(1)} mc` },
        { name: 'Beton armat fundații C20/25', unit: 'mc', quantity: +(suprafata * 0.12).toFixed(1), stage: 'Fundație', symbol: 'BcA02A1', include: true, calc: `${suprafata} * 0.12 = ${(suprafata * 0.12).toFixed(1)} mc` },
        { name: 'Armătură OB37 fundații', unit: 'kg', quantity: +(suprafata * 0.12 * 80).toFixed(0), stage: 'Fundație', symbol: 'BcC01A1', include: true, calc: `${suprafata} * 0.12 * 80 = ${(suprafata * 0.12 * 80).toFixed(0)} kg` },
        { name: 'Hidroizolație fundații cu bitum aplicat la cald', unit: 'mp', quantity: +(perim * (adancime || 0.8) * 2).toFixed(1), stage: 'Fundație', symbol: 'IzA04A1', include: true, calc: `${perim.toFixed(1)} * ${(adancime || 0.8).toFixed(1)} * 2 = ${(perim * (adancime || 0.8) * 2).toFixed(1)} mp` },

        { name: `Beton armat planșee C20/25 (${Math.round(slabThickness * 100)} cm)`, unit: 'mc', quantity: +(desfasurata * slabThickness).toFixed(1), stage: 'Structură', symbol: 'BcA05A1', include: true, calc: `${desfasurata} * ${slabThickness.toFixed(2)} = ${(desfasurata * slabThickness).toFixed(1)} mc` },
        { name: 'Cofraje planșee', unit: 'mp', quantity: +(desfasurata).toFixed(1), stage: 'Structură', symbol: 'BcB04A1', include: true, calc: `${desfasurata} = ${desfasurata.toFixed(1)} mp` },
        { name: 'Beton armat stâlpi C25/30', unit: 'mc', quantity: +(desfasurata * 0.03).toFixed(1), stage: 'Structură', symbol: 'BcA03A1', include: true, calc: `${desfasurata} * 0.03 = ${(desfasurata * 0.03).toFixed(1)} mc` },
        { name: 'Cofraje stâlpi', unit: 'mp', quantity: +(desfasurata * 0.03 / 0.25 * 4).toFixed(1), stage: 'Structură', symbol: 'BcB02A1', include: true, calc: `${desfasurata} * 0.03 / 0.25 * 4 = ${(desfasurata * 0.03 / 0.25 * 4).toFixed(1)} mp` },
        { name: 'Plasă sudată STNB planșee', unit: 'mp', quantity: +(desfasurata * 1.1).toFixed(1), stage: 'Structură', symbol: 'BcC02A1', include: true, calc: `${desfasurata} * 1.1 = ${(desfasurata * 1.1).toFixed(1)} mp` },

        { name: `Zidărie din blocuri BCA ${Math.round(wallThickness * 100)} cm`, unit: 'mc', quantity: +(wallAreaNet * wallThickness).toFixed(1), stage: 'Zidărie', symbol: 'ZdA02A1', include: true, calc: `${wallAreaGross.toFixed(1)} * (1 - ${(openingsPercent).toFixed(0)}%) * ${wallThickness.toFixed(2)} = ${(wallAreaNet * wallThickness).toFixed(1)} mc` },
        { name: 'Pereți despărțitori gips-carton simplu', unit: 'mp', quantity: +(suprafata * 0.8).toFixed(1), stage: 'Zidărie', symbol: 'ZdA05A1', include: true, calc: `${suprafata} * 0.8 = ${(suprafata * 0.8).toFixed(1)} mp` },
        { name: 'Centuri din beton armat', unit: 'ml', quantity: +(perim * niveluri).toFixed(1), stage: 'Zidărie', symbol: 'ZdB02A1', include: true, calc: `${perim.toFixed(1)} * ${niveluri} = ${(perim * niveluri).toFixed(1)} ml` },

        { name: 'Șarpantă din lemn ecarisat cu astereală (2 pante)', unit: 'mp', quantity: +(suprafata * 1.3).toFixed(1), stage: 'Acoperiș', symbol: 'CvA01A1', include: true, calc: `${suprafata} * 1.3 = ${(suprafata * 1.3).toFixed(1)} mp` },
        { name: 'Învelitoare din țiglă ceramică', unit: 'mp', quantity: +(suprafata * 1.3).toFixed(1), stage: 'Acoperiș', symbol: 'CvA03A1', include: true, calc: `${suprafata} * 1.3 = ${(suprafata * 1.3).toFixed(1)} mp` },
        { name: 'Jgheaburi și burlane PVC', unit: 'ml', quantity: +(perim * 0.6).toFixed(1), stage: 'Acoperiș', symbol: 'CvA05A1', include: true, calc: `${perim.toFixed(1)} * 0.6 = ${(perim * 0.6).toFixed(1)} ml` },

        { name: 'Tencuială interioară drișcuită', unit: 'mp', quantity: +(wallAreaNet * 1.8).toFixed(1), stage: 'Finisaje', symbol: 'TcA01A1', include: true, calc: `${wallAreaGross.toFixed(1)} * (1 - ${(openingsPercent).toFixed(0)}%) * 1.8 = ${(wallAreaNet * 1.8).toFixed(1)} mp` },
        { name: 'Tencuială exterioară drișcuită', unit: 'mp', quantity: +(wallAreaNet * 0.85).toFixed(1), stage: 'Finisaje', symbol: 'TcA02A1', include: true, calc: `${wallAreaGross.toFixed(1)} * (1 - ${(openingsPercent).toFixed(0)}%) * 0.85 = ${(wallAreaNet * 0.85).toFixed(1)} mp` },
        { name: 'Glet de ipsos interior', unit: 'mp', quantity: +(wallAreaNet * 1.8).toFixed(1), stage: 'Finisaje', symbol: 'TcA03A1', include: true, calc: `${wallAreaGross.toFixed(1)} * (1 - ${(openingsPercent).toFixed(0)}%) * 1.8 = ${(wallAreaNet * 1.8).toFixed(1)} mp` },
        { name: 'Șapă ciment M150 armată (5 cm)', unit: 'mp', quantity: +(desfasurata).toFixed(1), stage: 'Finisaje', symbol: 'TcB05A1', include: true, calc: `${desfasurata} = ${desfasurata.toFixed(1)} mp` },
        { name: 'Vopsire lavabilă interior 2 straturi', unit: 'mp', quantity: +(wallAreaNet * 1.8).toFixed(1), stage: 'Finisaje', symbol: 'ZgA02A1', include: true, calc: `${wallAreaGross.toFixed(1)} * (1 - ${(openingsPercent).toFixed(0)}%) * 1.8 = ${(wallAreaNet * 1.8).toFixed(1)} mp` },
        { name: 'Termoizolație fațade polistiren 10 cm', unit: 'mp', quantity: +(wallAreaNet * 0.85).toFixed(1), stage: 'Finisaje', symbol: 'IzA01A1', include: true, calc: `${wallAreaGross.toFixed(1)} * (1 - ${(openingsPercent).toFixed(0)}%) * 0.85 = ${(wallAreaNet * 0.85).toFixed(1)} mp` },

        { name: 'Ferestre PVC cu geam termoizolant', unit: 'buc', quantity: Math.ceil(suprafata / 15), stage: 'Tâmplărie', symbol: 'TmA01B1', include: true, calc: `ceil(${suprafata} / 15) = ${Math.ceil(suprafata / 15)} buc` },
        { name: 'Uși interioare (standard)', unit: 'buc', quantity: Math.ceil(suprafata / 20), stage: 'Tâmplărie', symbol: 'TmA02A1', include: true, calc: `ceil(${suprafata} / 20) = ${Math.ceil(suprafata / 20)} buc` },
        { name: 'Ușă exterioară metalică', unit: 'buc', quantity: 1, stage: 'Tâmplărie', symbol: 'TmA03A1', include: true, calc: `1 buc` },

        { name: 'Instalație apă rece PP Ø20', unit: 'ml', quantity: +(suprafata * 0.8).toFixed(1), stage: 'Instalații', symbol: 'IsA01A1', include: true, calc: `${suprafata} * 0.8 = ${(suprafata * 0.8).toFixed(1)} ml` },
        { name: 'Instalație apă caldă PP Ø20', unit: 'ml', quantity: +(suprafata * 0.6).toFixed(1), stage: 'Instalații', symbol: 'IsA02A1', include: true, calc: `${suprafata} * 0.6 = ${(suprafata * 0.6).toFixed(1)} ml` },
        { name: 'Canalizare PVC Ø110', unit: 'ml', quantity: +(suprafata * 0.4).toFixed(1), stage: 'Instalații', symbol: 'IsA03B1', include: true, calc: `${suprafata} * 0.4 = ${(suprafata * 0.4).toFixed(1)} ml` },
        { name: 'Centrală termică în condensație 24 kW', unit: 'buc', quantity: 1, stage: 'Instalații', symbol: 'IsC01A1', include: true, calc: `1 buc` },
        { name: 'Instalație electrică cablu 2.5 mm²', unit: 'ml', quantity: +(suprafata * 4).toFixed(0), stage: 'Instalații', symbol: 'IeA01B1', include: true, calc: `${suprafata} * 4 = ${(suprafata * 4).toFixed(0)} ml` },
        { name: 'Tablou electric 8 circuite', unit: 'buc', quantity: 1, stage: 'Instalații', symbol: 'IeA04A1', include: true, calc: `1 buc` },

        { name: 'Organizare de șantier (mobilizare/demobilizare)', unit: 'ls', quantity: 1, stage: 'Organizare șantier', include: false, calc: `1 ls` },
        { name: 'Împrejmuire provizorie șantier (estimare)', unit: 'ml', quantity: +perim.toFixed(1), stage: 'Organizare șantier', include: false, calc: `${perim.toFixed(1)} ml` },
        { name: 'Container deșeuri/evacuare moloz (estimare)', unit: 'ls', quantity: 1, stage: 'Organizare șantier', include: false, calc: `1 ls` },
        { name: 'Utilități provizorii șantier (apă/energie)', unit: 'ls', quantity: 1, stage: 'Racorduri & Avize', include: false, calc: `1 ls` },
        { name: 'Taxe avize/autorizații (estimare)', unit: 'ls', quantity: 1, stage: 'Racorduri & Avize', include: false, calc: `1 ls` },
        { name: 'Trotuar de protecție perimetral (1.0 m lățime)', unit: 'mp', quantity: +(perim * 1.0).toFixed(1), stage: 'Amenajări exterioare', include: false, calc: `${perim.toFixed(1)} * 1.0 = ${(perim * 1.0).toFixed(1)} mp` },
        { name: 'Alee acces (estimare)', unit: 'mp', quantity: +(Math.max(0, suprafata * 0.08)).toFixed(1), stage: 'Amenajări exterioare', include: false, calc: `${suprafata} * 0.08 = ${(Math.max(0, suprafata * 0.08)).toFixed(1)} mp` },
      ]
    }

    case 'apartment': {
      return [
        { name: 'Demontare tencuieli vechi', unit: 'mp', quantity: +(suprafata * 2.5).toFixed(1), stage: 'Demolare', symbol: 'TcA01A1', include: true },
        { name: 'Desfacere pardoseală existentă', unit: 'mp', quantity: +suprafata.toFixed(1), stage: 'Demolare', include: true },

        { name: 'Tencuială interioară drișcuită nouă', unit: 'mp', quantity: +(suprafata * 2.5).toFixed(1), stage: 'Pereți', symbol: 'TcA01A1', include: true },
        { name: 'Glet de ipsos', unit: 'mp', quantity: +(suprafata * 2.5).toFixed(1), stage: 'Pereți', symbol: 'TcA03A1', include: true },
        { name: 'Vopsire lavabilă 2 straturi', unit: 'mp', quantity: +(suprafata * 2.5).toFixed(1), stage: 'Pereți', symbol: 'ZgA02A1', include: true },

        { name: 'Șapă autonivelantă (4-6 cm)', unit: 'mp', quantity: +suprafata.toFixed(1), stage: 'Pardoseli', symbol: 'TcB06A1', include: true },
        { name: 'Parchet laminat 8 mm', unit: 'mp', quantity: +(suprafata * 0.7).toFixed(1), stage: 'Pardoseli', symbol: 'TcB03A1', include: true },
        { name: 'Gresie ceramică antiderapantă', unit: 'mp', quantity: +(suprafata * 0.3).toFixed(1), stage: 'Pardoseli', symbol: 'TcB01A1', include: true },

        { name: 'Ferestre PVC cu geam termoizolant', unit: 'buc', quantity: Math.ceil(suprafata / 20), stage: 'Tâmplărie', symbol: 'TmA01A1', include: true },
        { name: 'Uși interioare', unit: 'buc', quantity: Math.ceil(suprafata / 20), stage: 'Tâmplărie', symbol: 'TmA02A1', include: true },

        { name: 'Înlocuire instalație apă rece PP', unit: 'ml', quantity: +(suprafata * 0.5).toFixed(1), stage: 'Instalații', symbol: 'IsA01A1', include: true },
        { name: 'Înlocuire instalație electrică', unit: 'ml', quantity: +(suprafata * 3).toFixed(0), stage: 'Instalații', symbol: 'IeA01B1', include: true },
      ]
    }

    case 'foundation': {
      const s = suprafata || perim * (latime || 0.6)
      return [
        { name: 'Săpătură fundații cu excavatorul', unit: 'mc', quantity: +(perim * (adancime || 1) * (latime || 0.8)).toFixed(1), stage: 'Fundație', symbol: 'TsA02A1', include: true },
        { name: 'Beton simplu de egalizare B100', unit: 'mc', quantity: +(perim * 0.1 * (latime || 0.6)).toFixed(1), stage: 'Fundație', symbol: 'BcA01A1', include: true },
        { name: 'Beton armat fundații C20/25', unit: 'mc', quantity: +(perim * (adancime || 0.8) * (latime || 0.6)).toFixed(1), stage: 'Fundație', symbol: 'BcA02A1', include: true },
        { name: 'Cofraje fundații', unit: 'mp', quantity: +(perim * (adancime || 0.8) * 2).toFixed(1), stage: 'Fundație', symbol: 'BcB01A1', include: true },
        { name: 'Armătură OB37', unit: 'kg', quantity: +(perim * (adancime || 0.8) * (latime || 0.6) * 80).toFixed(0), stage: 'Fundație', symbol: 'BcC01A1', include: true },
        { name: 'Hidroizolație fundații cu bitum', unit: 'mp', quantity: +(perim * (adancime || 0.8) * 2).toFixed(1), stage: 'Fundație', symbol: 'IzA04A1', include: true },
        { name: 'Umplutură cu pământ bătut manual', unit: 'mc', quantity: +(perim * (adancime || 0.8) * 0.3).toFixed(1), stage: 'Fundație', symbol: 'TsA06A1', include: true },
      ]
    }

    case 'roof': {
      return [
        { name: 'Desfacere învelitoare veche', unit: 'mp', quantity: +(suprafata * 1.3).toFixed(1), stage: 'Acoperiș', include: true },
        { name: 'Reparații șarpantă existentă', unit: 'ml', quantity: +(Math.sqrt(suprafata) * 8).toFixed(1), stage: 'Acoperiș', include: true },
        { name: 'Învelitoare din țiglă ceramică cu astereală', unit: 'mp', quantity: +(suprafata * 1.3).toFixed(1), stage: 'Acoperiș', symbol: 'CvA03A1', include: true },
        { name: 'Hidroizolație sub țiglă (carton bitumat)', unit: 'mp', quantity: +(suprafata * 1.3).toFixed(1), stage: 'Acoperiș', include: true },
        { name: 'Jgheaburi și burlane PVC D100', unit: 'ml', quantity: +(perim * 0.6).toFixed(1), stage: 'Acoperiș', symbol: 'CvA05A1', include: true },
        { name: 'Termoizolație pod vată minerală suflată 20 cm', unit: 'mp', quantity: +(suprafata).toFixed(1), stage: 'Acoperiș', symbol: 'IzA03A1', include: true },
      ]
    }

    case 'bathroom': {
      return [
        { name: 'Desfacere faianță/gresie existentă', unit: 'mp', quantity: +(suprafata * 3.5).toFixed(1), stage: 'Demolări', include: true },
        { name: 'Tencuială pe pereți baie (rezistentă umiditate)', unit: 'mp', quantity: +(suprafata * 2.5).toFixed(1), stage: 'Pereți & Pardoseli', symbol: 'TcA01B1', include: true },
        { name: 'Placare cu faianță ceramică pereți', unit: 'mp', quantity: +(suprafata * 2.5).toFixed(1), stage: 'Pereți & Pardoseli', symbol: 'TcB02A1', include: true },
        { name: 'Placare cu gresie ceramică antiderapantă podea', unit: 'mp', quantity: +suprafata.toFixed(1), stage: 'Pereți & Pardoseli', symbol: 'TcB01A1', include: true },
        { name: 'Lavoar complet cu robineți și sifon', unit: 'buc', quantity: 1, stage: 'Sanitare', symbol: 'IsB01A1', include: true },
        { name: 'Vas WC cu rezervor, complet echipat', unit: 'buc', quantity: 1, stage: 'Sanitare', symbol: 'IsB02A1', include: true },
        { name: 'Cabină duș cu panou și robineți', unit: 'buc', quantity: 1, stage: 'Sanitare', symbol: 'IsB04A1', include: true },
        { name: 'Instalație apă rece PP Ø20', unit: 'ml', quantity: +(suprafata * 2).toFixed(1), stage: 'Sanitare', symbol: 'IsA01A1', include: true },
        { name: 'Instalație apă caldă PP Ø20', unit: 'ml', quantity: +(suprafata * 1.5).toFixed(1), stage: 'Sanitare', symbol: 'IsA02A1', include: true },
        { name: 'Canalizare PVC Ø50', unit: 'ml', quantity: +(suprafata * 1).toFixed(1), stage: 'Sanitare', symbol: 'IsA03A1', include: true },
        { name: 'Spot LED 7W încastrat tavan', unit: 'buc', quantity: Math.ceil(suprafata / 1.5), stage: 'Electrice', symbol: 'IeB02A1', include: true },
      ]
    }

    default:
      return []
  }
}

/* ─── Componenta principală ─────────────────────────────────────────────────── */
export default function SmartCalculator({
  projectId, initialDimensions, onSave, onClose,
}: SmartCalculatorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [params, setParams] = useState<Record<string, number>>({
    suprafata: initialDimensions.length * initialDimensions.width || 100,
    niveluri: 1,
    inaltime: initialDimensions.height || 3,
    adancime: initialDimensions.foundation_depth || 0.8,
    latime: initialDimensions.foundation_width || 0.6,
    perimetru: 0,
    slab_thickness: initialDimensions.slab_thickness || 0.15,
    wall_thickness: initialDimensions.wall_thickness || 0.25,
    goluri_percent: 15,
  })
  const [lines, setLines] = useState<GeneratedLine[]>([])
  const [saving, setSaving] = useState(false)
  const [showDetails, setShowDetails] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  const S = {
    black: '#1E2329', orange: '#E8500A', white: '#FAFAF8',
    gray100: '#F3F2EF', gray200: '#E5E3DE', gray400: '#A8A59E', gray600: '#6B6860',
    serif: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
    sans: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
  }

  const TYPES: { id: ProjectType; label: string; desc: string; icon: string }[] = [
    { id: 'house', label: 'Casă individuală', desc: 'P, P+E, P+M — de la fundație la cheie', icon: '🏠' },
    { id: 'apartment', label: 'Renovare apartament', desc: 'Reabilitare completă interior', icon: '🏢' },
    { id: 'foundation', label: 'Fundație', desc: 'Fundații izolate, continue sau radier', icon: '⛏️' },
    { id: 'roof', label: 'Acoperiș', desc: 'Șarpantă nouă sau înlocuire învelitoare', icon: '🏗️' },
    { id: 'bathroom', label: 'Baie', desc: 'Renovare completă baie cu sanitare', icon: '🚿' },
  ]

  const PARAMS_CONFIG: Record<ProjectType, { key: string; label: string; unit: string; min: number; step: number }[]> = {
    house: [
      { key: 'suprafata', label: 'Suprafață parter (mp)', unit: 'mp', min: 20, step: 5 },
      { key: 'niveluri', label: 'Nr. niveluri (P=1, P+E=2)', unit: '', min: 1, step: 1 },
      { key: 'inaltime', label: 'Înălțime etaj (m)', unit: 'm', min: 2.5, step: 0.1 },
      { key: 'perimetru', label: 'Perimetru casă (ml, opțional)', unit: 'ml', min: 0, step: 1 },
      { key: 'adancime', label: 'Adâncime fundație (m)', unit: 'm', min: 0.5, step: 0.05 },
      { key: 'latime', label: 'Lățime fundație (m)', unit: 'm', min: 0.3, step: 0.05 },
      { key: 'wall_thickness', label: 'Grosime zid exterior (m)', unit: 'm', min: 0.1, step: 0.01 },
      { key: 'slab_thickness', label: 'Grosime planșeu (m)', unit: 'm', min: 0.08, step: 0.01 },
      { key: 'goluri_percent', label: 'Goluri fațadă (%, ferestre/usi)', unit: '%', min: 0, step: 1 },
    ],
    apartment: [
      { key: 'suprafata', label: 'Suprafață utilă (mp)', unit: 'mp', min: 20, step: 5 },
    ],
    foundation: [
      { key: 'perimetru', label: 'Perimetru fundație (ml)', unit: 'ml', min: 10, step: 1 },
      { key: 'adancime', label: 'Adâncime fundație (m)', unit: 'm', min: 0.5, step: 0.1 },
      { key: 'latime', label: 'Lățime fundație (m)', unit: 'm', min: 0.4, step: 0.05 },
    ],
    roof: [
      { key: 'suprafata', label: 'Suprafață la sol (mp)', unit: 'mp', min: 20, step: 5 },
    ],
    bathroom: [
      { key: 'suprafata', label: 'Suprafață baie (mp)', unit: 'mp', min: 2, step: 0.5 },
    ],
  }

  const handleGenerate = () => {
    if (!projectType) return
    const generated = generateLines(projectType, params)
    setLines(generated)
    setStep(3)
  }

  const derived = useMemo(() => {
    const suprafata = params.suprafata || 0
    const niveluri = params.niveluri || 1
    const inaltime = params.inaltime || 3
    const perimetru = params.perimetru || 0
    const perim = perimetru || Math.sqrt(suprafata) * 4
    const desfasurata = suprafata * niveluri
    const wallAreaGross = perim * inaltime * niveluri
    const openingsPercent = params.goluri_percent || 0
    const wallAreaNet = wallAreaGross * (1 - (openingsPercent / 100))
    const wallThickness = params.wall_thickness || 0.25
    const slabThickness = params.slab_thickness || 0.15
    return { suprafata, niveluri, inaltime, perimetru, perim, desfasurata, wallAreaGross, wallAreaNet, openingsPercent, wallThickness, slabThickness }
  }, [params.inaltime, params.niveluri, params.perimetru, params.suprafata, params.goluri_percent, params.wall_thickness, params.slab_thickness])

  const handleSaveLines = async () => {
    setSaving(true)
    const included = lines.filter(l => l.include)
    const symbols = Array.from(new Set(included.map(l => l.symbol).filter(Boolean))) as string[]
    const normsBySymbol = new Map<string, { id: number; symbol: string; name: string; unit: string; category: string; unit_price: number | null; has_components: boolean | null }>()

    if (symbols.length > 0) {
      const { data: norms, error: normsError } = await supabase
        .from('catalog_norms')
        .select('id, symbol, name, unit, category, unit_price, has_components')
        .in('symbol', symbols)

      if (normsError) {
        toast.error('Eroare la încărcarea normelor: ' + normsError.message)
        console.error(normsError)
      } else {
        ;(norms || []).forEach(n => normsBySymbol.set(n.symbol, n))
      }
    }

    const normIdsWithComponents = Array.from(normsBySymbol.values())
      .filter(n => n.has_components)
      .map(n => n.id)

    const resourcesByNormId = new Map<number, Array<{
      id: string
      type: 'material' | 'labor' | 'equipment' | 'transport'
      name: string
      um: string
      consumption: number
      unit_price: number
      waste_percent?: number
    }>>()

    if (normIdsWithComponents.length > 0) {
      const { data: comps, error: compsError } = await supabase
        .from('norm_components')
        .select('id, norm_id, name, unit, qty_per_unit, unit_price, component_type, is_optional, sort_order')
        .in('norm_id', normIdsWithComponents)
        .order('norm_id')
        .order('component_type')
        .order('is_optional')
        .order('sort_order')

      if (compsError) {
        toast.error('Eroare la încărcarea rețetelor: ' + compsError.message)
        console.error(compsError)
      } else {
        ;(comps || []).forEach((c: any) => {
          if (c.is_optional) return
          const compType = String(c.component_type || '').toLowerCase()
          const type = compType === 'material'
            ? 'material'
            : (compType === 'manopera' ? 'labor'
              : (compType === 'transport' ? 'transport'
                : (compType === 'equipment' || compType === 'utilaj' ? 'equipment' : 'material')))
          const normId = Number(c.norm_id)
          const list = resourcesByNormId.get(normId) || []
          list.push({
            id: `nc_${String(c.id)}`,
            type,
            name: c.name || 'Componentă',
            um: c.unit || 'buc',
            consumption: Number(c.qty_per_unit) || 0,
            unit_price: Number(c.unit_price) || 0,
          })
          resourcesByNormId.set(normId, list)
        })
      }
    }

    const toInsert = included.map(l => {
      const norm = l.symbol ? normsBySymbol.get(l.symbol) : undefined

      if (norm) {
        const resources_override = resourcesByNormId.get(norm.id) || []
        return {
          project_id: projectId,
          item_id: null,
          quantity: l.quantity,
          stage_name: l.stage,
          custom_prices: {},
          excluded_resources: [],
          resources_override,
          metadata: {
            source: 'smart_calc',
            catalog_norm_symbol: norm.symbol,
            has_components: !!norm.has_components,
            components_attached: resources_override.length,
          },
          catalog_norm_id: norm.id,
          name: norm.name,
          code: norm.symbol,
          unit: norm.unit,
          unit_price: norm.unit_price ?? 0,
          category: norm.category,
        }
      }

      return {
        project_id: projectId,
        item_id: null,
        manual_name: l.name,
        manual_um: l.unit,
        manual_price: 0,
        quantity: l.quantity,
        stage_name: l.stage,
        custom_prices: {},
        excluded_resources: [],
        resources_override: [],
        metadata: l.symbol ? { source: 'smart_calc', catalog_norm_symbol: l.symbol } : { source: 'smart_calc' },
      }
    })

    const { error } = await supabase.from('estimate_lines').insert(toInsert)

    if (error) {
      toast.error('Eroare la salvare: ' + error.message)
      console.error(error)
    } else {
      // Salvează și dimensiunile
      await onSave({
        length: Math.sqrt(params.suprafata || 100),
        width: Math.sqrt(params.suprafata || 100),
        height: params.inaltime || 3,
        foundation_depth: params.adancime || 0.8,
        foundation_width: params.latime || 0.6,
        slab_thickness: params.slab_thickness || 0.15,
        wall_thickness: params.wall_thickness || 0.25,
      })
      toast.success('Devizul Smart a fost generat și adăugat!')
      router.refresh()
      onClose()
    }
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: S.gray100,
    border: `1px solid ${S.gray200}`, borderRadius: 8, fontSize: 14,
    color: S.black, fontFamily: S.sans, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(30,35,41,0.6)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', display: 'flex',
        flexDirection: 'column', background: S.white, borderRadius: 20,
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)', fontFamily: S.sans, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: S.black, padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: S.orange, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: S.white }}>
                Generator Deviz
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                Pas {step} din 3
              </div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
              padding: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: S.gray200 }}>
          <div style={{ height: '100%', background: S.orange, width: `${(step / 3) * 100}%`,
            transition: 'width .3s' }} />
        </div>

        {/* Conținut */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* Step 1 — Tip proiect */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 400,
                color: S.black, marginBottom: 6 }}>
                Ce vrei să devizezi?
              </h2>
              <p style={{ fontSize: 14, color: S.gray600, marginBottom: 20 }}>
                Alege tipul de lucrare și generăm automat articolele de deviz.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setProjectType(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 16,
                      padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                      border: projectType === t.id ? `2px solid ${S.orange}` : `1px solid ${S.gray200}`,
                      background: projectType === t.id ? '#FFF0E8' : S.white,
                      textAlign: 'left', fontFamily: S.sans, transition: 'all .15s' }}>
                    <span style={{ fontSize: 28 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: S.black }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: 12, color: S.gray600 }}>{t.desc}</div>
                    </div>
                    {projectType === t.id && (
                      <Check size={18} style={{ marginLeft: 'auto', color: S.orange, flexShrink: 0 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Parametri */}
          {step === 2 && projectType && (
            <div>
              <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 400,
                color: S.black, marginBottom: 6 }}>
                Parametrii lucrării
              </h2>
              <p style={{ fontSize: 14, color: S.gray600, marginBottom: 20 }}>
                Completează dimensiunile și generăm cantitățile automat.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {PARAMS_CONFIG[projectType].map(p => (
                  <div key={p.key}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
                      color: S.black, marginBottom: 6 }}>
                      {p.label}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setParams(prev => ({
                        ...prev, [p.key]: Math.max(p.min, (prev[p.key] || p.min) - p.step)
                      }))} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${S.gray200}`,
                        background: S.white, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Minus size={14} />
                      </button>
                      <input type="number" value={params[p.key] || p.min}
                        min={p.min} step={p.step}
                        onChange={e => setParams(prev => ({ ...prev, [p.key]: parseFloat(e.target.value) || p.min }))}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = S.orange)}
                        onBlur={e => (e.target.style.borderColor = S.gray200)} />
                      <button onClick={() => setParams(prev => ({
                        ...prev, [p.key]: (prev[p.key] || p.min) + p.step
                      }))} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${S.gray200}`,
                        background: S.white, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Plus size={14} />
                      </button>
                      {p.unit && (
                        <span style={{ fontSize: 13, color: S.gray400, flexShrink: 0 }}>{p.unit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Preview linii generate */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 400,
                color: S.black, marginBottom: 6 }}>
                Previzualizare deviz generat
              </h2>
              <div style={{
                border: `1px solid ${S.gray200}`, background: S.gray100, borderRadius: 12,
                padding: '12px 14px', marginBottom: 14,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: S.black, marginBottom: 6 }}>
                  Cum sunt calculate cantitățile
                </div>
                <div style={{ fontSize: 12, color: S.gray600, lineHeight: 1.4 }}>
                  Cantitățile sunt estimări din parametrii introduși. Simbolul (ex: TsA02A1) leagă articolul de catalogul de norme; prețul vine din catalog dacă există.
                </div>
                {projectType === 'house' && (
                  <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                    <div style={{ fontSize: 11, color: S.gray600 }}>
                      Suprafață parter: <span style={{ fontWeight: 700, color: S.black }}>{derived.suprafata.toLocaleString('ro-RO')}</span> mp · Niveluri: <span style={{ fontWeight: 700, color: S.black }}>{derived.niveluri}</span> · Înălțime etaj: <span style={{ fontWeight: 700, color: S.black }}>{derived.inaltime.toLocaleString('ro-RO')}</span> m
                    </div>
                    <div style={{ fontSize: 11, color: S.gray600 }}>
                      Perimetru: <span style={{ fontWeight: 700, color: S.black }}>{derived.perim.toLocaleString('ro-RO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span> ml <span style={{ color: S.gray400 }}>
                        ({derived.perimetru ? 'introdus' : 'estimat: √suprafață × 4'})
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: S.gray600 }}>
                      Suprafață desfășurată: <span style={{ fontWeight: 700, color: S.black }}>{derived.desfasurata.toLocaleString('ro-RO')}</span> mp · Pereți: <span style={{ fontWeight: 700, color: S.black }}>{derived.wallAreaNet.toLocaleString('ro-RO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span> mp <span style={{ color: S.gray400 }}>
                        (brut {derived.wallAreaGross.toLocaleString('ro-RO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mp, goluri {derived.openingsPercent.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontSize: 12, color: S.gray600 }}>
                    {lines.filter(l => l.include).length} articole selectate. Bifează/debifează orice linie.
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetails(v => !v)}
                    style={{
                      padding: '6px 10px', borderRadius: 10, border: `1px solid ${S.gray200}`,
                      background: S.white, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      color: showDetails ? S.orange : S.gray600, fontFamily: S.sans,
                    }}
                  >
                    {showDetails ? 'Ascunde explicații' : 'Arată explicații'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[...new Set(lines.map(l => l.stage))].map(stage => (
                  <div key={stage}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: S.gray400,
                      textTransform: 'uppercase', letterSpacing: '.06em',
                      padding: '8px 0 4px' }}>
                      {stage}
                    </div>
                    {lines.filter(l => l.stage === stage).map((line, i) => {
                      const idx = lines.indexOf(line)
                      return (
                        <div key={i} onClick={() => setLines(prev =>
                          prev.map((l, j) => j === idx ? { ...l, include: !l.include } : l)
                        )} style={{ display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                          background: line.include ? S.white : S.gray100,
                          border: `1px solid ${line.include ? S.gray200 : S.gray100}`,
                          opacity: line.include ? 1 : 0.5, transition: 'all .15s',
                          marginBottom: 4 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                            border: `2px solid ${line.include ? S.orange : S.gray200}`,
                            background: line.include ? S.orange : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {line.include && <Check size={12} color="white" />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: S.black,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {line.name}
                            </div>
                            {line.symbol && (
                              <div style={{ fontSize: 10, color: S.orange, fontFamily: 'monospace' }}>
                                {line.symbol}
                              </div>
                            )}
                            {showDetails && line.calc && (
                              <div style={{ fontSize: 11, color: S.gray600 }}>
                                {line.calc}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: S.black }}>
                              {line.quantity.toLocaleString('ro-RO')}
                            </div>
                            <div style={{ fontSize: 11, color: S.gray400 }}>{line.unit}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${S.gray200}`,
          display: 'flex', gap: 10, justifyContent: 'space-between',
          background: S.gray100 }}>
          {step > 1 ? (
            <button onClick={() => setStep(step === 3 ? 2 : 1 as any)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                background: S.white, border: `1px solid ${S.gray200}`, borderRadius: 8,
                fontSize: 14, fontWeight: 500, color: S.gray600, cursor: 'pointer',
                fontFamily: S.sans }}>
              <ArrowLeft size={15} /> Înapoi
            </button>
          ) : (
            <button onClick={onClose}
              style={{ padding: '10px 18px', background: 'transparent',
                border: `1px solid ${S.gray200}`, borderRadius: 8, fontSize: 14,
                fontWeight: 500, color: S.gray600, cursor: 'pointer', fontFamily: S.sans }}>
              Anulează
            </button>
          )}

          {step === 1 && (
            <button onClick={() => projectType && setStep(2)} disabled={!projectType}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                background: projectType ? S.orange : S.gray200, border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, color: 'white',
                cursor: projectType ? 'pointer' : 'not-allowed', fontFamily: S.sans }}>
              Continuă <ArrowRight size={15} />
            </button>
          )}

          {step === 2 && (
            <button onClick={handleGenerate}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                background: S.orange, border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer',
                fontFamily: S.sans }}>
              Generează deviz <ArrowRight size={15} />
            </button>
          )}

          {step === 3 && (
            <button onClick={handleSaveLines} disabled={saving || lines.filter(l => l.include).length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                background: saving ? S.gray400 : S.orange, border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, color: 'white',
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: S.sans }}>
              {saving ? <><Loader2 size={15} /> Se salvează...</> : <><Save size={15} /> Adaugă în deviz ({lines.filter(l => l.include).length})</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
