import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "JobConnect Butuan — Local Employment & Hiring Ecosystem",
  description: "Find verified employment opportunities across Butuan City. Connect directly with hiring businesses, cafes, health clinics, and regional tech teams without agency fees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-[#FBFBFC] text-[#0F1115] selection:bg-emerald-600 selection:text-white">
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
