import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ToastContainer from "@/components/ToastContainer";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobConnect Caraga — Butuan City Job Opportunities & Recruitment",
  description: "Find local employment opportunities across Butuan City and the Caraga region. Connect directly with hiring businesses, cafes, health clinics, and regional tech teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-[#FBFBFC] text-[#0F1115] selection:bg-black selection:text-white">
        <AuthProvider>
          <SmoothScroll>
            <AppProvider>
              {children}
              <ToastContainer />
            </AppProvider>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
