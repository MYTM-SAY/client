"use client";

import { ReactNode } from "react";
import ThemeProviderWrapper from "./ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProviderWrapper>
      <ClerkProvider>{children}</ClerkProvider>
    </ThemeProviderWrapper>
  );
}
