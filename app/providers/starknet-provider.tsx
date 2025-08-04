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
        nodeUrl: "https://starknet-sepolia.blastapi.io/cb15156d-9e8d-4a8b-aa9a-81d8de0e09a7/rpc/v0_8",
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
    >
      {children}
    </StarknetConfig>
  );
}