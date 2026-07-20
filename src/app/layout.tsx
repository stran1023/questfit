import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../styles.css";

export const metadata: Metadata = {
  title: "AI Fitness Escape",
  description: "Turn a personalized workout into an interactive adventure.",
  applicationName: "AI Fitness Escape",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
