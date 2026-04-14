import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import LayoutWrapper from '@/components/LayoutWrapper';
import StoreProvider from '@/app/StoreProvider';
import { Inter, Cormorant_Garamond, Playfair_Display, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import ChunkErrorRecovery from '@/components/ChunkErrorRecovery';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const heading = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: 'GemsRatna Premium Gemstones',
  description: 'Premium natural gemstones and spiritual wellness products.',
  icons: {
    icon: '/assets/Image/favicon.svg',
    shortcut: '/assets/Image/favicon.svg',
    apple: '/assets/Image/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, heading.variable, playfair.variable, poppins.variable)}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: 'localStorage.setItem("theme", "light");document.documentElement.setAttribute("data-theme","light");',
          }}
        />
        <ChunkErrorRecovery />
        <StoreProvider>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
