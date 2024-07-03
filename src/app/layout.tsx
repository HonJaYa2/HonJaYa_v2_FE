
import type { Metadata } from "next";
// import { FontClassNames } from "./Styles/Font";
// import "./Styles/GlobalStyles.css";
import React from "react";
import Script from "next/script";
import './globals.css'
import ReduxProvider from "@/state/provider";
import ClientSideLayout from "./ClientSideLayout";


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
    <html>
      <body>
        <ReduxProvider>
          <ClientSideLayout>
              {children}
          </ClientSideLayout>
        </ReduxProvider>
      </body>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="afterInteractive"
      />
    </html>
  );
}