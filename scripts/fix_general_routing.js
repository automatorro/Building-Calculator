const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Utilizator\\.antigravity\\building-calculator';

// --- 1. REPARARE "ALTE LUCRĂRI" -> "Lucrări Generale" ---
const filesToCheck = [
  'utils/calculators/financials.ts',
  'components/EstimateEditor.tsx',
  'components/ProjectClientContainer.tsx',
  'components/ProjectDevizView.tsx',
  'app/share/[token]/page.tsx',
  'app/projects/[id]/print/page.tsx'
];

filesToCheck.forEach(relPath => {
  const fullPath = path.join(basePath, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let newContent = content.replace(/'Alte Lucrări'/g, "'Lucrări Generale'");
    newContent = newContent.replace(/"Alte Lucrări"/g, '"Lucrări Generale"');
    if(newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Updated naming in ${relPath}`);
    }
  }
});

// --- 2. REPARARE RUTARE DUPĂ ADĂUGAREA DIN CATALOG ---
const btnPath = path.join(basePath, 'components/AddToProjectButton.tsx');
if (fs.existsSync(btnPath)) {
  let content = fs.readFileSync(btnPath, 'utf8');
  content = content.replace(/router\.push\(\`\/projects\/\$\{projectId\}\`\)/, "router.push(`/projects/${projectId}?tab=planning`)");
  fs.writeFileSync(btnPath, content, 'utf8');
  console.log('Updated AddToProjectButton.tsx');
}

const containerPath = path.join(basePath, 'components/ProjectClientContainer.tsx');
if (fs.existsSync(containerPath)) {
  let content = fs.readFileSync(containerPath, 'utf8');
  if(!content.includes('useSearchParams')) {
    content = content.replace(/import { useRouter } from 'next\/navigation'/, "import { useRouter, useSearchParams } from 'next/navigation'");
  }
  if(!content.includes('const searchParams = useSearchParams()')) {
    content = content.replace(
      /const \[view, setView\] = useState<Tab>\('dashboard'\)/,
      `const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = searchParams ? (searchParams.get('tab') as Tab) : null;
  const [view, setView] = useState<Tab>(initialTab || 'dashboard')`
    );
    fs.writeFileSync(containerPath, content, 'utf8');
    console.log('Updated ProjectClientContainer.tsx routing!');
  }
}
