// pages/api/welcome.js
import { supabase } from "@/app/lib/supabaseClient"; 
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { username, country, city, interests } = await req.json();

    // Process the data as needed (e.g., save to a database)
    console.log("Received user data:", { username, country, city, interests });

    
    req.cookies.set("userName", username);

    const { data, error } = await supabase
      .from("users")
      .upsert([{ 
        username, 
        country, 
        city, 
        interests 
      }])
      .select();

    if (error) {
      console.error("🚨 Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ User added to Supabase:", data);

    const response = await fetch("http://localhost:3001/api/homepage", {  // ✅ Correct place for fetch
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    console.log(response);

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
