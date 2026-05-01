import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/src/components/ReduxProvider";

export const metadata: Metadata = {
  title: "Event Management Panel",
  description: "Monitor and manage all events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
