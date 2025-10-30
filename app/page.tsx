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
    setMessage("Great! Come back to WhatsApp and let’s start chatting 😉");
  };

  const moveNoButton = (
    clientX: number,
    clientY: number,
    mode: "mouse" | "touch" = "mouse"
  ) => {
    const container = containerRef.current;
    const noBtn = noBtnRef.current;
    if (!container || !noBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const padding = 8;
    const maxLeft = containerRect.width - btnRect.width - padding;
    const maxTop = containerRect.height - btnRect.height - padding;

    // Button center relative to container
    const btnCenterX =
      btnRect.left - containerRect.left + btnRect.width / 2;
    const btnCenterY =
      btnRect.top - containerRect.top + btnRect.height / 2;

    // Pointer position relative to container
    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top;

    // Direction away from pointer
    let dx = btnCenterX - relX;
    let dy = btnCenterY - relY;
    const len = Math.max(1, Math.hypot(dx, dy));
    dx /= len;
    dy /= len;

    // Larger distance for touch
    const baseMin = mode === "touch" ? 260 : 160;
    const baseMax = mode === "touch" ? 480 : 260;
    const distance = baseMin + Math.random() * (baseMax - baseMin);

    // Random angle
    const angleJitter = (Math.random() - 0.5) * (Math.PI / 3); // ±30°
    const cos = Math.cos(angleJitter);
    const sin = Math.sin(angleJitter);
    const jx = dx * cos - dy * sin;
    const jy = dx * sin + dy * cos;

    // Proposed new center
    let proposedX = btnCenterX + jx * distance;
    let proposedY = btnCenterY + jy * distance;

    // Clamp within container
    let newLeft = Math.min(
      maxLeft,
      Math.max(padding, proposedX - btnRect.width / 2)
    );
    let newTop = Math.min(
      maxTop,
      Math.max(padding, proposedY - btnRect.height / 2)
    );

    // Check proximity — if too close, jump to random corner
    const proximity = mode === "touch" ? 140 : 80;
    const nearPointer =
      relX > newLeft - proximity &&
      relX < newLeft + btnRect.width + proximity &&
      relY > newTop - proximity &&
      relY < newTop + btnRect.height + proximity;

    if (nearPointer) {
      const corners = [
        { left: padding, top: padding },
        { left: maxLeft, top: padding },
        { left: padding, top: maxTop },
        { left: maxLeft, top: maxTop },
      ];
      const randomCorner =
        corners[Math.floor(Math.random() * corners.length)];
      newLeft = randomCorner.left;
      newTop = randomCorner.top;
    }

    // ✅ Screen-edge safety — make sure it never moves outside the viewport
    const safeLeft = Math.min(
      containerRect.width - btnRect.width - padding,
      Math.max(padding, newLeft)
    );
    const safeTop = Math.min(
      containerRect.height - btnRect.height - padding,
      Math.max(padding, newTop)
    );

    if (!isNoAbsolute) setIsNoAbsolute(true);
    noBtn.style.left = `${safeLeft}px`;
    noBtn.style.top = `${safeTop}px`;
  };

  // Mouse + Touch handlers
  const onNoHover: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    moveNoButton(e.clientX, e.clientY, "mouse");
  };

  const onContainerMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const noBtn = noBtnRef.current;
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const proximity = 64;
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
    const proximity = 72;
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
    <div className="min-h-dvh w-full bg-gradient-to-b from-pink-50 via-white to-indigo-50 flex items-center justify-center px-4 py-6">
      <main className="w-full max-w-2xl h-dvh flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-lg shadow-2xl p-6">
        {loading ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-16"
            aria-live="polite"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-pink-500" />
            <p className="text-lg font-semibold text-zinc-700">
              Scanning availability...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold mb-2">✅ Result</h1>
            <p className="text-zinc-700 text-lg">
              You are 100% free to chat with me tonight. 🩷
            </p>
            <p className="text-zinc-500 mb-5 text-base">
              Press YES to confirm your feelings.
            </p>

            <div
              ref={containerRef}
              onMouseMove={onContainerMove}
              onTouchMove={onContainerTouchMove}
              className="relative min-h-32 flex flex-col sm:flex-row items-center gap-3 pb-6 overflow-hidden"
              aria-label="Choices"
            >
              <button
                type="button"
                onClick={handleYes}
                className="w-full sm:w-auto rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-6 py-4 shadow-md transition"
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
                  "rounded-full bg-rose-500 text-white font-bold px-6 py-4 shadow-md select-none transition",
                  isNoAbsolute ? "absolute" : "relative",
                ].join(" ")}
                style={isNoAbsolute ? { left: 0, top: 0 } : undefined}
              >
                NO 😭
              </button>
            </div>

            <p className="min-h-7 text-center font-semibold text-pink-600 text-lg">
              {message}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
