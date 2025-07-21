"use client";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  Connector,
  useConnect,
} from "@starknet-react/core";
import { shortenAddress } from "@/lib/utils";
import { UserCircle2, ChevronDown, LogOut } from "lucide-react";

const Account = () => {
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
  const [displayAddress, setDisplayAddress] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { connectors, connect, connectAsync } = useConnect();

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
            className="flex items-center space-x-2 px-4 py-1 rounded-full border border-[#2d2f36] bg-[#1c1f26] hover:bg-[#2a2d36] transition-colors"
          >
            <UserCircle2 className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">
              {displayAddress}
            </span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1c1f26] border border-[#2d2f36] z-10">
              <div className="py-1">
                <button
                  onClick={handleDisconnect}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#2a2d36] transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-400">Not connected</div>
      )}
    </div>
  );
};

export default Account;