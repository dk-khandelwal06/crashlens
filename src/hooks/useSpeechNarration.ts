"use client";

import { useState, useEffect, useCallback } from "react";

export interface SpeechState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
}

export function useSpeechNarration() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const voiceList = window.speechSynthesis.getVoices();
        setVoices(voiceList);
        if (voiceList.length > 0 && !selectedVoice) {
          // Default to an English voice if present
          const enVoice = voiceList.find(
            (v) => v.lang.startsWith("en-GB") || v.lang.startsWith("en")
          );
          setSelectedVoice(enVoice || voiceList[0]);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || typeof window === "undefined") return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice]
  );

  const pause = useCallback(() => {
    if (isSupported && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isPlaying]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    pause,
    resume,
    stop,
  };
}
