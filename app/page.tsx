import Link from 'next/link'
import { Calculator, Bookmark, ArrowRight, Zap, Target, BarChart3, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-[calc(100-64px)] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-24" />

        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs md:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} className="fill-primary" />
            <span>Versiunea 1.2 - Acum cu Optimizare Mobile</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Construiește Inteligent. <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Calculează Precis.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1200 leading-relaxed">
            Platforma completă pentru managementul proiectelor de construcții, generarea automată a devizelor și analize complexe de costuri. 
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1500">
            <Link 
              href="/projects" 
              className="group flex items-center gap-2 bg-primary text-white px-8 py-5 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all w-full sm:w-auto text-center justify-center"
            >
              Proiectele Mele
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/catalog" 
              className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-border px-8 py-5 rounded-2xl text-lg font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all w-full sm:w-auto text-center justify-center"
            >
              Catalog Norme
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="px-4 md:px-8 py-16 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="text-primary" />}
              title="Acuratețe Maximă"
              description="Calculează fiecare resursă (Materiale, Manoperă, Utilaj) cu precizie chirurgicală folosind norme prestabilite."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-blue-500" />}
              title="Management V2"
              description="Organizează proiectele, configurează cotele de profit și recapitația în timp real pentru oferte competitive."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500" />}
              title="Cloud Native"
              description="Toate datele tale sunt securizate și accesibile de oriunde, oricând, prin integrarea cu tehnologia Supabase."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-5xl mx-auto glass-card p-12 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32 group-hover:bg-primary/30 transition-colors" />
          
          <h2 className="text-3xl md:text-5xl font-black mb-6">Pregătit să începi următorul proiect?</h2>
          <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">
            Creează un deviz în câteva secunde, personalizează prețurile resurselor și generează oferta perfectă.
          </p>
          <Link 
            href="/projects/new" 
            className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-all shadow-2xl"
          >
            <Calculator size={24} />
            Crează Proiect Nou
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-border/50 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Calculator size={20} className="text-primary" />
          <span className="font-bold tracking-tight">Building<span className="text-primary">Calc</span></span>
        </div>
        <p className="text-sm text-slate-400">© 2026 Building Calculator App. Toate drepturile rezervate.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8 hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-2 group">
      <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  )
}
