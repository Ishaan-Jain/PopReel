import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import axios from "axios";

async function transcribeVideoWithGroq(videoUrl) {
  try {
    const response = await axios.post(
      process.env.GROQ_API_ENDPOINT, // Ensure your Groq endpoint is correct
      { url: videoUrl }, // Send the video URL
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.transcription; // Extract and return transcription
  } catch (error) {
    console.error("Error transcribing video:", error);
    return "Transcription failed."; // Return a default error message
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;

    if (!file || !filename) {
      return NextResponse.json(
        { error: "File and filename are required" },
        { status: 400 }
      );
    }

    // Upload file to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure this is set correctly
    });

    const transcription = await transcribeVideoWithGroq(blob.url);

    //Return both the video URL & transcription
    return NextResponse.json({ url: blob.url, transcription });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// ✅ FIXED: Debugging `list()` response
export async function GET() {
  try {
    console.log("Fetching uploaded videos...");

    // Retrieve all blobs from Vercel
    const blobs = await list();

    console.log("Raw response from list():", blobs); // Log what `list()` returns

    // Ensure blobs.items exists before mapping
    if (!blobs || !blobs.items) {
      console.error("Error: `list()` returned invalid data:", blobs);
      return NextResponse.json({ videos: [] });
    }

    console.log("Videos found:", blobs.items);

    const videoUrls = blobs.items.map((blob) => blob.url);
    return NextResponse.json({ videos: videoUrls });
  } catch (error) {
    console.error("Error retrieving videos from Blob Storage:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos", details: error.message },
      { status: 500 }
    );
  }
}
