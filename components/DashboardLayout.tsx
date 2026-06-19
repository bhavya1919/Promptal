"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <Menu className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-800 text-lg tracking-tight">Promtal Jobs</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Responsive Sidebar component */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex-1 md:ml-[260px] pt-16 md:pt-0 overflow-x-hidden min-h-screen flex flex-col">
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
