import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
