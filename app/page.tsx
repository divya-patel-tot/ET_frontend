'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, Menu, X, Moon, Sun, ArrowRight, CheckCircle,
  Sparkles, BarChart3, PiggyBank, Receipt, Download,
  Shield, ChevronRight, Star,
} from 'lucide-react';

// ─── Theme hook ─────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { dark, toggle };
}

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Auto-Fill',
    desc: 'Paste any bill, SMS, or receipt. Gemini AI extracts the amount, category, and date automatically — no manual typing needed.',
    badge: 'Powered by Gemini',
  },
  {
    icon: BarChart3,
    title: 'Spending Insights',
    desc: 'Beautiful donut and bar charts show exactly where your money goes — by category and over the last 6 months.',
    badge: 'Visual Analytics',
  },
  {
    icon: PiggyBank,
    title: 'Budget Alerts',
    desc: 'Set monthly limits per category. Get yellow warnings at 80% and red alerts when you hit 100% — stay in control.',
    badge: 'Smart Limits',
  },
  {
    icon: Receipt,
    title: 'Full Expense CRUD',
    desc: 'Add, edit, and delete expenses with rich filters by category and month. Paginated list keeps things fast.',
    badge: 'Complete Control',
  },
  {
    icon: Download,
    title: 'CSV Export',
    desc: 'Export your expense history as a CSV file — filter by month or export all-time. Works with Excel and Sheets.',
    badge: 'Data Portability',
  },
  {
    icon: Shield,
    title: 'Secure Auth',
    desc: 'JWT authentication with bcrypt-hashed passwords. Protected routes on both frontend and backend keep your data safe.',
    badge: 'JWT + bcrypt',
  },
];

const STEPS = [
  { num: '01', title: 'Create your account', desc: 'Sign up in under 30 seconds. No credit card required.' },
  { num: '02', title: 'Add expenses your way', desc: 'Type manually, or paste a receipt and let AI do the work.' },
  { num: '03', title: 'Track and stay on budget', desc: 'View charts, set limits, export reports — all in one place.' },
];

const STATS = [
  { value: '< 30s', label: 'To sign up' },
  { value: 'AI', label: 'Auto-extracts data' },
  { value: '7', label: 'Expense categories' },
  { value: '100%', label: 'Free to use' },
];

// ─── Components ──────────────────────────────────────────────────────────────
const Navbar = ({ dark, toggle }: { dark: boolean; toggle: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const base = dark
    ? `fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-sm' : 'bg-transparent'}`
    : `fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm' : 'bg-transparent'}`;

  const textCls = dark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const logoCls = dark ? 'text-white' : 'text-slate-900';

  return (
    <nav className={base}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`font-bold text-lg ${logoCls}`}>SpendSmart</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How it works', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className={`text-sm font-medium transition-colors ${textCls}`}>
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggle}
              className={`p-2 rounded-lg transition-colors ${dark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/login"
              className={`hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg transition-colors ${dark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
              Sign in
            </Link>
            <Link href="/register"
              className="text-sm font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
              Get started
            </Link>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen
                ? <X className={`w-5 h-5 ${dark ? 'text-slate-300' : 'text-slate-600'}`} />
                : <Menu className={`w-5 h-5 ${dark ? 'text-slate-300' : 'text-slate-600'}`} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden border-t py-4 space-y-3 ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
            {['Features', 'How it works'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${textCls}`}>
                {item}
              </a>
            ))}
            <div className="px-4 pt-2 flex flex-col gap-2">
              <Link href="/login" className={`text-sm font-medium text-center py-2 rounded-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>Sign in</Link>
              <Link href="/register" className="text-sm font-semibold text-center py-2 bg-indigo-600 text-white rounded-lg">Get started free</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { dark, toggle } = useTheme();

  const bg = dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';
  const subText = dark ? 'text-slate-400' : 'text-slate-500';
  const cardBg = dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const sectionBg = dark ? 'bg-slate-900/50' : 'bg-slate-50';
  const divider = dark ? 'border-slate-800' : 'border-slate-200';
  const mutedBg = dark ? 'bg-slate-800' : 'bg-slate-100';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <Navbar dark={dark} toggle={toggle} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Subtle background gradient */}
        <div className={`absolute inset-0 ${dark ? 'opacity-30' : 'opacity-10'} pointer-events-none`}
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -20%, #6366f1, transparent)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border ${dark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered expense tracking — free forever
          </div>

          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Track expenses{' '}
            <span className="text-indigo-600">intelligently</span>
          </h1>

          <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${subText}`}>
            Paste a receipt or SMS and our AI extracts everything instantly. Beautiful dashboards,
            smart budget alerts, and CSV export — all in one clean app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm w-full sm:w-auto justify-center">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login"
              className={`flex items-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all duration-200 border text-sm w-full sm:w-auto justify-center ${dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
              Sign in to your account
            </Link>
          </div>

          {/* Trust row */}
          <div className={`flex items-center justify-center gap-6 mt-10 text-xs ${subText}`}>
            {['No credit card required', 'Free forever', 'Setup in 2 minutes'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className={`border-y py-10 ${sectionBg} ${divider}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
                <p className={`text-sm mt-1 ${subText}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className={`text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3`}>Features</p>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
              Everything you need to master your finances
            </h2>
            <p className={`text-base max-w-xl mx-auto ${subText}`}>
              Built with a SaaS-grade tech stack — Next.js, Express, MongoDB, and Google Gemini AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div key={title}
                className={`rounded-2xl border p-6 hover:border-indigo-300 transition-all duration-300 group ${cardBg}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                    <Icon className={`w-5 h-5 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    {badge}
                  </span>
                </div>
                <h3 className={`font-semibold text-base mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${subText}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Highlight ──────────────────────────────────────────────────── */}
      <section className={`py-20 px-4 border-y ${sectionBg} ${divider}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">AI Auto-Fill</p>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
                Stop typing. Start pasting.
              </h2>
              <p className={`text-base leading-relaxed mb-6 ${subText}`}>
                Copy a payment SMS, a bill, or a receipt from any app. Our Gemini-powered AI reads the text and fills in the amount, category, date, and note — instantly.
              </p>
              <ul className="space-y-3">
                {[
                  'Understands bank SMS and payment confirmations',
                  'Recognizes dates in any common format',
                  'Maps to the right category automatically',
                  'You review and confirm before saving',
                ].map((item) => (
                  <li key={item} className={`flex items-start gap-3 text-sm ${subText}`}>
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup card */}
            <div className={`rounded-2xl border p-6 ${cardBg}`}>
              <p className={`text-xs font-medium mb-3 ${subText}`}>Paste your text here</p>
              <div className={`rounded-xl p-4 text-sm font-mono mb-4 ${mutedBg} ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                Paid $45.99 at Whole Foods Market on Jan 15, 2024. Ref: TXN928374
              </div>
              <div className={`flex items-center gap-2 justify-center py-2 mb-4 text-sm font-semibold text-indigo-600 ${dark ? 'bg-indigo-500/10' : 'bg-indigo-50'} rounded-xl`}>
                <Sparkles className="w-4 h-4" /> Extracting with AI...
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Amount', '$45.99'], ['Category', '🍔 Food'], ['Date', 'Jan 15, 2024'], ['Note', 'Whole Foods Market']].map(([label, val]) => (
                  <div key={label} className={`rounded-xl p-3 ${mutedBg}`}>
                    <p className={`text-xs ${subText} mb-1`}>{label}</p>
                    <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">How it works</p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Up and running in minutes
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-bold ${dark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                  {num}
                </div>
                <h3 className={`font-semibold text-base mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${subText}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial / Social proof ────────────────────────────────────── */}
      <section className={`py-16 px-4 border-y ${sectionBg} ${divider}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className={`text-lg font-medium leading-relaxed mb-4 ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
            "I pasted my grocery bill and it filled everything in instantly. The dashboard charts make it so easy to see where I'm overspending."
          </blockquote>
          <p className={`text-sm ${subText}`}>— Early user, product tester</p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Ready to take control of your spending?
          </h2>
          <p className={`text-base mb-8 ${subText}`}>
            Free forever. No credit card. Setup takes 2 minutes.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-base">
            Create free account <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className={`border-t py-10 px-4 ${divider}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className={`font-bold text-sm ${dark ? 'text-slate-200' : 'text-slate-800'}`}>SpendSmart</span>
              <span className={`text-sm ml-2 ${subText}`}>— AI-Powered Expense Tracker</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Sign in', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map(({ label, href }) => (
                <Link key={label} href={href}
                  className={`text-sm transition-colors ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p className={`text-sm ${subText}`}>
              © {new Date().getFullYear()} SpendSmart. Built with Next.js & Gemini AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
