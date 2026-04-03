const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\EstimateEditor.tsx';
let data = fs.readFileSync(path, 'utf8');

// The problematic block:
const fixRegex = /<button[\s\n]*type="button"[\s\n]*onClick=\{\(\) => \{ handleDuplicateLine\(line\); setOpenLineMenuId\(null\) \}\}[\s\n]*className="w-full text-left p-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold"[\s\n]*>[\s\n]*<Copy size=\{14\} \/> Duplică rând[\s\n]*<\/button>[\s\n]*<button[\s\n]*type="button"[\s\n]*onClick=\{\(\) => \{ handleDeleteLine\(line\.id\); setOpenLineMenuId\(null\) \}\}[\s\n]*className="w-full text-left p-2 text-xs rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950\/30 transition-colors flex items-center gap-2 font-bold"[\s\n]*>[\s\n]*<Trash2 size=\{14\} \/> Șterge rând[\s\n]*<\/button>[\s\n]*<\/div>[\s\n]*\)\}[\s\n]*<\/div>/m;

data = data.replace(fixRegex, '');
fs.writeFileSync(path, data, 'utf8');
console.log('Syntax error fixed!');
