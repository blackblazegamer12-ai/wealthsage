import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeProvider } from "../components/theme/ThemeContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WealthSage | Autonomous AI Financial Intelligence & Sovereign Vault",
  description: "Institutional-grade financial intelligence, predictive cashflow compounding, autonomous subscription optimization, and real-time sovereign ledger telemetry.",
  keywords: [
    "personal finance",
    "AI wealth advisor",
    "cash velocity",
    "financial intelligence",
    "sovereign ledger",
    "predictive compounding",
    "quantitative finance",
    "wealth management"
  ],
  authors: [{ name: "WealthSage Technologies" }],
  openGraph: {
    title: "WealthSage | Autonomous AI Financial Intelligence",
    description: "Institutional-grade financial intelligence and predictive wealth compounding.",
    type: "website",
  },
};

// Inline Anti-FOUC Theme Hydration Script
const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('wealthsage_royal_theme') || 'imperial-gold';
      document.documentElement.setAttribute('data-theme', saved);
      if (saved === 'ethereal-cream' || saved === 'sage-harmony') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'imperial-gold');
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#eab308',
          colorBackground: '#11131a',
          borderRadius: '1rem',
        },
        elements: {
          card: 'bg-[#11131a] border border-white/10 shadow-2xl rounded-3xl',
          formButtonPrimary: 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold hover:brightness-105 transition-all shadow-lg shadow-amber-500/20',
          socialButtonsBlockButton: 'bg-[#181b24] border border-white/10 text-white hover:bg-[#20242f]',
          headerTitle: 'text-white font-extrabold',
          headerSubtitle: 'text-slate-400',
          dividerLine: 'bg-white/10',
          dividerText: 'text-slate-500',
          footerActionText: 'text-slate-400',
          footerActionLink: 'text-amber-400 hover:text-amber-300 font-semibold',
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#B48A5A" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <script dangerouslySetInnerHTML={{ __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
                caches.keys().then(function(names) {
                  for (let name of names) caches.delete(name);
                });
              });
            }
          `}} />
        </head>
        <body className="min-h-full flex flex-col antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
