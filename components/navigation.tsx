"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Settings } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Web3 Store
              </h1>
            </Link>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Starknet • Sepolia
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant={pathname === "/" ? "default" : "ghost"} size="sm">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Store</span>
              </Link>
            </Button>

            <Button asChild variant={pathname === "/admin" ? "default" : "ghost"} size="sm">
              <Link href="/admin" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
