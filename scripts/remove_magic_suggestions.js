const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let data = fs.readFileSync(path, 'utf8');

// 1. Eliminarea useMemo pentru smartValues
const smartValuesRegex = /\s*\/\/\s*Calculăm valorile "Smart" disponibile bazate pe dimensiuni[\s\S]+?const smartValues = useMemo\(\(\) => \{[\s\S]+?\}, \[dimensions\]\)/;
data = data.replace(smartValuesRegex, '');

// 2. Eliminarea useMemo pentru smartValueLabels
const smartValueLabelsRegex = /\s*const smartValueLabels: Record<string, \{ label: string, type: 'vol' \| 'area' \| 'lin' \}> = useMemo\(\(\) => \(\{[\s\S]+?\}\), \[\]\)/;
data = data.replace(smartValueLabelsRegex, '');

// 3. Înlocuirea structurii DIV group/quantity și a popup-ului cu un simplu input
const quantityDivRegex = /<div className="relative group\/quantity">[\s\S]+?onChange=\{\(e\) => handleUpdateQuantity\(line\.id, e\.target\.value\)\}\s*\/>[\s\S]+?\(\)\)\(\)\}\s*<\/div>/;
const simpleQuantity = `<div className="relative">
                                <input 
                                  type="number" 
                                  className="w-24 bg-transparent text-center font-black text-lg outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"
                                  value={line.quantity}
                                  onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                />
                              </div>`;

data = data.replace(quantityDivRegex, simpleQuantity);

fs.writeFileSync(path, data, 'utf8');
console.log('Sugestiile inteligente au fost eliminate complet!');
