import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { login } from "../services/authService.js";
import Logo from "../assets/images/Logo.png";
import { Error } from "../components/Error.jsx";

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    try {
      event.preventDefault();

      setError(null);

      const trimmedName = name.trim();
      const trimmedPassword = password.trim();

      if (!trimmedName) {
        setError("Name is Required.");
        return;
      }

      if (!trimmedPassword) {
        setError("Password is Required.");
        return;
      }
      setLoading(true);

      const loggedInUser = await login({
        name: trimmedName,
        password: trimmedPassword,
      });

      setUser(loggedInUser);
      navigate("/");
    } catch (error) {
      const {
        response: {
          data: { error: Error },
        },
      } = error;

      setError(Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <section className="flex flex-col px-8 pb-16 pt-10 sm:px-14 lg:justify-between lg:px-20 lg:py-12 xl:px-28">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              className="h-10 w-10 object-contain"
            />

            <span className="text-lg font-semibold tracking-tight">
              Vid-Share
            </span>
          </div>

          <div className="mt-24 lg:mt-0">
            <h1 className="text-6xl font-semibold leading-tight tracking-tight sm:text-8xl">
              <span className="block text-white">Stream</span>

              <span className="block text-white">View</span>
            </h1>
          </div>

          <div className="hidden lg:block" />
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[420px]">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-white/10 bg-slate-950 p-6 sm:p-8"
            >
              <div className="mb-5">
                <label
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={function (event) {
                    const {
                      target: { value },
                    } = event;

                    setName(value);
                  }}
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="mb-3">
                <label
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={function (event) {
                    const {
                      target: { value },
                    } = event;

                    setPassword(value);
                  }}
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Error message={error} />

              <button
                type="submit"
                disabled={loading}
                className="mt-3 min-h-12 w-full cursor-pointer rounded-lg bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(function () {
                  if (loading) return "Processing..";
                  return "Continue";
                })()}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}