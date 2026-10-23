import { memo, useEffect, useRef } from "react";

const LogItem = memo(function LogItem({ log } ) {
  const { time, message } = log;

  return (
    <div className="flex items-center gap-4 border-b border-white/10 px-5 py-3 last:border-0">
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">
        {message}
      </p>

      <time className="shrink-0 text-xs text-white/50">
        {time}
      </time>
    </div>
  );
});

export const LogPanel = memo(function LogPanel({ logs } ) {
  const scrollRef = useRef(null);
  const { length: logsLength } = logs;

useEffect(function () {
  const scrollElement = scrollRef.current;

  if (scrollElement) {
    scrollElement.scrollTo({ top: 0 });
  }
}, [logs]);

  return (
    <div className="py-6">
      <section className="overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        <header className="border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight text-white">
            Logs
          </h2>
        </header>

        <div
          ref={scrollRef}
          className="max-h-[380px] min-h-[120px] overflow-y-auto"
        >
          {(function () {
            if (logsLength > 0) {
              return logs.map(function (log) {
                const { id: logId } = log;
                return <LogItem key={logId} log={log} />;
              });
            } else {
              return (
                <div className="px-5 py-8 text-center text-sm text-white/50">
                  No Logs
                </div>
              );
            }
          })()}
        </div>
      </section>
    </div>
  );
});