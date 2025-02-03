import { put, list, Part } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import Groq from "groq-sdk"
import { GenerateContentRequest, GenerativeModel, GoogleGenerativeAIError } from "@google-cloud/vertexai";
import { VertexAI } from "@google-cloud/vertexai"; 
import { Part as VertexAIPart } from "@google-cloud/vertexai";
//import { Part } from "@google-cloud/vertexai"; 
import { GoogleAuth } from 'google-auth-library';
//import { GoogleGenerativeAI } from '@google-ai/generativelanguage';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/app/lib/supabaseClient"; 
import { getAuth, clerkClient } from '@clerk/nextjs/server';



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



export async function POST(req: NextRequest) {
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


    const { userId } = getAuth(req);
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    const email = user.emailAddresses[0]?.emailAddress;
    console.log(email)


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

    

    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: "us-east1",
    });
    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
    });



    interface Part {
      fileData?: {
        fileUri: string;
        mimeType: string;
      };
      text?:{

      }
    }
    

    console.log(blob.url)
    const filePart: Part = {
      fileData : {
        fileUri : blob.url,
        mimeType: "video/mp4",
      },
    };
    


    const textPart: Part = {  // Fixed syntax errors
      text: `Provide a comprehensive analysis of this video.
            
            Include:
              1. Main subject and content description
              2. Location and setting details if visible
              3. Any text or speech content
              4. Notable actions or events
              5. Overall mood and style
    
            Please format this as a clear, well-structured summary.`,
    };
    


    const request: GenerateContentRequest = {
      contents: [
        {
          role: "user",
          parts: [filePart as VertexAIPart, textPart as VertexAIPart], 
        },
      ],
    };

    const resp = await generativeModel.generateContent(request);
    const contentResponse = await resp.response;

    if(!contentResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Failed to generate video analysis");
    }
    const summary = contentResponse.candidates[0].content.parts[0].text;
    console.log(summary);

    const tagsResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Using the following summary give tags to the content and the tags should from one of the following Music, Bussiness, Sports, Finance, Movies. Return the response as comma seperated strings of tag" + summary,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })

    console.log(tagsResponse.choices[0].message.content)
    const tags = tagsResponse.choices[0].message.content?.split(',')

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    const model = genAI.getGenerativeModel({model: "text-embedding-004"})


    const result = await model.embedContent(summary)

    console.log(result.embedding.values)

    const embedding = result.embedding.values;

    


    //// Query Supabase to retrieve the user id from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (userError || !userData) {
      throw new Error("User not found in Supabase: " + (userError?.message || ""));
    }
    const user_id = userData.id;
    console.log("Retrieved user_id:", user_id);

    // 10. Insert a new record into the Supabase "videos" table with all the details
    const { error: insertError } = await supabase.from("videos").insert({
      user_id,
      video_url: blob.url,
      transcription,
      summary,
      duration_seconds: 0, // Set to 0 for now
      tags,
      embedding,
    });
    if (insertError) {
      throw new Error("Supabase insert error: " + insertError.message);
    }

    // 11. Return a success response with details (as needed)
    return NextResponse.json({
      video_url: blob.url,
      transcription,
      summary,
      tags,
      embedding
    });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

