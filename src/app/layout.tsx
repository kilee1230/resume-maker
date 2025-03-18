// app/layout.tsx
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Modern resume builder with AI suggestions",
};

// app/layout.tsx (update the main section)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="relative flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground">
            <div className="container flex items-center mx-auto h-14 max-w-7xl">
              <h1 className="text-xl font-bold">AI Resume Builder</h1>
            </div>
          </header>
          <main className="flex-1">
            {/* Use max-w-7xl to limit the max width and center the app */}
            <div className="container px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <footer className="py-6 border-t md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 mx-auto md:h-14 md:flex-row max-w-7xl">
              <p className="text-sm text-muted-foreground">
                Built with Next.js, TypeScript, and shadcn/ui
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
