import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ToastContainer from "@/components/ToastContainer";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";
import ClerkSync from "@/components/ClerkSync";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JobConnect Butuan — Local jobs, direct hiring",
    template: "%s · JobConnect Butuan",
  },
  description:
    "Find verified jobs across Butuan City and Caraga. Apply directly to local employers — cafes, clinics, tech teams and more — with no agency fees.",
  openGraph: {
    type: "website",
    siteName: "JobConnect Butuan",
    title: "JobConnect Butuan — Local jobs, direct hiring",
    description: "Find verified jobs across Butuan City and Caraga and apply directly to local employers.",
    locale: "en_PH",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
};

// Runs before first paint so there is no light/dark flash
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;var l=localStorage.getItem('locale');if(l==='fil')document.documentElement.lang='fil'}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full font-sans selection:bg-blue-600 selection:text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-surface focus:text-fg focus:shadow-lg"
        >
          Skip to content
        </a>
        <AuthProvider>
          <SmoothScroll>
            <AppProvider>
              <ClerkSync />
              {children}
              <ToastContainer />
            </AppProvider>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
