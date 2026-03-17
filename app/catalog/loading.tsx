export default function CatalogLoading() {
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto animate-pulse">
      <header className="mb-12">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
        <div className="h-4 w-full max-w-2xl bg-slate-200 dark:bg-slate-800 rounded" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Skeletons */}
        <div className="space-y-8">
          <div className="glass-card p-6 h-48 bg-slate-100 dark:bg-slate-800/50" />
          <div className="glass-card p-6 h-32 bg-slate-100 dark:bg-slate-800/50" />
        </div>

        {/* List Skeletons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-border rounded-xl h-32" />
          ))}
        </div>
      </div>
    </main>
  )
}
