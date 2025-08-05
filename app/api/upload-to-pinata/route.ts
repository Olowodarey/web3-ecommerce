import { NextResponse } from "next/server";
import { PinataSDK } from "pinata";

// Server-side Pinata configuration for creating signed URLs
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Create a signed URL for client-side upload
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // URL expires in 30 seconds
    });

    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return NextResponse.json(
      { error: "Error creating upload URL", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
