import type React from "react";
import { StarknetProvider } from "@/app/providers/starknet-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50"> <StarknetProvider>{children}</StarknetProvider></div>;
}
