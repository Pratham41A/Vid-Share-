import { AlertCircle } from "lucide-react";

export function Error({ message }) {
  if (!message) return;

  return (
    <div
      className="
        flex w-full items-start gap-2.5
        rounded-lg border border-red-500/20
        bg-red-950/20 px-3.5 py-3
      "
    >
      <AlertCircle
        className="mt-0.5 size-4 shrink-0 text-red-400"
        strokeWidth={1.8}
      />

      <p className="min-w-0 break-words text-sm leading-5 text-red-200/90">
        {message}
      </p>
    </div>
  );
}