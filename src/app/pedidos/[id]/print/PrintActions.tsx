"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PrintActions() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
      <Link
        href="/pedidos"
        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-50 shadow-lg transition-all hover:scale-105"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-lg transition-all hover:scale-105"
      >
        <Printer size={16} />
        Imprimir
      </button>
    </div>
  );
}
