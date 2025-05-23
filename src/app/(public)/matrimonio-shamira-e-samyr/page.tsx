"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingPhrases from "@/components/floating-phrases";

export default function MatrimonioShamiraESamyrPage() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const MESSAGES = [
    "Congratulations on your wedding!",
    "Wishing you a lifetime of love and happiness.",
    "May your love grow stronger with each passing day.",
    "Cheers to a beautiful journey ahead!",
    "Here's to love, laughter, and happily ever after.",
    "May your marriage be filled with joy and laughter.",
  ];

  const handleSend = () => {
    // We store the name but don't display it in messages
    console.log("Message sent:", message);
    console.log("From:", name || "Anonymous");
    setMessage("");
    setName("");
  };

  const handleRedirect = () => {
    window.open(
      "https://drive.google.com/drive/folders/1pbtoBECjWNW7CyB7MvhWX06YT7W0iNLb?usp=sharing",
      "_blank"
    );
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center ">
      <FloatingPhrases phrases={MESSAGES} />

      <div className="backdrop-blur-md max-w-md mx-auto p-6 rounded-md shadow relative z-10">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Would you like to leave a message to Shamira and Samyr?
        </h1>
        <div className="space-y-4 mb-6">
          <Input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              Send
            </Button>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleRedirect}>
          Redirect to share photos
        </Button>
      </div>
    </main>
  );
}
