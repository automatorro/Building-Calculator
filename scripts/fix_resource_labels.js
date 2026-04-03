const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Re-aplicare etichete transparență (Consum -> Necesar pt. 1)
const consumRegex = /Consum:\s+<input\s+type="number"\s+className="w-12 bg-transparent border-b border-border\/30 text-slate-600 dark:text-slate-300 outline-none"\s+value={res\.consumption}\s+onChange={\(e\) => handleUpdateResourceField\(line\.id, res\.id, 'consumption', e\.target\.value\)}\s+\/>/g;

const newConsumBlock = `Necesar pt. 1 {line.unit || (isManual ? line.manual_um : line.items!.um)}: 
                                               <input 
                                                 type="number"
                                                 className="w-12 bg-transparent border-b border-border/30 text-primary outline-none font-bold"
                                                 value={res.consumption}
                                                 onChange={(e) => handleUpdateResourceField(line.id, res.id, 'consumption', e.target.value)}
                                               />
                                               <span className="italic text-slate-400 font-normal ml-1">
                                                 (Total necesar: {(res.consumption * line.quantity).toLocaleString('ro-RO')} {res.um})
                                               </span>`;

content = content.replace(consumRegex, newConsumBlock);

// 2. Adăugare Cost Total Resursă
const priceRegex = /<div className="text-\[9px\] text-slate-400 uppercase font-black">Preț Unitar \(Lei\)<\/div>/g;

content = content.replace(priceRegex, (match) => {
  return `${match}
                                           <div className="text-[10px] text-primary font-bold">
                                             Cost total: {(res.consumption * line.quantity * (customPrice ?? res.unit_price) * (1 + (res.waste_percent || 0) / 100)).toLocaleString('ro-RO')} lei
                                           </div>`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Resource labels update complete!');
