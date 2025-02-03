// pages/api/welcome.js
import { supabase } from "@/app/lib/supabaseClient"; 
import { NextRequest, NextResponse } from "next/server";
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { username, country, city, interests } = await req.json();

    // Process the data as needed (e.g., save to a database)
    console.log("Received user data:", { username, country, city, interests });

    const { userId } = getAuth(req);

  
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    const email = user.emailAddresses[0]?.emailAddress;


    const { data, error } = await supabase
      .from("users")
      .upsert([{ 
        username, 
        country, 
        city, 
        interests,
        email
      }])
      .select();

    if (error) {
      console.error("🚨 Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ User added to Supabase:", data);

    // Return a successful response
    return NextResponse.json({ message: "Profile created successfully" });
  } catch (error: any) {
    console.error("Error processing form data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
