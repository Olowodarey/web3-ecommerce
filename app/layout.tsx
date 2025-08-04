import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { StarknetProvider } from "@/app/providers/starknet-provider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Web3 Ecommerce Store",
  description: "Shop with Starknet on Sepolia testnet",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StarknetProvider>
          {children}
          <Toaster />
        </StarknetProvider>
      </body>
    </html>
  )
}
