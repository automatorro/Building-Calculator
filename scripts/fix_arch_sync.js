const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Props and remove local state
const propsRegex = /interface EstimateEditorProps \{[\s\S]+?\}\s+export default function EstimateEditor\(\{ projectId, initialLines, settings, dimensions \}: EstimateEditorProps\) \{[\s\S]+?const supabase = createClient\(\)/;

const newStart = `interface EstimateEditorProps {
  projectId: string
  lines: EstimateLine[]
  settings: ProjectSettings
  dimensions: any
  onUpdateLine: (id: string, updates: Partial<EstimateLine>) => void
  onAddLine: (stageName?: string) => void
  onDeleteLine: (id: string) => void
  onDuplicateLine: (line: EstimateLine) => void
  isSaving: boolean
  isSaved: boolean
}

export default function EstimateEditor({ 
  projectId, 
  lines, 
  settings, 
  dimensions,
  onUpdateLine,
  onAddLine,
  onDeleteLine,
  onDuplicateLine,
  isSaving,
  isSaved
}: EstimateEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeOfferPicker, setActiveOfferPicker] = useState<{ resourceId: string, resourceName: string, lineId: string } | null>(null)
  const [openLineMenuId, setOpenLineMenuId] = useState<string | null>(null)
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({})
  const [didInitCollapse, setDidInitCollapse] = useState(false)
  const supabase = createClient()`;

content = content.replace(propsRegex, newStart);

// 2. Update handlers to use parent callbacks
const handlersRegex = /const handleUpdateQuantity = [\s\S]+?const handleDuplicateLine = \(line: EstimateLine\) => \{[\s\S]+?\}/;

const newHandlers = `  const handleUpdateQuantity = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    onUpdateLine(id, { quantity: num })
  }

  const handleUpdateManualField = (id: string, field: 'manual_name' | 'manual_um' | 'manual_price' | 'manual_labor_price' | 'manual_equipment_price' | 'manual_transport_price', val: string) => {
    const isNumeric = field !== 'manual_name' && field !== 'manual_um'
    const newVal = isNumeric ? parseFloat(val) || 0 : val
    onUpdateLine(id, { [field]: newVal })
  }

  const handleAddManualLine = (stageName?: string) => {
    onAddLine(stageName)
  }

  const handleDeleteLine = (id: string) => {
    onDeleteLine(id)
    toast.success('Rând șters.')
  }

  const handleDuplicateLine = (line: EstimateLine) => {
    onDuplicateLine(line)
  }`;

content = content.replace(handlersRegex, newHandlers);

// 3. Update other resource-related handlers to use onUpdateLine
content = content.replace(/setLines\(lines\.map\(l => \{[\s\S]+?\}\)\)/g, (match) => {
  if (match.includes('resources_override')) return `onUpdateLine(l.id, { resources_override: newResources })`;
  if (match.includes('excluded_resources')) return `onUpdateLine(l.id, { excluded_resources: excluded })`;
  if (match.includes('custom_prices')) return `onUpdateLine(lineId, { custom_prices: { ...l.custom_prices, [resId]: num } })`;
  return match;
});

// 4. Update the JSX for the Save Button (now using props)
content = content.replace(/onClick=\{handleSave\}/g, 'onClick={() => {}}'); // It will be passive now
content = content.replace(/disabled=\{loading\}/g, 'disabled={isSaving}');
content = content.replace(/\{loading \? 'Se salvează\.\.\.' : isSaved \? <><CheckCircle2 size=\{18\} \/> Salvat!<\/>/g, 
                          '{isSaving ? "Se salvează..." : isSaved ? <><CheckCircle2 size={18} /> Salvat!</>');

fs.writeFileSync(path, content, 'utf8');
console.log('Final architectural sync complete!');
