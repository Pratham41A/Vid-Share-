import { memo, useEffect, useState } from "react";
import { Globe, ImagePlus, Lock, X } from "lucide-react";
import { Error } from "./Error.jsx";

export const CreateEventDrawer = memo(function CreateEventDrawer({
    loading,
    open,
    error,
    onClose,
    onSubmit,
  }) {

  const [name, setName] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [password, setPassword] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);

  useEffect(
    function () {
      if (!open) {
        return;
      }

      setName(null);
      setVisibility("public");
      setPassword(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      setThumbnailError(null);
    },
    [open]
  );

  useEffect(
    function () {
      return function () {
        if (thumbnailPreview) {
          URL.revokeObjectURL(thumbnailPreview);
        }
      };
    },
    [thumbnailPreview]
  );

  function handleThumbnailChange(event) {
    const {
      target: { files },
    } = event;

    const file = files[0];

    if (!file) {
      return;
    }

    const { type } = file;

    if (!type.startsWith("image/")) {
      setThumbnailError("Please Upload Image");
      setThumbnail(null);
      setThumbnailPreview(null);
      return;
    }

    setThumbnailError(null);
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!thumbnail) {
      setThumbnailError("Thumbnail Required");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("visibility", visibility);

    if (visibility === "private") {
      formData.append("password", password);
    }

    formData.append("thumbnail", thumbnail);

    onSubmit(formData);
  }

  if (!open) {
    return ;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-slate-950 text-white shadow-2xl">

      <div className="shrink-0 border-b border-white/10">
        <div className="flex items-center justify-between bg-white/[0.02] px-6 py-5">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Create Event
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {(function(){
          if(error){
            return (
          <div className="px-6 pb-4">
            <Error message={error} />
          </div>
            )
          }
        })()}

      </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={function (){
                    const {target:{value}} = event
                    setName(value)
                  }}
                  placeholder="Enter Name"
                  required
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Visibility
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={function (){
                      setVisibility("public")
                    }}
                    className={(function () {
                      if (visibility === "public") {
                        return "flex cursor-pointer items-center gap-3 rounded-lg border border-white bg-white p-3.5 text-left text-slate-950 transition";
                      } else {
                        return "flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-slate-950 p-3.5 text-left text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
                      }
                    })()}
                  >
                    <div
                      className={(function () {
                        if (visibility === "public") {
                          return "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white";
                        } else {
                          return "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70";
                        }
                      })()}
                    >
                      <Globe size={18} />
                    </div>

                    <div>
                      <p
                        className={(function () {
                          if (visibility === "public") {
                            return "text-sm font-semibold text-slate-950";
                          } else {
                            return "text-sm font-medium text-white";
                          }
                        })()}
                      >
                        Public
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={function () {
                      setVisibility("private")
                    }}
                    className={(function () {
                      if (visibility === "private") {
                        return "flex cursor-pointer items-center gap-3 rounded-lg border border-white bg-white p-3.5 text-left text-slate-950 transition";
                      } else {
                        return "flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-slate-950 p-3.5 text-left text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
                      }
                    })()}
                  >
                    <div
                      className={(function () {
                        if (visibility === "private") {
                          return "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white";
                        } else {
                          return "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70";
                        }
                      })()}
                    >
                      <Lock size={18} />
                    </div>

                    <div>
                      <p
                        className={(function () {
                          if (visibility === "private") {
                            return "text-sm font-semibold text-slate-950";
                          } else {
                            return "text-sm font-medium text-white";
                          }
                        })()}
                      >
                        Private
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {(function () {
                if (visibility === "private") {
                  return (
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Password
                      </label>

                      <input
                        type="password"
                        value={password}
                        onChange={function (){
                          const {target:{value}} = event
                          setPassword(value)
                        }}
                        placeholder="Enter Password"
                        required
                        minLength={5}
                        className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>
                  );
                }
              })()}
            <Error message={thumbnailError} />
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-white/70">
                    Thumbnail
                  </label>

                  <span className="text-xs text-white/40">
                    16:9
                  </span>
                </div>

                {(function () {
                  if (!thumbnailPreview) {
                    return (
                      <label
                        className="
                          mx-auto flex
                          aspect-video w-full max-w-[420px]
                          cursor-pointer flex-col
                          items-center justify-center
                          rounded-xl border border-dashed
                          border-white/20
                          bg-slate-950
                          transition
                          hover:border-white/40
                        "
                      >
                        <div
                          className="
                            mb-2 flex h-11 w-11
                            items-center justify-center
                            rounded-lg border border-white/10
                            bg-white/5
                            text-white/70
                          "
                        >
                          <ImagePlus size={20} />
                        </div>

                        <p className="text-sm font-medium text-white/70">
                          Upload Thumbnail Image
                        </p>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </label>
                    );
                  } else {
                    return (
                      <div
                        className="
                          relative aspect-video
                          w-full overflow-hidden
                          rounded-xl border border-white/10
                          bg-slate-950
                        "
                      >
                        <label
                          className="absolute inset-0 cursor-pointer"
                        >
                          <img
                            src={thumbnailPreview}
                            className="h-full w-full object-contain"
                          />

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    );
                  }
                })()}
                


              </div>
            </div>
          </div>

          <div
            className="
              flex items-center justify-end gap-3
              border-t border-white/10
              bg-slate-950
              px-6 py-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                cursor-pointer
                rounded-lg
                px-5 py-2.5
                text-sm font-medium
                text-white/70
                transition
                hover:opacity-80
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex min-h-11 cursor-pointer
                items-center justify-center
                rounded-lg
                bg-white
                px-6 py-2.5
                text-sm font-semibold
                text-slate-950
                transition
                hover:opacity-80
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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
});