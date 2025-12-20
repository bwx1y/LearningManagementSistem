"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const client = new QueryClient()

export function Provider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={client}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
        </QueryClientProvider>
    )
}
