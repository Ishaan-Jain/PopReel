import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import axios from "axios";
import Groq from "groq-sdk"


// async function transcribeVideoWithGroq(videoUrl) {
//   try {
//     const response = await axios.post(
//       process.env.GROQ_API_ENDPOINT, // Ensure your Groq endpoint is correct
//       { url: videoUrl }, // Send the video URL
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.transcription; // Extract and return transcription
//   } catch (error) {
//     console.error("Error transcribing video:", error);
//     return "Transcription failed."; // Return a default error message
//   }
// }



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

    console.log("✅ Video uploaded to:", blob.url);

    // ✅ Fetch the video file from Vercel Blob Storage
    const videoResponse = await fetch(blob.url);
    const videoBuffer = await videoResponse.blob();
    const vidFile = new File([videoBuffer], "video.mp4", { type: "video/mp4" });

    console.log("🚀 Sending video to Groq API for transcription...");
    const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
  
    const transcrption = await groq.audio.transcriptions.create({
      model: 'distil-whisper-large-v3-en',
      file: vidFile,  // ✅ Fix: Change vidFile to file
      response_format: 'text',
    });

    const transcription = String(transcrption);
    console.log(transcription);


    const vertexAI = new VertexAI(){}
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
