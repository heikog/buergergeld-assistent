import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bürgergeld-Antrag Assistent",
  description: "Bürgergeld-Formulare einfach und kostenlos ausfüllen lassen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
