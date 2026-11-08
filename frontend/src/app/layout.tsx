import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Small Web — A browser for a smaller internet",
  description: "Explore, search and publish on the Small Web.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
  
