import { useState } from "react";
import { Lock } from "lucide-react";
import { Error } from "./Error.jsx";

export function PasswordModal( { open, loading, error, onClose, onSubmit }) {

  const [password, setPassword] = useState("");

  if (!open) {
    return ;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      return;
    }

    onSubmit(password);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-slate-950 text-white shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-white/70"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />

              <input
                type="password"
                value={password}
                minLength={5}
                autoFocus
                onChange={function (){
                  const {target:{value}} = event
                  setPassword(value)
                }}
                placeholder="Enter Password"
                className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

         <Error message={error} />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="min-h-11 cursor-pointer rounded-lg border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {(function () {
                if (loading) {
                  return "Processing..";
                } else {
                  return "Continue";
                }
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}