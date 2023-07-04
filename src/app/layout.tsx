"use client";
// Use client-side rendering for now, as it is needed for ThemeProvider and SessionProvider.
// Although there are not many use cases for server components now, it may be different in future.
// If that becomes the case, I will need to find a way to make it work without this directive.
// This may be helpful:
// https://stackoverflow.com/questions/66106408/retrieve-data-server-side-and-save-in-context-with-next-js

import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import theme from "./theme";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

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
