"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  onListeningChange?: (isListening: boolean) => void;
}

export default function VoiceInputButton({
  onTranscript,
  className = "",
  onListeningChange
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Voice speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      onListeningChange?.(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        onListeningChange?.(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          onTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Failed to initialize speech recognition:", err);
      setIsListening(false);
      onListeningChange?.(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center ${
        isListening
          ? "bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse scale-105"
          : "bg-white/[0.06] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
      } ${className}`}
      title={
        isListening
          ? "Listening... Click to stop"
          : "Click to speak commands (Web Speech API)"
      }
    >
      {isListening ? (
        <>
          <Mic size={18} className="animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
        </>
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
}
