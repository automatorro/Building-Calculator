const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let content = fs.readFileSync(path, 'utf8');

// The block we want to replace starts with: <div className="relative group/quantity">
// And ends with the matching </div> for that block. We'll use regex to target the inside of that group.

const regex = /<input\s+type="number"\s+className="w-24 bg-transparent text-center font-black text-lg outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200\/50 dark:hover:bg-slate-800\/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"\s+value=\{line\.quantity\}\s+onChange=\{\(e\) => handleUpdateQuantity\(line\.id, e\.target\.value\)\}\s+\/>([\s\S]+?)<span className="text-xs font-bold text-slate-400 pr-2">/;

const newLogic = `<input 
                                  type="number" 
                                  className="w-24 bg-transparent text-center font-black text-lg outline-none text-slate-900 dark:text-white p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg cursor-pointer transition-colors border border-transparent focus:border-border"
                                  value={line.quantity}
                                  onChange={(e) => handleUpdateQuantity(line.id, e.target.value)}
                                />
                                {(() => {
                                  const um = (line.unit || (line.manual_um) || '').toLowerCase().trim();
                                  // Asistentul tace dacă unitatea nu este măsurabilă prin dimensiuni fizice (mc, mp, ml)
                                  const validSuggestions = Object.entries(smartValueLabels).filter(([_, v]) => {
                                    if (['m3', 'mc'].includes(um)) return v.type === 'vol';
                                    if (['m2', 'mp'].includes(um)) return v.type === 'area';
                                    if (['ml', 'm'].includes(um)) return v.type === 'lin';
                                    return false; 
                                  });

                                  // Nu se mai randează DOM-ul dacă lista e goală. Asta rezolvă "meniul gigant" pe UM-uri irelevante.
                                  if (validSuggestions.length === 0) return null;

                                  return (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-focus-within:opacity-100 pointer-events-none group-focus-within:pointer-events-auto transition-all z-[100]">
                                      <div className="bg-white dark:bg-slate-900 border border-border shadow-2xl rounded-xl p-2 min-w-[220px]">
                                        <div className="text-[9px] font-black uppercase text-primary mb-2 flex items-center gap-1.5 px-1 pt-1"><Lightbulb size={12} /> Sugestii pt. {um} ✨</div>
                                        <div className="space-y-1">
                                          {validSuggestions.map(([key, value]) => (
                                            <button key={key} type="button" onMouseDown={(e) => { e.preventDefault(); handleUpdateQuantity(line.id, smartValues[key as keyof typeof smartValues].toString()) }} className="w-full text-left p-2 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between group/item">
                                              <span className="text-slate-500 dark:text-slate-400 font-medium">{value.label}</span>
                                              <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{smartValues[key as keyof typeof smartValues].toLocaleString('ro-RO')}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              <span className="text-xs font-bold text-slate-400 pr-2">`;

content = content.replace(regex, newLogic);
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed magic suggestion filter applied!');
