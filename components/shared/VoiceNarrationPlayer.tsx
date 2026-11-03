"use client";

import React, { useState } from "react";
import { Volume2, Play, Pause, Square, ChevronDown } from "lucide-react";
import { useSpeechNarration } from "@/src/hooks/useSpeechNarration";

interface VoiceNarrationPlayerProps {
  title: string;
  narrationText: string;
  sectionTag?: string;
}

export const VoiceNarrationPlayer: React.FC<VoiceNarrationPlayerProps> = ({
  title,
  narrationText,
  sectionTag = "Audio Briefing",
}) => {
  const {
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
  } = useSpeechNarration();

  const [showVoiceSelect, setShowVoiceSelect] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  if (!isSupported) {
    return (
      <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
        <span className="font-semibold text-[var(--text-primary)]">Audio Narration:</span> Web
        Speech API is not supported in this browser. Please use the text analysis below.
      </div>
    );
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(narrationText);
    }
  };

  return (
    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title and Audio Wave indicator */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-amber/15 text-brand-orange border border-brand-amber/30">
            <Volume2 className={`w-4 h-4 ${isPlaying && !isPaused ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-orange font-semibold">
                {sectionTag}
              </span>
              {isPlaying && !isPaused && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-success/15 text-brand-success border border-brand-success/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success mr-1 animate-pulse" />
                  NARRATING
                </span>
              )}
              {isPlaying && isPaused && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-amber/15 text-brand-amber">
                  PAUSED
                </span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-orange)] text-white hover:bg-brand-orange-dark text-xs font-medium shadow-sm transition-colors"
            title={isPlaying && !isPaused ? "Pause Narration" : "Listen to CrashLens"}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? "Resume" : "Listen to Briefing"}</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={stop}
              className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-brand-danger transition-colors"
              title="Stop Narration"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Transcript toggle */}
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showTranscript ? "Hide Transcript" : "View Transcript"}
          </button>
        </div>
      </div>

      {/* Expandable Transcript */}
      {showTranscript && (
        <div className="mt-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs leading-relaxed text-[var(--text-secondary)]">
          <p className="font-semibold text-[var(--text-primary)] mb-1">Spoken Briefing Transcript:</p>
          <p>{narrationText}</p>
        </div>
      )}
    </div>
  );
};
