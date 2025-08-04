// Pinata IPFS Integration for Web3 E-commerce
// Upload images to IPFS via Pinata and get IPFS hashes

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface PinataError {
  error: string;
  details?: string;
}

// Pinata configuration
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";

// Upload file to Pinata IPFS
export async function uploadToPinata(file: File): Promise<PinataUploadResponse> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata API credentials not configured. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_SECRET_KEY in your .env.local file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  
  // Optional: Add metadata
  const metadata = JSON.stringify({
    name: `product-image-${Date.now()}`,
    keyvalues: {
      uploadedBy: "web3-ecommerce-admin",
      timestamp: new Date().toISOString(),
    }
  });
  formData.append("pinataMetadata", metadata);

  // Optional: Add options
  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", options);

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pinata upload failed: ${errorData.error || response.statusText}`);
    }

    const data: PinataUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
}

// Get IPFS URL from hash/CID
export function getIPFSUrl(ipfsHash: string): string {
  if (!ipfsHash) return "";
  
  // Remove ipfs:// prefix if present
  const cleanHash = ipfsHash.replace(/^ipfs:\/\//, "");
  
  return `${PINATA_GATEWAY}/ipfs/${cleanHash}`;
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

// Test Pinata connection
export async function testPinataConnection(): Promise<boolean> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    return false;
  }

  try {
    const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_KEY,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Pinata connection test failed:", error);
    return false;
  }
}
