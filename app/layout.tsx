import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBS KPI Web App",
  description: "Management by Statistics style KPI charting app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
