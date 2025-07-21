"use client";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  
} from "@starknet-react/core";
import { shortenAddress } from "@/lib/utils";
import { UserCircle2, ChevronDown, LogOut } from "lucide-react";

const Account = () => {
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
  const [displayAddress, setDisplayAddress] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
    if (status === "disconnected") {
      setDisplayAddress("");
    } else if (status === "connected" && address) {
      // Format the address for display (e.g., 0x1234...5678)
      setDisplayAddress(shortenAddress(address));
    }
  }, [address, status]);

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      {status === "connected" && address ? (
        <>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-[#2a2f3a]/50 hover:border-[#3b82f6]/50 transition-all duration-200 shadow-sm"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <UserCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white/90">
              {displayAddress}
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
            />
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-[#2a2f3a] z-50 animate-in fade-in-50">
              <div className="p-1">
                <div className="px-4 py-3 border-b border-[#2a2f3a]">
                  <p className="text-xs text-gray-400">Connected with Starknet</p>
                  <p className="text-sm font-medium text-white mt-0.5">{displayAddress}</p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Disconnect Wallet
                </button>
              </div>
              <div className="px-4 py-2.5 bg-[#0f172a] text-center">
                <p className="text-xs text-gray-500">
                  View on
                  <a 
                    href={`https://starkscan.co/contract/${address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-400 hover:underline"
                  >
                    Starkscan
                  </a>
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-2 text-sm text-gray-400 bg-[#1e293b]/50 rounded-lg border border-dashed border-[#2a2f3a]">
          Not connected
        </div>
      )}
    </div>
  );
};

export default Account;