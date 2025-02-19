"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import Clerk's hook

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser(); // Destructure the auth state

  // Instead of a single video URL, store an array of URLs.
  const [videoUrls] = useState([
    "https://8iuajw6ip5xzshgk.public.blob.vercel-storage.com/vid2-RT1s4txWRNCSI01AmTCTHoKreMxOKh.mp4",
    "https://8iuajw6ip5xzshgk.public.blob.vercel-storage.com/vid2-RT1s4txWRNCSI01AmTCTHoKreMxOKh.mp4",
    "https://8iuajw6ip5xzshgk.public.blob.vercel-storage.com/vid2-RT1s4txWRNCSI01AmTCTHoKreMxOKh.mp4",
    // Add more URLs as needed...
  ]);

  // Wait for Clerk auth state to load before rendering the page.
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="flex flex-col items-start w-48 bg-black text-white py-4 space-y-6 px-4">
        <img
          src="popReel.png"
          alt="PopReel Logo"
          style={{ width: "500px", height: "80px" }}
          className="mt-0 mb-4 self-center"
        />

        {/* Render Sign In / Sign Up options if the user is NOT signed in */}
        {!isSignedIn && (
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <button className="flex items-center space-x-3 text-sm text-gray-300">
          <div className="w-6 h-6 bg-red-500 rounded-sm"></div>
          <span className="text-red-500">For You</span>
        </button>
        <button className="flex items-center space-x-3 text-sm text-gray-300">
          <div className="w-6 h-6 bg-gray-500 rounded-sm"></div>
          <span>Explore</span>
        </button>
        <button className="flex items-center space-x-3 text-sm text-gray-300">
          <div className="w-6 h-6 bg-gray-500 rounded-sm"></div>
          <span>Following</span>
        </button>
      </div>

      {/* Main Content - Video Feed */}
      {/* Remove fixed centering so the container can grow and scroll vertically */}
      <div className="flex-grow bg-black overflow-y-auto">
        <div className="w-[32%] mx-auto py-4 flex flex-col gap-4">
          {videoUrls.map((url, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-lg">
              <video src={url} controls className="w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar with Upload Box */}
      <div className="w-16 bg-black text-white py-4 space-y-6 flex flex-col items-center">
        {/* Upload Box */}
        <div
          className="w-12 h-12 bg-gray-800 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-700"
          onClick={() => router.push("/upload")}
        >
          <span className="text-sm font-bold">Upload</span>
        </div>

        {/* Other Buttons */}
        <button className="flex flex-col items-center text-sm">
          <span className="material-icons text-red-500">favorite</span>
          897.8K
        </button>
        <button className="flex flex-col items-center text-sm">
          <span className="material-icons text-gray-300">chat</span>
          25.3K
        </button>
        <button className="flex flex-col items-center text-sm">
          <span className="material-icons text-gray-300">bookmark</span>
          46.9K
        </button>
        <button className="flex flex-col items-center text-sm">
          <span className="material-icons text-gray-300">share</span>
          Share
        </button>
      </div>
    </div>
  );
}
