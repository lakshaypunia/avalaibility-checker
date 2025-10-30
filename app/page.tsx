"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  const [isNoAbsolute, setIsNoAbsolute] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    setMessage("Great, come back to whatsapp and let start chating");
  };

  const moveNoButton = (clientX: number, clientY: number, mode: "mouse" | "touch" = "mouse") => {
    const container = containerRef.current;
    const noBtn = noBtnRef.current;
    if (!container || !noBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Bounds and padding
    const padding = mode === "touch" ? 8 : 8;
    const maxLeft = containerRect.width - btnRect.width - padding;
    const maxTop = containerRect.height - btnRect.height - padding;

    // Current button center relative to container
    const btnCenterX = btnRect.left - containerRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top - containerRect.top + btnRect.height / 2;

    // Pointer relative to container
    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top;

    // Escape vector from pointer to button center
    let dx = btnCenterX - relX;
    let dy = btnCenterY - relY;
    const len = Math.max(1, Math.hypot(dx, dy));
    dx /= len;
    dy /= len;

    // Larger playful distance on touch
    const baseMin = mode === "touch" ? 180 : 140;
    const baseMax = mode === "touch" ? 320 : 220;
    const distance = baseMin + Math.random() * (baseMax - baseMin);

    // Add some random angular variation
    const angleJitter = (Math.random() - 0.5) * (Math.PI / 3); // +/- 30deg
    const cos = Math.cos(angleJitter);
    const sin = Math.sin(angleJitter);
    const jx = dx * cos - dy * sin;
    const jy = dx * sin + dy * cos;

    // Proposed new center position
    let proposedX = btnCenterX + jx * distance;
    let proposedY = btnCenterY + jy * distance;

    // Convert to top-left and clamp
    let newLeft = Math.min(maxLeft, Math.max(padding, proposedX - btnRect.width / 2));
    let newTop = Math.min(maxTop, Math.max(padding, proposedY - btnRect.height / 2));

    // If still too close to the pointer, jump to a random quadrant
    const proximity = mode === "touch" ? 110 : 80;
    const nearPointer =
      relX > newLeft - proximity &&
      relX < newLeft + btnRect.width + proximity &&
      relY > newTop - proximity &&
      relY < newTop + btnRect.height + proximity;

    if (nearPointer) {
      const targetLeft = Math.random() < 0.5 ? padding : maxLeft;
      const targetTop = Math.random() < 0.5 ? padding : maxTop;
      // add random inward offset
      newLeft = Math.min(maxLeft, Math.max(padding, targetLeft + (Math.random() * 80 - 40)));
      newTop = Math.min(maxTop, Math.max(padding, targetTop + (Math.random() * 80 - 40)));
    }

    if (!isNoAbsolute) setIsNoAbsolute(true);
    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
  };

  const onNoHover: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    moveNoButton(e.clientX, e.clientY, "mouse");
  };

  const onContainerMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // If cursor comes close again, keep dodging
    const noBtn = noBtnRef.current;
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const proximity = 64; // distance to start moving
    if (
      e.clientX > rect.left - proximity &&
      e.clientX < rect.right + proximity &&
      e.clientY > rect.top - proximity &&
      e.clientY < rect.bottom + proximity
    ) {
      moveNoButton(e.clientX, e.clientY, "mouse");
    }
  };

  const onNoTouch: React.TouchEventHandler<HTMLButtonElement> = (e) => {
    const t = e.touches[0];
    if (t) moveNoButton(t.clientX, t.clientY, "touch");
  };

  const onContainerTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const t = e.touches[0];
    if (!t) return;
    const noBtn = noBtnRef.current;
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const proximity = 72; // slightly larger on touch for comfort
    if (
      t.clientX > rect.left - proximity &&
      t.clientX < rect.right + proximity &&
      t.clientY > rect.top - proximity &&
      t.clientY < rect.bottom + proximity
    ) {
      moveNoButton(t.clientX, t.clientY, "touch");
    }
  };

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-pink-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <main className="w-full max-w-2xl h-dvh flex flex-col items-center justify-center rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-lg shadow-2xl p-4 sm:p-6 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 sm:py-16" aria-live="polite">
            <div className="h-12 w-12 sm:h-14 sm:w-14 animate-spin rounded-full border-4 border-zinc-200 border-t-pink-500 dark:border-zinc-800 dark:border-t-pink-400" />
            <p className="text-base sm:text-lg font-semibold text-zinc-700 dark:text-zinc-200">Scanning availability...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">✅ Result</h1>
            <p className="text-zinc-700 dark:text-zinc-300 text-base sm:text-lg">
              You are 100% free to chat with me tonight. 🩷
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 mb-5 text-sm sm:text-base">Press YES to confirm your feelings.</p>

            <div
              ref={containerRef}
              onMouseMove={onContainerMove}
              onTouchMove={onContainerTouchMove}
              className="relative min-h-32 sm:min-h-28 flex flex-col sm:flex-row flex-wrap items-center gap-3 pb-6"
              aria-label="Choices"
            >
              <button
                type="button"
                onClick={handleYes}
                className="w-full sm:w-auto rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-6 py-4 sm:px-5 sm:py-3 shadow-md active:translate-y-px transition"
              >
                YES 😘
              </button>
              <button
                ref={noBtnRef}
                type="button"
                onMouseEnter={onNoHover}
                onTouchStart={onNoTouch}
                onTouchMove={onNoTouch}
                className={[
                  "rounded-full bg-rose-500 text-white font-bold px-6 py-4 sm:px-5 sm:py-3 shadow-md transition select-none",
                  isNoAbsolute ? "absolute" : "relative",
                ].join(" ")}
                style={isNoAbsolute ? { left: 0, top: 0 } : undefined}
              >
                NO 😭
              </button>
            </div>

            <p className="min-h-7 text-center sm:text-left font-semibold text-pink-600 dark:text-pink-400 text-base sm:text-lg">{message}</p>
          </div>
        )}
      </main>
    </div>
  );
}
