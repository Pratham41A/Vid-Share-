import { memo, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export const VideoPlayer = memo(function VideoPlayer({ event, stream }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  let url = "";
  let thumbnailData = "";

  if (event) {
    ({ url, thumbnailData } = event);
  }

  const streamMode = stream;
  const eventMode = event;

  async function toggleFullScreen() {
    const container = containerRef.current;

    const { fullscreenElement } = document;
    if (!fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  useEffect(function () {
    function handleKeyDown(event) {
      const { key, target } = event;
      if (target instanceof HTMLInputElement) {
        return;
      }
      if (target instanceof HTMLTextAreaElement) {
        return;
      }

      if (key === "f" || key === "F") {
        event.preventDefault()
        toggleFullScreen();
      } 
    }

    window.addEventListener("keydown", handleKeyDown);

    return function () {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(
    function () {
      const  video = videoRef.current;

      let hls;
      let seekStartPosition;

      if (streamMode) {
        setMuted(true);
        video.muted = true;
      } else {
        setMuted(false);
        video.muted = false;
      }

      video.pause();
      video.srcObject = null;
      video.removeAttribute("src");
      video.load();

      if (streamMode) {
        video.srcObject = stream;
        video.play();
      } else if (eventMode) {
        if (Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            startPosition: 0,
            xhrSetup: function (xhr) {
              xhr.withCredentials = true;
              xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
            },
          });

          hlsRef.current = hls;

          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.crossOrigin = "use-credentials";
            seekStartPosition = function () {
              const { seekable } = video;
              const { length: seekableLength } = seekable;
              if (seekableLength > 0) {
                video.currentTime = seekable.start(0);
              }
            };

            video.addEventListener("loadedmetadata", seekStartPosition);
            video.src = url;
          }
        }
      }

      return function () {
        if (hls) {
          hls.destroy();
          hlsRef.current = null;
        }

        if (seekStartPosition) {
          video.removeEventListener("loadedmetadata",seekStartPosition);
        }

        video.pause();
        video.srcObject = null;
        video.removeAttribute("src");
        video.load();
        video.removeAttribute("crossorigin");
      };
    },
    [stream, url, streamMode, eventMode]
  );

  function togglePlay() {
    const video = videoRef.current;

    if (!eventMode) {
      return;
    }

    const { paused } = video;
    if (paused) {
      video.play();
    } else {
      video.pause()
    }
  }

  function toggleMute() {
    const video = videoRef;

    let videoMuted;
    ({ muted: videoMuted } = video);

    if (videoMuted) {
      video.muted = false;
    } else {
      video.muted = true;
    }

    ({ muted: videoMuted } = video);
    setMuted(videoMuted);
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full select-none overflow-hidden rounded-xl border border-white/10 bg-slate-950"
    >
      <video
        ref={videoRef}
        playsInline
        poster={thumbnailData}
        controls={false}
        className="h-full w-full object-cover"
        onPlay={function () {
          setPlaying(true);
        }}
        onPause={function () {
          setPlaying(false);
        }}
      />

      {(function () {
        if (!streamMode) {
          if (!eventMode) {
            return ;
          }
        }

        return (
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 border-t border-white/10 bg-slate-950/80 p-2 text-white backdrop-blur-sm">
            {(function () {
              if (eventMode) {
                return (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {(function () {
                      if (playing) {
                        return <Pause className="h-5 w-5" />;
                      } else {
                        return <Play className="h-5 w-5" fill="currentColor" />;
                      }
                    })()}
                  </button>
                );
              } 
            })()}

            <button
              type="button"
              onClick={toggleMute}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {(function () {
                if (muted) {
                  return <VolumeX className="h-5 w-5 text-white/50" />;
                } else {
                  return <Volume2 className="h-5 w-5 text-white" />;
                }
              })()}
            </button>
          </div>
        );
      })()}
    </div>
  );
});