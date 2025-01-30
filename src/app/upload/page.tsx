"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus("File uploaded successfully!");
        router.push("/"); // Redirect to home page after upload
      } else {
        setUploadStatus(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setUploadStatus(`Upload failed: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">Upload a Video</h1>
      <div className="w-[32%] bg-gray-800 flex flex-col items-center justify-center text-gray-400 p-4 mb-8">
        <input
          type="file"
          onChange={handleFileChange}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
        />
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
        <p className="mt-4 text-white">{uploadStatus}</p>
      </div>
    </div>
  );
}