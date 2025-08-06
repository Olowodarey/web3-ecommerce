import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { StarknetProvider } from "@/app/providers/starknet-provider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
        <div className="min-h-screen bg-black text-white relative overflow-hidden ">
      {/* Clean Background with Subtle Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      <Navbar />
          {children}
          <Toaster />
          <Footer />
        </div>
        </StarknetProvider>
      </body>
    </html>
  )
}
