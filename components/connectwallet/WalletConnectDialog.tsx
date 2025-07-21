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
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-[#1a1d25] to-[#121418] p-6 shadow-2xl border border-[#2a2f3a] animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-extrabold text-white flex items-center gap-2">
              <div className="bg-[#5C94FF]/10 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-[#5C94FF]" />
              </div>
              <span>Connect Wallet</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors ml-4">
                <X className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex justify-center items-center h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-6" />

          <p className="text-base text-gray-300 mb-6 text-center">
            Choose a wallet to connect to this application.
          </p>

          <div className="space-y-4 mb-4">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                className="w-full py-4 px-5 rounded-xl flex items-center justify-between bg-gradient-to-r from-[#5C94FF] to-[#4A7FE0] text-white font-bold hover:from-[#6AA1FF] hover:to-[#5C94FF] transition-all duration-300 shadow-lg shadow-[#5C94FF]/20 group"
              >
                <span className="flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-lg">{connector.name}</span>
                </span>
                <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-gray-400 mt-6">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}