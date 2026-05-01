import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import { ToastProvider } from "../components/ToastProvider";

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
        <ReduxProvider>
          <ToastProvider>{children}</ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
