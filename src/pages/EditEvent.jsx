import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Logo from "../assets/images/Logo.png";
import { Loader } from "../components/Loader.jsx";
import { VideoPlayer } from "../components/VideoPlayer.jsx";
import { ControlPanel } from "../components/ControlPanel.jsx";
import { LogPanel } from "../components/LogPanel.jsx";

import { fetchEvent, checkEditAccess } from "../services/eventService.js";
import { useSocket } from "../hooks/useSocket.js";
import { useRecorder } from "../hooks/useRecorder.js";

function getInputFormat() {
  const { MediaRecorder } = window;

  if (!MediaRecorder) {
    throw new Error("MediaRecorder Not Supported");
  }

  if (MediaRecorder.isTypeSupported("video/webm")) {
    return "webm";
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    return "mp4";
  }
}

export function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState("camera");

  const {
    socketConnected,
    logs,
    startEvent,
    pauseEvent,
    resumeEvent,
    endEvent,
    emitData,
  } = useSocket();

  const { startRecording, stopRecording, stream } = useRecorder({
    emitData,
    socketConnected,
  });

  useEffect(
    function () {
      (async function () {
        try {
          await checkEditAccess(id);
          const fetchedEvent = await fetchEvent(id);
          const { status: fetchedStatus } = fetchedEvent;

          if (fetchedStatus === "created" || fetchedStatus === 'paused') {
            setStatus(fetchedStatus);
          } else {
            navigate("/");
          }
        } catch {
          navigate("/");
        } finally {
          setLoading(false);
        }
      })();
    },
    [id, navigate]
  );

  const handleStart = useCallback(
    async function () {
      await startRecording(id, mode);
      startEvent(id, getInputFormat());
      setStatus("started");
    },
    [id, mode, startEvent, startRecording]
  );

  const handlePause = useCallback(
    async function () {
        await stopRecording();
        pauseEvent(id);
        setStatus("paused");
    },
    [id, pauseEvent, stopRecording]
  );

  const handleResume = useCallback(
    async function () {
      await startRecording(id, mode);
      resumeEvent(id, getInputFormat());
      setStatus("started");
    },
    [id, mode, resumeEvent, startRecording]
  );

  const handleEnd = useCallback(
    async function () {
        await stopRecording();
        endEvent(id);
        setStatus("ended");
    },
    [endEvent, id, stopRecording]
  );

  function handleBack() {
    navigate("/");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-3 rounded-lg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <img
              src={Logo}
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight">
              Vid-Share
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.85fr)]">
          <section className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
            <VideoPlayer stream={stream} />
          </section>

          <aside className="min-w-0">
            <ControlPanel
              status={status}
              socketConnected={socketConnected}
              mode={mode}
              setMode={setMode}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onEnd={handleEnd}
            />
          </aside>

          <section className="min-w-0 border-t border-white/10 pt-6 lg:col-span-2">
            <LogPanel logs={logs} />
          </section>
        </div>
      </main>
    </div>
  );
}