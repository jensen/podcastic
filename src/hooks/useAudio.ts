import { useState, useEffect, useRef } from "react";

export default function useAudio() {
  const audioRef = useRef<{
    audio: HTMLAudioElement | null;
    url: string | null;
  }>({ audio: null, url: null });
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    const { audio, url } = audioRef.current;

    if (audio) {
      audio.pause();
    }

    if (playing) {
      if (url === playing) {
        audio?.play();
      } else {
        const audio = new Audio(playing);
        audio.play();

        audioRef.current = { audio, url: playing };
      }
    }
  }, [playing]);

  return {
    playing: (url: string) => playing === url,
    toggle: (url: string) => {
      if (playing === url) {
        setPlaying(null);
      } else {
        setPlaying(url);
      }
    },
  };
}
