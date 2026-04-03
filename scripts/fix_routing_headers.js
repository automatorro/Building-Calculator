const fs = require('fs');
const path = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator\\components\\ProjectClientContainer.tsx';
let data = fs.readFileSync(path, 'utf8');

// Modificăm hook-ul de click pe faze
data = data.replace(
  /const handlePhaseClick = \(phase: 'setup' \| 'offer' \| 'execution'\) => \{[\s\S]+?\}/,
  `const handlePhaseClick = (phase: 'setup' | 'offer' | 'execution') => {
    if (phase === 'setup') setView('planning')
    else if (phase === 'offer') setView('deviz')
    else if (phase === 'execution') setView('dashboard')
  }`
);

// Modificăm highlight-ul activ pentru faze
data = data.replace(
  /activePhase=\{\s*view === 'dashboard' \? 'setup' : \(\['planning', 'deviz'\]\.includes\(view\) \? 'offer' : 'execution'\)\s*\}/,
  `activePhase={
            view === 'planning' ? 'setup' : (view === 'deviz' ? 'offer' : 'execution')
          }`
);

fs.writeFileSync(path, data, 'utf8');
console.log('Routing and Phase matching updated successfully!');
