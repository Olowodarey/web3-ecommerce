"use client";

import { useConnect, type Connector } from "@starknet-react/core";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Wallet, ExternalLink } from "lucide-react";


interface WalletConnectDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function WalletConnectDialog({
  isOpen,
  setIsOpen,
}: WalletConnectDialogProps) {
  const { connectors, connectAsync } = useConnect();

  const handleConnect = async (connector: Connector) => {
    await connectAsync({ connector });
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-in fade-in duration-300" />
        <Dialog.Content 
          className="fixed z-50 top-1/2 left-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 shadow-2xl border border-[#2a2f3a]/50 animate-in zoom-in-95 duration-300"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Connect Wallet
              </span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button 
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />

          {/* Description */}
          <p className="text-center text-gray-300 mb-6 text-sm">
            Select your preferred wallet to connect to the Starknet network
          </p>

          {/* Wallet Buttons */}
          <div className="space-y-3 mb-6">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                className="group w-full relative overflow-hidden rounded-xl p-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 hover:opacity-90 transition-all duration-300"
              >
                <div className="flex items-center justify-between w-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-xl p-4 hover:bg-[#1e293b]/80 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">
                      {connector.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 leading-relaxed">
            By connecting your wallet, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}