// pages/api/welcome/route.ts
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    console.log("Received username:", username);

    // Create a response and set a cookie
    const response = NextResponse.json({ message: "Username got successfully" });
    response.cookies.set("userName", username, { path: "/" });
    return response;
  } catch (error: any) {
    console.error("Error processing form data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the cookie from the request
    const userName = req.cookies.get("userName")?.value || "";
    return NextResponse.json({ userName });
  } catch (error: any) {
    console.error("Error sending back userName:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
