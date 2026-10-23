import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DATA_EMIT_INTERVAL = 5000;
const MAX_DISCONNECT_TIME = 50000;

function getMimeType() {
  const { MediaRecorder } = window;

  if (!MediaRecorder) {
    throw new Error("MediaRecorder Not Supported");
  }

  if (MediaRecorder.isTypeSupported("video/webm")) {
    return "video/webm";
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    return "video/mp4";
  }
}

function getCameraStream() {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
}

function getScreenStream() {
  return navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
};

export function useRecorder({
  emitData,
  socketConnected,
}) {
  const navigate = useNavigate()

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);

  const disconnectTimerRef = useRef(null);

  const emitDataRef = useRef(emitData);

  useEffect(function () {
    emitDataRef.current = emitData;
  }, [emitData]);

  const clearDisconnectTimer = useCallback(function () {
    const disconnectTimer = disconnectTimerRef.current
    if (disconnectTimer) {
      clearTimeout(disconnectTimer);
      disconnectTimerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(async function () {
    const recorder = recorderRef.current;
    const stream = streamRef.current;

    //inactive, recording, paused
    if(recorder){
      const { state } = recorder;
      if (state !== "inactive") {
        await new Promise(function (resolve) {
          recorder.addEventListener("stop", resolve, { once: true });
          recorder.stop();
        });
      }
    }
      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.onended = null;
          track.stop();
        });
      }

      clearDisconnectTimer();

        recorderRef.current = null;
        streamRef.current = null;
        setStream(null);

  }, [clearDisconnectTimer]);

  const handleDisconnectTimer = useCallback(async function () {
    alert("BACKEND SERVER ERROR: Disconnect Timer");
    navigate('/')

  }, [navigate]); 

  const startDisconnectTimer = useCallback(function () {
    disconnectTimerRef.current = setTimeout(function () {
      handleDisconnectTimer();
    }, MAX_DISCONNECT_TIME);
  }, [handleDisconnectTimer]);


  useEffect(function () {
    if (socketConnected) {
      clearDisconnectTimer();
      return;
    }
      startDisconnectTimer();
  }, [
    socketConnected,
    clearDisconnectTimer,
    startDisconnectTimer,
  ]);

  const startRecording = useCallback(
    async function (eventId, mode) {
        await stopRecording();

        let stream;
        if (mode === "camera") {
          stream = await getCameraStream();
        } else {
          stream = await getScreenStream();
        }

        streamRef.current = stream;
        setStream(stream);

        const mimeType = getMimeType();

        const recorder = new MediaRecorder(stream, {
          mimeType
        });

        recorderRef.current = recorder;

        recorder.ondataavailable = function (event) {
          const { data: { size } } = event;
          const {data} = event;
          if (size) {
            emitDataRef.current(eventId, data);
          }
        };

        recorder.start(DATA_EMIT_INTERVAL);
    },
    [
      stopRecording
    ]
  );

  useEffect(function () {
    return function () {
     stopRecording();
    };
  }, [stopRecording]);

  return {
    startRecording,
    stopRecording,
    stream
  };
}