
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Logo from "../assets/images/Logo.png";
import { Loader } from "../components/Loader.jsx";
import { VideoPlayer } from "../components/VideoPlayer.jsx";
import { PasswordModal } from "../components/PasswordModal.jsx";
import { checkViewAccess, fetchEvent } from "../services/eventService.js";

export function ViewEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(function () {
   (async function() {
    try {
      setLoading(true);
      setModalError(null);

        const fetchedEvent = await fetchEvent(id);
        const {status, visibility} = fetchedEvent
        if (status !== "started") {
          navigate("/");
          return;
        }

        setEvent(fetchedEvent);

        if (visibility === "public") {
          setModalOpen(false);
          return;
        }

        const password = localStorage.getItem(id);

        if (password) {
          try {
            await checkViewAccess(id, password);
            setModalOpen(false);
            return;
          } catch {
            setModalOpen(true);
            return;
          }
        }

        setModalOpen(true);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    })()

  }, [id, navigate]);

  async function handleModalSubmit(password) {
    try {
      setModalLoading(true);
      setModalError(null);

      await checkViewAccess(id, password);

      localStorage.setItem(id, password);
      setModalOpen(false);
    } catch (error) {
      const {
        response: {
          data: { error: Error },
        },
      } = error;

      setModalError(Error);
    } finally {
      setModalLoading(false);
    }
  }

  function handleBack() {
    navigate("/");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-4 sm:px-8 lg:px-10">
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

      {(function () {
        if (modalOpen) {
          return (
            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
              <section className="mx-auto w-full max-w-[800px]">
                <PasswordModal
                  open={modalOpen}
                  event={event}
                  loading={modalLoading}
                  error={modalError}
                  onClose={handleBack}
                  onSubmit={handleModalSubmit}
                />
              </section>
            </main>
          );
        } else {
          return (
            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
              <section className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl">
                <VideoPlayer event={event} />
              </section>
            </main>
          );
        }
      })()}
    </div>
  );
}
