const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Ștergere stare openLineMenuId și useEffect-ul asociat (linii ~38 și 77-87)
content = content.replace(/\s*const \[openLineMenuId, setOpenLineMenuId\] = useState<string \| null>\(null\)/, '');
content = content.replace(/\s*useEffect\(\(\) => \{\s*if \(\!openLineMenuId\) return[\s\S]+?\}, \[openLineMenuId\]\)/, '');

// 2. Ștergere DOM meniu 3 puncte (linii ~403-431)
const domMeniuRegex = /\s*<div className="relative" data-line-menu-root=\{line\.id\}>[\s\S]+?<\/div>/;
content = content.replace(domMeniuRegex, '');

// 3. Adăugare buton Duplicare în coloana de acțiuni dreapta (linii ~479-484)
const actiuniDreaptaRegex = /<div className="flex flex-col gap-1">\s*<button[\s\S]+?{isExpanded \? <ChevronUp size=\{20\} \/> : <ChevronDown size=\{20\} \/>}\s*<\/button>\s*<button[\s\S]+?<Trash2 size=\{16\} \/>\s*<\/button>\s*<\/div>/;

const newActiuniDreapta = `<div className="flex flex-col gap-1 items-center">
                              <button 
                                onClick={() => setExpandedId(isExpanded ? null : line.id)}
                                className={\`p-1.5 rounded-lg transition-colors \${isExpanded ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}\`}
                                title={isExpanded ? "Restrânge detalii" : "Extinde detalii"}
                              >
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                              <button
                                onClick={() => handleDuplicateLine(line)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Duplică rând"
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Șterge rând"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>`;

content = content.replace(actiuniDreaptaRegex, newActiuniDreapta);

// Save file
fs.writeFileSync(path, content, 'utf8');
console.log('Meniul de 3 puncte a fost eradicat complet!');
