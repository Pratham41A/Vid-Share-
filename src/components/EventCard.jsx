import { memo } from "react";
import { Globe, Lock, Play, Settings } from "lucide-react";

import { useAuth } from "../hooks/useAuth.js";

export const EventCard = memo(function EventCard({ event, onView, onEdit }) {

  const { user: { _id: userId } }  = useAuth();

  const {
    name,
    thumbnailData,
    owner: { _id: ownerId, name: ownerName },
    visibility,
    status,
  } = event;

  const viewable = status === "started";
  let editable = false;

  if (String(userId) === String(ownerId)) {
    if(["created", "paused"].includes(status)){
      editable = true;
    }
  }

  function handleViewClick() {
    onView(event);
  }

  function handleEditClick() {
    onEdit(event);
  }

  return (
    <article className="flex w-full max-w-[400px] flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        <img
          src={thumbnailData}
          className="h-full w-full object-contain"
        />

        <span className="absolute left-3 top-3 inline-flex h-6 items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/80 px-2.5 text-xs font-medium text-white backdrop-blur-sm">
          <span
            className={(function () {
              if (status === "started") {
                return "h-1.5 w-1.5 rounded-full bg-red-400";
              } else if(status==="ended"){
                return "h-1.5 w-1.5 rounded-full bg-gray-500";
              }
              else {
                return "h-1.5 w-1.5 rounded-full bg-amber-400";
              }
            })()}
          />
          {(function () {
            if (status === "started") {
              return "LIVE";
            } else if(status === "ended") {
              return "OFFLINE";
            } else {
              return "WAIT"
            }
          })()}
        </span>

        <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-slate-950/80 text-white backdrop-blur-sm">
          {(function () {
            if (visibility === "public") {
              return <Globe size={14} />;
            } else {
              return <Lock size={14} />;
            }
          })()}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-3 px-1">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-sm font-semibold text-white"
        >
          {(function () {
            return ownerName.charAt(0).toUpperCase();
          })()}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-white" >
            {name}
          </h3>
        </div>

        {(function () {
          if (viewable) {
            return (
              <button
                type="button"
                onClick={handleViewClick}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-slate-950 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Play
                  size={13}
                  fill="currentColor"
                  strokeWidth={2}
                />
                View
              </button>
            );
          }
        })()}

        {(function () {
          if (editable) {
            return (
              <button
                type="button"
                onClick={handleEditClick}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-slate-900 px-3.5 text-xs font-semibold text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Settings size={13} strokeWidth={2} />
                Edit
              </button>
            );
          }
        })()}
      </div>
    </article>
  );
});