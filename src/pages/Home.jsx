import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";
import { Loader } from "../components/Loader.jsx";
import { EventCard } from "../components/EventCard.jsx";
import { CreateEventDrawer } from "../components/CreateEventDrawer.jsx";

import {
  fetchEvents,
  createEvent,
} from "../services/eventService.js";
import { Error } from "../components/Error.jsx";

export function Home() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const { length: eventsLength } = events;

  const sortedEvents = useMemo(
    function () {
      return [...events].sort(function (eventA, eventB) {
        const { status: statusA } = eventA;
        const { status: statusB } = eventB;

        const order = ["started", "paused", "created", "ended"];
        const indexA = order.indexOf(statusA);
        const indexB = order.indexOf(statusB);

        return indexA - indexB;
      });
    },
    [events]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(
    function () {
      (async function () {
        try {
          setLoading(true);
          setError(null);

          const fetchedEvents = await fetchEvents();

          setEvents(fetchedEvents);
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
      })();
    },
    []
  );

  const handleView = useCallback(
    function (event) {
      const { _id: eventId } = event;
      navigate(`/event/view/${eventId}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    function (event) {
      const { _id: eventId } = event;
      navigate(`/event/edit/${eventId}`);
    },
    [navigate]
  );

  const handleDrawerOpen = useCallback(function () {
    setDrawerError(null);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(function () {
    setDrawerError(null);
    setDrawerOpen(false);
  }, []);

  const handleDrawerSubmit = useCallback(async function (formData) {
    try {
      setDrawerError(null);
      setDrawerLoading(true);

      await createEvent(formData);

      setDrawerOpen(false);
      const {location} = window
      location.reload()
    } catch (error) {
      const {
        response: {
          data: { error: Error },
        },
      } = error;

      setDrawerError(Error);
    } finally {
      setDrawerLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <header
            className="
              mb-8 flex flex-col gap-5
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <img
                src={Logo}
                className="h-10 w-10 object-contain"
              />

              <span className="text-lg font-semibold tracking-tight">
                Vid-Share
              </span>
            </div>

            <button
              type="button"
              onClick={handleDrawerOpen}
              className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Create Event
            </button>
          </header>

          <Error message={error} />

          {(function () {
            if (eventsLength === 0) {
              return (
                <section
                  className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-950 px-6 py-16 text-center"
                >
                  <h2 className="text-2xl font-semibold tracking-tight">
                    No Events
                  </h2>

                  <button
                    type="button"
                    onClick={handleDrawerOpen}
                    className="mt-6 inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    + Create Event
                  </button>
                </section>
              );
            } else {
              return (
                <section
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {sortedEvents.map(function (event) {
                    const { _id: eventId } = event;

                    return (
                      <EventCard
                        key={eventId}
                        event={event}
                        onView={handleView}
                        onEdit={handleEdit}
                      />
                    );
                  })}
                </section>
              );
            }
          })()}
        </div>
      </main>

      <CreateEventDrawer
        open={drawerOpen}
        error={drawerError}
        loading={drawerLoading}
        onClose={handleDrawerClose}
        onSubmit={handleDrawerSubmit}
      />
    </>
  );
}