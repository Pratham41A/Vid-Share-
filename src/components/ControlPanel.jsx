import { memo, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Square,
  Wifi,
  WifiOff,
  Camera,
  Monitor,
  Check,
  ChevronDown,
} from "lucide-react";

const MODE_OPTIONS = [
  {
    value: "camera",
    label: "CAMERA",
    icon: Camera,
  },
  {
    value: "screen",
    label: "SCREEN",
    icon: Monitor,
  },
];

const Action = memo(function Action( {
    disabled,
    onClick,
    icon: Icon,
    className,
    children,
  } ) {

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit ${className}`}
    >
      <Icon size={16} />
      {children}
    </button>
  );
});

export const ControlPanel = memo(function ControlPanel({
    socketConnected,  
    status,
    mode,
    setMode,
    onStart,
    onPause,
    onResume,
    onEnd,
  } ) {

  const [modeDropDownVisible, setModeDropDownVisible] = useState(false);
  const modeRef = useRef(null);

  let actionDisabled = true;
  if (socketConnected) {
    actionDisabled = false;
  }

  const { icon: SelectedModeIcon, label: selectedModeLabel } = MODE_OPTIONS.find(function (modeOption) {
    const { value } = modeOption;
    return value === mode;
  });

  useEffect(
    function () {
      function handleClickOutsideMode(event) {
        const { target } = event;
        const modeElement = modeRef.current;

        if (modeElement) {
          if (!modeElement.contains(target)) {
            setModeDropDownVisible(false);
          }
        }
      }

      document.addEventListener("mousedown", handleClickOutsideMode);

      return function () {
        document.removeEventListener("mousedown", handleClickOutsideMode);
      };
    },
    []
  );

  function handleModeDropdownVisibilityToggle() {
    setModeDropDownVisible(function (previousModeDropDownVisibility) {
      return !previousModeDropDownVisibility
    });
  }

  return (
    <div className="py-2">
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-white/50">
            Connection
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            {(function () {
              if (socketConnected) {
                return (
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <Wifi size={16} />
                    Connected
                  </span>
                );
              } else {
                return (
                  <span className="flex items-center gap-2 text-sm font-semibold text-rose-400">
                    <WifiOff size={16} />
                    Disconnected
                  </span>
                );
              }
            })()}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-white/50">
            Mode
          </div>

          <div ref={modeRef} className="relative mt-2.5">
            <button
              type="button"
              onClick={handleModeDropdownVisibilityToggle}
              className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-slate-900 px-3.5 py-2.5 text-left transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SelectedModeIcon size={17} className="text-white/70" />

              <span className="flex-1 text-sm font-medium text-white">
                {selectedModeLabel}
              </span>

              <ChevronDown
                size={16}
                className={`text-white/70 transition-transform duration-200 ${(function () {
                  if (modeDropDownVisible) {
                    return "rotate-180";
                  } else {
                    return "";
                  }
                })()}`}
              />
            </button>

            <div
              className={`absolute left-0 right-0 z-50 mt-2 origin-top overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-1.5 shadow-2xl transition-[opacity,transform] duration-200 ${(function () {
                if (modeDropDownVisible) {
                  return "visible translate-y-0 opacity-100";
                } else {
                  return "invisible -translate-y-2 opacity-0 pointer-events-none";
                }
              })()}`}
            >
              {MODE_OPTIONS.map(function (option) {
                const { value, label, icon: Icon } = option;
                const selected = mode === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={function () {
                      setMode(value);
                      setModeDropDownVisible(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed ${(function () {
                      if (selected) {
                        return "bg-white text-slate-950 font-semibold";
                      } else {
                        return "text-white hover:bg-white/5 font-medium";
                      }
                    })()}`}
                  >
                    <Icon size={17} />

                    <span className="flex-1">{label}</span>

                    {(function () {
                      if (selected) {
                        return <Check size={15} />;
                      } 
                    })()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {(function () {
          if (status === "created") {
            return (
              <Action
                disabled={actionDisabled}
                onClick={onStart}
                icon={Play}
                className="bg-white text-slate-950"
              >
                Start
              </Action>
            );
          } else if (status === "started") {
            return (
              <>
                <Action
                  disabled={actionDisabled}
                  onClick={onPause}
                  icon={Pause}
                  className="border border-white/10 bg-slate-900 text-white"
                >
                  Pause
                </Action>

                <Action
                  disabled={actionDisabled}
                  onClick={onEnd}
                  icon={Square}
                  className="border border-white/10 bg-slate-900 text-rose-400"
                >
                  End
                </Action>
              </>
            );
          } else if (status === "paused") {
            return (
                <Action
                  disabled={actionDisabled}
                  onClick={onResume}
                  icon={Play}
                  className="bg-white text-slate-950"
                >
                  Resume
                </Action>
            );
          } 
        })()}
      </div>
    </div>
  );
});