"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  FileText, 
  CalendarDays, 
  FileBadge, 
  ShieldCheck, 
  Briefcase,
  Building2,
  User,
  LogOut,
  X,
  Moon,
  Sun
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Bhargav");
  const [userRole, setUserRole] = useState("Recruiter");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Bhargav");
          // Attempt to fetch role from users table
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role) {
            setUserRole(profile.role.charAt(0).toUpperCase() + profile.role.slice(1));
          }
        }
      } catch (err) {
        console.error("Error loading user in sidebar:", err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const recruiterLinks = [
    { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { name: "Applications", href: "/recruiter/applications", icon: FileText },
    { name: "Interviews", href: "/recruiter/interviews", icon: CalendarDays },
    { name: "Offers", href: "/recruiter/offers", icon: FileBadge },
    { name: "Company Profile", href: "/recruiter/company", icon: Building2 },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
  ];

  const publicLinks = [
    { name: "Jobs Board", href: "/jobs", icon: Briefcase },
  ];

  return (
    <>
      {/* Backdrop for Mobile Overlay */}
      {isOpen && (
        <button 
          onClick={onClose}
          aria-label="Close menu backdrop"
          className="md:hidden fixed inset-0 bg-slate-900 dark:bg-slate-50 dark:text-slate-900 backdrop-blur-sm z-40 transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Main Sidebar Wrapper */}
      <div className={`w-[260px] h-screen bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 shadow-sm flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Branding & Close trigger */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <img src="/Navbar-logo.png" alt="Promptal Hiring Solutions" className="h-10 w-auto dark:hidden" />
            <img src="/Navbar-logo-dark.png" alt="Promptal Hiring Solutions" className="h-10 w-auto hidden dark:block" />
          </Link>

          {isOpen && (
            <button
              onClick={onClose}
              aria-label="Close navigation panel"
              className="md:hidden p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation content */}
        <div className="flex-1 py-6 px-4 space-y-7">
          {/* Recruiter Navigation block */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-3 px-3">
              Recruiter
            </h2>
            <div className="space-y-1">
              {recruiterLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-600 dark:bg-green-700 text-white dark:text-slate-50 shadow-md shadow-emerald-600/10 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-slate-50"}`} />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Admin Navigation block */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-3 px-3">
              Admin
            </h2>
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-600 dark:bg-green-700 text-white dark:text-slate-50 shadow-md shadow-emerald-600/10 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-slate-50"}`} />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Public Navigation block */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-3 px-3">
              Public
            </h2>
            <div className="space-y-1">
              {publicLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-600 dark:bg-green-700 text-white dark:text-slate-50 shadow-md shadow-emerald-600/10 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-slate-50"}`} />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center justify-between gap-2 mb-4 px-2">
            <div className="flex items-center gap-3 hover:bg-white dark:hover:bg-slate-700 p-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-150 dark:hover:border-slate-600 hover:shadow-sm flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:text-green-400 border border-emerald-200/30 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-50 truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">{userRole}</p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 shrink-0 rounded-xl text-slate-400 dark:text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all shadow-sm"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleLogout}
              className="w-full group flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 dark:backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:text-red-500 transition-colors" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
