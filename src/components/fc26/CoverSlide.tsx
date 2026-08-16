import React, { useRef, useEffect, useState } from "react";
import { Sparkles, Flame } from "lucide-react";

export function CoverSlide({ onStartPresentation }: { onStartPresentation?: () => void }) {
  // Ref untuk kontainer utama dan layer warna
  const containerRef = useRef<HTMLDivElement>(null);
  const colorLayerRef = useRef<HTMLDivElement>(null);

  // URL gambar utama
  const imageUrl = "https://beeimg.com/images/u95149250962.png";

  // Ref untuk menyimpan status dan posisi DUA sorotan lampu
  const spots = useRef([
    {
      id: 1,
      x: 0, // Inisialisasi ke kiri bawah
      y: 0,
      vx: 0.6, // Lambat ke kanan
      vy: -0.5, // Lambat ke atas
      radius: 160,
      initialized: false,
    },
    {
      id: 2,
      x: 0, // Inisialisasi ke kanan bawah
      y: 0,
      vx: -0.4, // Lambat ke kiri
      vy: -0.7, // Lambat ke atas
      radius: 160,
      initialized: false,
    },
  ]);

  // Melacak indeks lampu mana yang sedang diseret (drag) oleh pengguna
  const draggedSpotIndex = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!containerRef.current || !colorLayerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Inisialisasi posisi awal (Kiri Bawah & Kanan Bawah) ala bioskop / stadium floodlights
      if (!spots.current[0].initialized && rect.width > 0 && rect.height > 0) {
        // Lampu Kiri Bawah
        spots.current[0].x = spots.current[0].radius;
        spots.current[0].y = rect.height - spots.current[0].radius;
        spots.current[0].initialized = true;

        // Lampu Kanan Bawah
        spots.current[1].x = rect.width - spots.current[1].radius;
        spots.current[1].y = rect.height - spots.current[1].radius;
        spots.current[1].initialized = true;
      }

      // Update posisi untuk masing-masing lampu jika initialized
      if (spots.current[0].initialized && rect.width > 0) {
        spots.current.forEach((spot, index) => {
          // Update posisi jika lampu ini tidak sedang di-drag oleh user
          if (draggedSpotIndex.current !== index) {
            spot.x += spot.vx;
            spot.y += spot.vy;

            // Pantulan horizontal (Kiri & Kanan)
            if (spot.x - spot.radius <= 0) {
              spot.x = spot.radius;
              spot.vx = Math.abs(spot.vx);
            } else if (spot.x + spot.radius >= rect.width) {
              spot.x = rect.width - spot.radius;
              spot.vx = -Math.abs(spot.vx);
            }

            // Pantulan vertikal (Atas & Bawah)
            if (spot.y - spot.radius <= 0) {
              spot.y = spot.radius;
              spot.vy = Math.abs(spot.vy);
            } else if (spot.y + spot.radius >= rect.height) {
              spot.y = rect.height - spot.radius;
              spot.vy = -Math.abs(spot.vy);
            }
          }
        });

        // Buat mask gradient untuk kedua lampu
        const maskGradients = spots.current.map(
          (spot) =>
            `radial-gradient(circle ${spot.radius}px at ${spot.x}px ${spot.y}px, rgba(0,0,0,1) 18%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)`
        );

        // Gabungkan kedua mask menggunakan koma
        const combinedMask = maskGradients.join(", ");

        colorLayerRef.current.style.WebkitMaskImage = combinedMask;
        colorLayerRef.current.style.maskImage = combinedMask;
        colorLayerRef.current.style.WebkitMaskComposite = "add";
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Cari lampu mana yang paling dekat dengan titik klik
    let minDistance = Infinity;
    let targetIndex: number | null = null;

    spots.current.forEach((spot, index) => {
      const dx = clickX - spot.x;
      const dy = clickY - spot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= spot.radius * 1.25 && distance < minDistance) {
        minDistance = distance;
        targetIndex = index;
      }
    });

    if (targetIndex !== null) {
      draggedSpotIndex.current = targetIndex;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggedSpotIndex.current === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const activeSpot = spots.current[draggedSpotIndex.current];

    let newX = e.clientX - rect.left;
    let newY = e.clientY - rect.top;

    // Batasi agar sorotan tidak keluar dari layar saat diseret
    newX = Math.max(activeSpot.radius, Math.min(newX, rect.width - activeSpot.radius));
    newY = Math.max(activeSpot.radius, Math.min(newY, rect.height - activeSpot.radius));

    activeSpot.x = newX;
    activeSpot.y = newY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggedSpotIndex.current !== null) {
      draggedSpotIndex.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignored
      }
    }
  };

  return (
    <div className="w-full h-full overflow-hidden bg-[#050505] m-0 p-0 select-none relative flex justify-center items-center">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[200px] bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div
        ref={containerRef}
        className="relative w-full h-full touch-none cursor-crosshair flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Layer 1: Gambar default hitam putih (Gelap misterius, kontras tinggi) */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: "grayscale(100%) contrast(1.3) brightness(0.22)",
          }}
        />

        {/* Layer 2: Gambar berwarna dengan 2 masking cahaya bioskop */}
        <div
          ref={colorLayerRef}
          className="absolute inset-0 bg-cover bg-no-repeat bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${imageUrl})`,
            imageRendering: "high-quality",
            filter: "brightness(1.15) contrast(1.1) saturate(1.15)",
          }}
        />

        {/* Top Minimalist Luxury Branding Badge */}
        <div className="absolute top-5 sm:top-7 left-5 sm:left-7 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase font-mono">
              EA SPORTS FC 26
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              PS4 PRO CHAMPIONSHIP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
