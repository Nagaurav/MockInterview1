import { useState, useRef, useCallback } from 'react';

interface MediaRecorderHook {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
  isRecording: boolean;
  error: Error | null;
}

export function useMediaRecorder(): MediaRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to start recording'));
      throw e;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    return new Promise<Blob>((resolve, reject) => {
      if (!mediaRecorder.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        chunks.current = [];
        setIsRecording(false);

        // Stop all tracks
        mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
        resolve(blob);
      };

      mediaRecorder.current.stop();
    });
  }, []);

  return {
    startRecording,
    stopRecording,
    isRecording,
    error,
  };
}