const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Curățarea meniului contextual (3 puncte)
// Căutăm blocul de la meniul de 3 puncte și eliminăm secțiunea Smart Link
const menuRegex = /<MoreVertical size=\{16\} className=\{line\.metadata\?\.smart_link \? 'text-primary' : ''\} \/>[\s\S]+?<\/button>[\s\S]+?{openLineMenuId === line\.id && \([\s\S]+?<\/div>\s+\)\s+}/g;

// Mai simplu: vizăm blocul de opțiuni din interiorul meniului
const menuOptionsRegex = /<div className="text-\[10px\] font-black uppercase text-slate-400 mb-2 px-2 tracking-widest">Acțiuni rând<\/div>[\s\S]+?<\/div>(\s+)\)\s+}/g;

content = content.replace(menuOptionsRegex, (match, indent) => {
  return `<div className="text-[10px] font-black uppercase text-slate-400 mb-2 px-2 tracking-widest">Acțiuni rând</div>
                                    <button
                                      type="button"
                                      onClick={() => { handleDuplicateLine(line); setOpenLineMenuId(null) }}
                                      className="w-full text-left p-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold"
                                    >
                                      <Copy size={14} /> Duplică rând
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { handleDeleteLine(line.id); setOpenLineMenuId(null) }}
                                      className="w-full text-left p-2 text-xs rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2 font-bold"
                                    >
                                      <Trash2 size={14} /> Șterge rând
                                    </button>
                                  </div>
                                )${indent}}`;
});

// 2. Implementarea sugestiilor pe input-ul de cantitate
const inputRegex = /<input\s+type="number"\s+className="w-24 bg-transparent text-center font-black text-lg outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200\/50 dark:hover:bg-slate-800\/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"\s+value={line\.quantity}\s+onChange={\(e\) => handleUpdateQuantity\(line\.id, e\.target\.value\)}\s+\/>/g;

const newQuantityBlock = `<div className="relative group/quantity">
                                <input 
                                  type="number" 
                                  className="w-24 bg-transparent text-center font-black text-lg outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"
                                  value={line.quantity}
                                  onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                />
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-focus-within:opacity-100 pointer-events-none group-focus-within:pointer-events-auto transition-all z-[100]">
                                  <div className="bg-white dark:bg-slate-900 border border-border shadow-2xl rounded-xl p-2 min-w-[220px]">
                                    <div className="text-[9px] font-black uppercase text-primary mb-2 flex items-center gap-1.5 px-1 pt-1"><Lightbulb size={12} /> Sugestii din proiect ✨</div>
                                    <div className="space-y-1">
                                      {Object.entries(smartValueLabels)
                                        .filter(([_, v]) => {
                                          const um = (line.unit || (line.manual_um) || '').toLowerCase();
                                          if (um === 'm3' || um === 'mc') return v.type === 'vol';
                                          if (um === 'm2' || um === 'mp') return v.type === 'area';
                                          if (um === 'ml' || um === 'm') return v.type === 'lin';
                                          return true; 
                                        })
                                        .map(([key, value]) => (
                                          <button key={key} type="button" onMouseDown={(e) => { e.preventDefault(); handleUpdateQuantity(line.id, smartValues[key].toString()) }} className="w-full text-left p-2 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between group/item">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">{value.label}</span>
                                            <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{smartValues[key].toLocaleString('ro-RO')}</span>
                                          </button>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>`;

content = content.replace(inputRegex, newQuantityBlock);

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete!');
