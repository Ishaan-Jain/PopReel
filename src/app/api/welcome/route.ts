// pages/api/welcome.js
  

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the JSON body from the request
    const { username, country, city, interests } = await req.json();

    // Process the data as needed (e.g., save to a database)
    console.log("Received user data:", { username, country, city, interests });

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
