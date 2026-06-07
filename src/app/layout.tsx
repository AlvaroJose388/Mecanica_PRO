import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/contexts/user-context';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'MecanicaPro',
  description: 'Sistema de Gestión de Talleres Mecánicos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable} font-body antialiased selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
