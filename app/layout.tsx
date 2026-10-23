import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ToastContainer from "@/components/ToastContainer";
import SmoothScroll from "@/components/SmoothScroll";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jobgio — Smarter Job Searching & Recruitment Platform",
  description: "Find the right opportunities faster with personalized recommendations, clean Apple-style hierarchy, and direct employer dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-[#FBFBFC] text-[#0F1115] selection:bg-black selection:text-white">
        <SmoothScroll>
          <AppProvider>
            {children}
            <ToastContainer />
          </AppProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
