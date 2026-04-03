const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Restaurare handler-i resurse cu logica completa
const resourceHandlersBlock = `  const handleDuplicateLine = (line: EstimateLine) => {
    onDuplicateLine(line)
  }

  const ensureResourcesOverride = (line: EstimateLine) => {
    if (line.resources_override && line.resources_override.length > 0) return line.resources_override
    return line.items?.resources ? JSON.parse(JSON.stringify(line.items.resources)) : []
  }

  const handleUpdateResourceField = (lineId: string, resId: string, field: string, val: any) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const currentResources = ensureResourcesOverride(line)
    const newResources = currentResources.map((r: any) => {
      if (r.id !== resId) return r
      const isNumeric = ['consumption', 'unit_price', 'waste_percent'].includes(field)
      return { ...r, [field]: isNumeric ? parseFloat(val) || 0 : val }
    })
    onUpdateLine(lineId, { resources_override: newResources })
  }

  const handleAddResource = (lineId: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const currentResources = ensureResourcesOverride(line)
    const newRes = {
      id: crypto.randomUUID(),
      name: 'Resursă nouă',
      type: 'material' as const,
      um: 'buc',
      consumption: 1,
      unit_price: 0,
      waste_percent: 0
    }
    onUpdateLine(lineId, { resources_override: [...currentResources, newRes] })
  }

  const handleDeleteResource = (lineId: string, resId: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const currentResources = ensureResourcesOverride(line)
    const newResources = currentResources.filter((r: any) => r.id !== resId)
    onUpdateLine(lineId, { resources_override: newResources })
  }

  const handleToggleResource = (lineId: string, resId: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const excluded = line.excluded_resources.includes(resId)
      ? line.excluded_resources.filter(id => id !== resId)
      : [...line.excluded_resources, resId]
    onUpdateLine(lineId, { excluded_resources: excluded })
  }

  const handleUpdatePrice = (lineId: string, resId: string, val: string) => {
    const line = lines.find(l => l.id === lineId)
    if (!line) return
    const num = parseFloat(val) || 0
    onUpdateLine(lineId, { custom_prices: { ...line.custom_prices, [resId]: num } })
  }`;

// Targetam zona dintre handleDuplicateLine si handleSaveToLibrary
const targetRegex = /const handleDuplicateLine = \(line: EstimateLine\) => \{[\s\S]+?const handleSaveToLibrary = async \(line: EstimateLine\) => \{/;

content = content.replace(targetRegex, resourceHandlersBlock + '\n\n  const handleSaveToLibrary = async (line: EstimateLine) => {');

// 2. Curatam redundantele si setLines-urile ratacite in handleSmartLink (daca mai sunt)
content = content.replace(/const handleSmartLink[\s\S]+?setIsSaved\(false\)\s+\}/, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Final cleanup and logic restoration complete!');
