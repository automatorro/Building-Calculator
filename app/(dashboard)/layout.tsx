import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-50 overflow-hidden relative">
      {/* Background decoration elements for premium feel */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-100/40 via-purple-50/40 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-purple-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen relative z-10">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
