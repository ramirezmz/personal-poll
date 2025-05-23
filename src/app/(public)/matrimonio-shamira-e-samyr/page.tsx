"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingPhrases from "@/components/floating-phrases";
import { toast } from "sonner";
import {
  MousePointerClick,
  Plus,
  Upload,
  Image,
  CheckCircle2,
} from "lucide-react";
import { create } from "@/services/notion/create";

export default function MatrimonioShamiraESamyrPage() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const MESSAGES = [
    "💍 Que o amor de vocês floresça mais a cada dia!",
    "💖 Parabéns pelo início desta linda jornada juntos!",
    "💑 Que a felicidade de hoje seja eterna!",
    "💘 Que este dia seja especial para vocês!",
    "💞 Que o amor de vocês seja eterno!",
  ];

  const handleSend = async () => {
    setMessage("");
    setName("");
    try {
      await create({
        message: message,
        name: name,
        createdAt: new Date().toISOString(),
      });
      toast.success("Mensagem enviada com sucesso!", {
        description: "Obrigado por sua mensagem para o casal.",
      });
    } catch (error) {
      toast.error("Erro ao enviar a mensagem.");
      console.error(error);
    }
  };

  const handleRedirect = () => {
    const driveUrl =
      "https://drive.google.com/drive/folders/1pbtoBECjWNW7CyB7MvhWX06YT7W0iNLb?usp=sharing";

    // Check if device is mobile (iOS or Android)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Specific check for iOS
    const isIOS =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Specific check for Android
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isMobile) {
      if (isIOS) {
        // iOS uses the Googledrive:// protocol
        window.location.href = `Googledrive://${driveUrl}`;
      } else if (isAndroid) {
        // Android intent URI format
        window.location.href = `intent://${driveUrl.replace(
          "https://",
          ""
        )}#Intent;package=com.google.android.apps.docs;scheme=https;end`;
      }

      // Fallback if app doesn't open after a short delay
      setTimeout(() => {
        window.open(driveUrl, "_blank");
      }, 500);
    } else {
      // For desktop, just open in browser
      window.open(driveUrl, "_blank");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center ">
      <FloatingPhrases phrases={MESSAGES} />

      <div className="backdrop-blur-md max-w-md mx-auto p-6 rounded-md shadow relative z-10">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Gostaria de deixar uma mensagem para o casal?
        </h1>
        <div className="space-y-4 mb-6">
          <Input
            placeholder="Seu nome (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              Enviar
            </Button>
          </div>
        </div>

        <div className="mb-6 p-4 border rounded-md bg-muted/50">
          <h3 className="font-medium text-center mb-3">
            Como compartilhar fotos:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Click no botão embaixo</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Selecionar conta Google</span>
            </li>
            <li className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Clicar em &quot;+ Novo&quot;</span>
            </li>
            <li className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Clicar em &quot;Fazer Upload&quot;</span>
            </li>
            <li className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Selecionar a foto ou vídeo desejada</span>
            </li>
          </ul>
        </div>

        <Button variant="outline" className="w-full" onClick={handleRedirect}>
          Compartilhar fotos
        </Button>
      </div>
    </main>
  );
}
