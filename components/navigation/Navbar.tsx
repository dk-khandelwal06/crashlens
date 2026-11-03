"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  FlaskConical,
  Flame,
  Clock,
  Compass,
  BookOpen,
  FileText,
  Info,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { NavSection } from "@/src/types";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Radio className="w-4 h-4" /> },
    { id: "dashboard", label: "Intelligence Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "explorer", label: "Hotspot Explorer", icon: <MapPin className="w-4 h-4" /> },
    { id: "laboratory", label: "Clustering Laboratory", icon: <FlaskConical className="w-4 h-4" /> },
    { id: "severity", label: "Severity Intelligence", icon: <Flame className="w-4 h-4" /> },
    { id: "temporal", label: "Temporal Analytics", icon: <Clock className="w-4 h-4" /> },
    { id: "insights", label: "Road Safety Insights", icon: <Compass className="w-4 h-4" /> },
    { id: "methodology", label: "Methodology", icon: <BookOpen className="w-4 h-4" /> },
    { id: "transparency", label: "Data & Transparency", icon: <FileText className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Info className="w-4 h-4" /> },
  ];

  const handleSelect = (id: NavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleSelect("overview")}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-amber to-brand-orange text-white shadow-md shadow-brand-amber/20">
              <ShieldAlert className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-danger opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-danger" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[var(--text-primary)]">
                  Crash<span className="text-brand-orange">Lens</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-amber/15 text-brand-orange border border-brand-amber/30">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] hidden sm:block font-mono">
                Geospatial Accident Intelligence
              </p>
            </div>
          </button>

          {/* Desktop Navigation (Main Tabs) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-brand-orange text-white font-semibold shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Theme Switcher */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-brand-orange text-white font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
