import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import './globals.css';
import ReduxProvider from "@/state/provider";
import ClientSideLayout from "./ClientSideLayout";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "honjaya",
  description: "honjaya project",
  icons: {
    icon: "../../public/sleeping.png",
  },
};

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        <ReduxProvider>
          <ClientSideLayout>
            {children}
          </ClientSideLayout>
        </ReduxProvider>
        <Script
          async
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.3.0/kakao.min.js"
          integrity="sha384-70k0rrouSYPWJt7q9rSTKpiTfX6USlMYjZUtr1Du+9o4cGvhPAWxngdtVZDdErlh"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
