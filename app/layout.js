import { Hind_Siliguri, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../lib/ThemeContext';

const hindSiliguri = Hind_Siliguri({
  weight: ['300','400','500','600','700'],
  subsets: ['bengali','latin'],
  variable: '--font-bangla',
  display: 'swap',
});
const poppins = Poppins({
  weight: ['300','400','500','600','700'],
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
});

export const metadata = {
  title: 'মাদরাসাতু দারিল কুরআন',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily:'Hind Siliguri,sans-serif', fontSize:'14px' },
              success: { style: { background:'#1a6b3c', color:'#fff' } },
              error:   { style: { background:'#c41e3a', color:'#fff' } },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
