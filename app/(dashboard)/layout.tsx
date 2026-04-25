import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import Footer from "@/components/Footer"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Background decoration elements for premium feel */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-100/40 via-purple-50/40 dark:from-blue-900/10 dark:via-purple-900/10 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-screen relative z-10">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
          <Footer variant="dashboard" />
        </main>
      </div>
    </div>
  )
}
