import { Onest } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const onest = Onest({
  subsets: ["latin"],
});

export const metadata = {
  title: "Focusnaut",
  description: "Desenvolvido pela equipe Focusnaut",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className="bg-primary">
      <body
        className={`${onest.className} antialiased`}
        cz-shortcut-listen="true"
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
