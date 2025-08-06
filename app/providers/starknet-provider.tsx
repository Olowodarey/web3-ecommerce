"use client";
import React from "react";
 
import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  argent,
  braavos,
  voyager
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const connectors = [
    argent(),
    braavos(),
  ];

  const provider = jsonRpcProvider({
    rpc: () => {
      return {
        nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/xi0vRGP4g0IT5lePSjZHm",
        headers: {
          "Content-Type": "application/json",
        },
      };
    },
  });
 
  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}