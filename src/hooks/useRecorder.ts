"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderError = "denied" | "no-mic" | "unsupported" | "unknown";
export type RecorderStatus = "idle" | "requesting" | "recording" | "paused" | "finished" | "error";
export type AudioQuality = "too-quiet" | "good" | "noisy";

const HISTORY = 56;
const UPDATE_MS = 60;
/** RMS thresholds (float samples, -1…1). Simple heuristics, tuned by ear. */
const QUIET_RMS = 0.012;
const NOISE_FLOOR_RMS = 0.03;

function classifyError(error: unknown): RecorderError {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") return "denied";
    if (error.name === "NotFoundError" || error.name === "OverconstrainedError" || error.name === "NotReadableError") {
      return "no-mic";
    }
  }
  return "unknown";
}

function isSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== "undefined" &&
    typeof window.AudioContext !== "undefined"
  );
}

/**
 * Records microphone audio entirely in the browser.
 * Exposes a live level, a rolling level history (for the waveform), a simple
 * quality hint and total recorded time. Audio never leaves the page unless the
 * caller passes the finished blob to the API, and callers must `discard()` it.
 */
export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [error, setError] = useState<RecorderError | null>(null);
  const [level, setLevel] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);
  const [quality, setQuality] = useState<AudioQuality | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const segmentStartRef = useRef(0);
  const accumulatedRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const rmsWindowRef = useRef<number[]>([]);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const release = useCallback(() => {
    stopLoop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void contextRef.current?.close().catch(() => undefined);
    contextRef.current = null;
    analyserRef.current = null;
    recorderRef.current = null;
  }, [stopLoop]);

  const startLoop = useCallback(() => {
    const tick = () => {
      const analyser = analyserRef.current;
      if (!analyser) return;
      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
      const rms = Math.sqrt(sum / buffer.length);

      const now = performance.now();
      if (now - lastUpdateRef.current >= UPDATE_MS) {
        lastUpdateRef.current = now;
        const samples = rmsWindowRef.current;
        samples.push(rms);
        if (samples.length > 25) samples.shift();
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const floor = [...samples].sort((a, b) => a - b)[Math.floor(samples.length * 0.1)] ?? 0;
        const display = Math.min(1, rms * 7);

        setLevel(display);
        setLevels((prev) => [...prev.slice(-(HISTORY - 1)), Math.max(0.06, display)]);
        setElapsedMs(accumulatedRef.current + (now - segmentStartRef.current));
        if (samples.length >= 8) {
          setQuality(avg < QUIET_RMS ? "too-quiet" : floor > NOISE_FLOOR_RMS ? "noisy" : "good");
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!isSupported()) {
      setError("unsupported");
      setStatus("error");
      return;
    }

    // Resume an existing (paused) recording.
    const existing = recorderRef.current;
    if (existing && existing.state === "paused") {
      existing.resume();
      segmentStartRef.current = performance.now();
      setStatus("recording");
      startLoop();
      return;
    }

    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true },
      });
      streamRef.current = stream;
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      context.createMediaStreamSource(stream).connect(analyser);
      contextRef.current = context;
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.start(250);
      recorderRef.current = recorder;

      accumulatedRef.current = 0;
      rmsWindowRef.current = [];
      segmentStartRef.current = performance.now();
      setElapsedMs(0);
      setStatus("recording");
      startLoop();
    } catch (e) {
      release();
      setError(classifyError(e));
      setStatus("error");
    }
  }, [release, startLoop]);

  const pause = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return;
    recorder.pause();
    stopLoop();
    accumulatedRef.current += performance.now() - segmentStartRef.current;
    setElapsedMs(accumulatedRef.current);
    setLevel(0);
    setStatus("paused");
  }, [stopLoop]);

  /** Stops recording, releases the mic and returns the audio blob. */
  const finish = useCallback(async (): Promise<Blob> => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      if (recorder.state === "recording") {
        accumulatedRef.current += performance.now() - segmentStartRef.current;
      }
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        recorder.stop();
      });
    }
    const blob = new Blob(chunksRef.current, { type: recorder?.mimeType || "audio/webm" });
    release();
    setLevel(0);
    setElapsedMs(accumulatedRef.current);
    setStatus("finished");
    return blob;
  }, [release]);

  /** Drops any recorded audio from memory. */
  const discard = useCallback(() => {
    chunksRef.current = [];
  }, []);

  const reset = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.ondataavailable = null;
      recorder.stop();
    }
    release();
    chunksRef.current = [];
    accumulatedRef.current = 0;
    rmsWindowRef.current = [];
    setLevel(0);
    setLevels([]);
    setQuality(null);
    setElapsedMs(0);
    setError(null);
    setStatus("idle");
  }, [release]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.ondataavailable = null;
        recorder.stop();
      }
      release();
      chunksRef.current = [];
    };
  }, [release]);

  return { status, error, level, levels, quality, elapsedMs, start, pause, finish, discard, reset };
}
