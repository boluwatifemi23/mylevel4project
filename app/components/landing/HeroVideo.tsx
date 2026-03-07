
"use client";

import { useRef, useState, useEffect } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  const VIDEO_SRC =
    "https://www.pexels.com/download/video/3196096/";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch (err) {
        document.addEventListener("click", () => video.play(), { once: true });
      }
    };

    if (video.readyState >= 3) attemptPlay();
    else video.addEventListener("loadeddata", attemptPlay, { once: true });
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onError={() => setVideoError(true)}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div className="w-full h-full bg-linear-to-br from-pink-50 to-purple-50" />
      )}

      <div className="absolute inset-0 bg-linear-to-br from-white/85 via-white/60 to-pink-50/80" />
    </div>
  );
}
