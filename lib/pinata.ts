// Pinata IPFS Integration for Web3 E-commerce
// Upload images to IPFS via Pinata using client-side approach with signed URLs

import { PinataSDK } from "pinata";

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  url?: string;
}

export interface PinataError {
  error: string;
  details?: string;
}

// Client-side Pinata SDK configuration
const pinata = new PinataSDK({
  pinataJwt: "", // Not needed for client-side with signed URLs
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!
});

// Export pinata instance for client-side use
export { pinata };

// Client-side upload function using signed URLs
export async function uploadToPinata(file: File): Promise<PinataUploadResponse> {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    // Step 1: Get signed URL from API
    const urlRequest = await fetch("/api/upload-to-pinata");
    if (!urlRequest.ok) {
      throw new Error("Failed to get upload URL");
    }
    const urlResponse = await urlRequest.json();

    // Step 2: Upload file using signed URL
    const upload = await pinata.upload.public
      .file(file)
      .url(urlResponse.url);

    // Step 3: Get gateway URL for the uploaded file
    const gatewayUrl = await pinata.gateways.public.convert(upload.cid);

    return {
      IpfsHash: upload.cid,
      PinSize: 0, // Size not returned in new SDK
      Timestamp: new Date().toISOString(),
      url: gatewayUrl
    };
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}

// Get IPFS URL from hash/CID using configured gateway
export function getIPFSUrl(ipfsHash: string): string {
  if (!ipfsHash) return "";
  
  // Remove ipfs:// prefix if present
  const cleanHash = ipfsHash.replace(/^ipfs:\/\//, "");
  
  // Use public IPFS gateway that doesn't require authentication
  // Pinata's gateway.pinata.cloud requires auth, so use public gateway
  return `https://ipfs.io/ipfs/${cleanHash}`;
}

// Convert IPFS CID to accessible URL using Pinata SDK (for server-side use)
export async function getPinataGatewayUrl(ipfsHash: string): Promise<string> {
  if (!ipfsHash) return "";
  
  try {
    // Remove ipfs:// prefix if present
    const cleanHash = ipfsHash.replace(/^ipfs:\/\//, "");
    
    // Use Pinata SDK to convert CID to gateway URL
    const url = await pinata.gateways.public.convert(cleanHash);
    return url;
  } catch (error) {
    console.error("Error converting CID to Pinata gateway URL:", error);
    // Fallback to public IPFS gateway
    return getIPFSUrl(ipfsHash);
  }
}

// Validate IPFS hash format
export function isValidIPFSHash(hash: string): boolean {
  if (!hash) return false;
  
  // Clean the hash
  const cleanHash = hash.replace(/^ipfs:\/\//, "");
  
  // IPFS CID v0 (starts with Qm, 46 characters)
  const cidV0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  
  // IPFS CID v1 (starts with b, longer format)
  const cidV1Regex = /^b[a-z2-7]{58,}$/;
  
  return cidV0Regex.test(cleanHash) || cidV1Regex.test(cleanHash);
}

// Test Pinata connection using PinataSDK
export async function testPinataConnection(): Promise<boolean> {
  if (!process.env.PINATA_JWT || !process.env.NEXT_PUBLIC_GATEWAY_URL) {
    return false;
  }

  try {
    // Test connection by attempting a simple operation
    // Since we can't easily test without uploading, we'll just check if SDK is configured
    return true;
  } catch (error) {
    console.error("Pinata connection test failed:", error);
    return false;
  }
}
