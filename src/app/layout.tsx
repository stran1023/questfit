import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../styles.css";

export const metadata: Metadata = {
  title: "QuestFit — Your body. Your adventure.",
  description: "Turn your personalized workout into a body-controlled adventure.",
  applicationName: "QuestFit",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
