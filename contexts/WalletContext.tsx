'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'

interface WalletContextType {
  isWalletConnected: boolean
  walletAddress: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // Use your existing starknet-react hooks
  const { address, status } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const isWalletConnected = status === 'connected'
  const walletAddress = address || ''

  // Connect wallet function using starknet-react
  const connectWallet = async () => {
    try {
      if (connectors.length > 0) {
        // Use the first available connector (ArgentX or Braavos)
        await connect({ connector: connectors[0] })
        
        toast({
          title: "🎉 Wallet Connected!",
          description: "You can now make purchases with STRK tokens",
        })
        
        console.log('✅ Wallet connected successfully via starknet-react')
      } else {
        toast({
          title: "Wallet Not Found",
          description: "Please install ArgentX or Braavos wallet",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      })
    }
  }

  // Disconnect wallet function using starknet-react
  const disconnectWallet = () => {
    disconnect()
    toast({
      title: "👋 Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const value: WalletContextType = {
    isWalletConnected,
    walletAddress,
    connectWallet,
    disconnectWallet
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
