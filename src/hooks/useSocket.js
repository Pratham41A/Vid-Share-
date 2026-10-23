import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket } from "../services/socketService.js";
import { useNavigate } from "react-router-dom";

export function useSocket() {
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  const [logs, setLogs] = useState([]);
  const pendingDataRef = useRef([]);
  const navigate=useNavigate()

  const addLog = useCallback(function (type, message) {
    setLogs(function (currentLogs) {
      return [
      {
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        type,
        message,
      },
      ...currentLogs,
      ].slice(0, 10);
    });
  }, []);

  const emit = useCallback( 
    function (event, payload) {
      const socket = socketRef.current;
      const {connected} = socket

      if (connected) {
        socket.emit(event, payload);
        return;
      }

      if(event === "data"){
        pendingDataRef.current.push({ event, payload });
        addLog("info", "Data Pending");
      }
    },
    [addLog]
  );

  const startEvent = useCallback(
    function (eventId, inputFormat) {
       emit("start", { eventId, inputFormat });
    },
    [emit]
  );
  const resumeEvent = useCallback(
    function (eventId, inputFormat) {
       emit("resume", { eventId, inputFormat });
    },
    [emit]
  );
  const pauseEvent = useCallback(
    function (eventId) {
       emit("pause", { eventId });
    },
    [emit]
  );
  const endEvent = useCallback(
    function (eventId) {
       emit("end", { eventId });
    },
    [emit]
  );

  const emitData = useCallback(
    function (eventId, data) {
       emit("data", { eventId, data });
    },
    [emit]
  );

  const processPendingData = useCallback(function () {

    const pendingData = pendingDataRef.current.splice(0);
    
    const {length} = pendingData

    for (let i = 0; i < length; i++) {
      const { event, payload } = pendingData[i];
      emit(event, payload);
    }
    addLog('info','Pending Data Processed')
  }, [emit, addLog]);

  useEffect(function () {
    const socket = connectSocket();
    socketRef.current = socket;

    function handleConnect() {
      setSocketConnected(true);
      addLog("info", "Server Connected");
      processPendingData();
    }

    function handleDisconnect() {
      setSocketConnected(false);
      addLog("error", "Server Disconnected");
    }

    function handleInfo(message) {
      addLog("info", message);
    }

    function handleError(message) {
      addLog("error", message);
    }

    function handleBackendServerError() {
      alert("BACKEND SERVER ERROR");
      navigate('/')
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("info", handleInfo);
    socket.on("error", handleError);
    socket.on("BACKEND_SERVER_ERROR", handleBackendServerError);

    return function () {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("info", handleInfo);
      socket.off("error", handleError);
      socket.off("BACKEND_SERVER_ERROR", handleBackendServerError);
    };
  }, [addLog, processPendingData, navigate, pauseEvent]);


  return {
    socketConnected,
    logs,

    startEvent,
    resumeEvent,
    pauseEvent,
    endEvent,

    emitData
    };
}