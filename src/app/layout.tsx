"use client";
// https://stackoverflow.com/questions/74992326/does-use-client-in-next-js-13-root-layout-make-whole-routes-client-component

import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import theme from "./theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <html lang="en">
          <body id="__next">{children}</body>
        </html>
      </ThemeProvider>
    </SessionProvider>
  );
}
