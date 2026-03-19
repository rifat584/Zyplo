"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import testimonials from "@/lib/testimonials.json";

const AUTO_SLIDE_MS = 4000;

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-xl border border-border bg-white dark:bg-[#0B0f19] p-6">
            <div className="mb-3 h-4 w-3/4 rounded bg-muted dark:bg-surface" />
            <div className="mb-2 h-3 w-full rounded bg-muted dark:bg-surface" />
            <div className="mb-2 h-3 w-5/6 rounded bg-muted dark:bg-surface" />
            <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted dark:bg-surface" />
                <div className="flex-1">
                    <div className="mb-2 h-3 w-1/2 rounded bg-muted dark:bg-surface" />
                    <div className="h-3 w-1/3 rounded bg-muted dark:bg-surface" />
                </div>
            </div>
        </div>
    );
}

function TestimonialCard({ t }) {
    return (
        <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-foreground">“{t.quote}”</p>
            <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground">
                    {t.avatar || t.name?.[0]}
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {t.role} · {t.company}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    const [loading, setLoading] = useState(true);
    const [perView, setPerView] = useState(3); // 3 / 2 / 1
    const [index, setIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const containerRef = useRef(null);

    // Fake loading (replace with real fetch if needed)
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    // Handle responsive perView
    useEffect(() => {
        const updatePerView = () => {
            if (window.innerWidth < 640) setPerView(1);
            else if (window.innerWidth < 1024) setPerView(2);
            else setPerView(3);
        };
        updatePerView();
        window.addEventListener("resize", updatePerView);
        return () => window.removeEventListener("resize", updatePerView);
    }, []);

    // Measure container width safely
    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const total = testimonials.length;
    const maxIndex = Math.max(0, total - perView);

    // Auto slide (1 by 1)
    useEffect(() => {
        if (loading) return;
        const id = setInterval(() => {
            setIndex((i) => (i >= maxIndex ? 0 : i + 1));
        }, AUTO_SLIDE_MS);
        return () => clearInterval(id);
    }, [loading, maxIndex]);

    const cardWidth = perView > 0 ? containerWidth / perView : 0;
    const x = -index * cardWidth;

    return (
        <section className="bg-white py-20 dark:bg-[#0B0f19]">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="text-center text-3xl md:text-5xl font-bold text-foreground">
                    Loved by modern teams
                </h2>
                <p className="mt-3 text-center text-muted-foreground">
                    Real feedback from developers, managers, and product teams
                </p>

                <div className="relative mt-12 overflow-hidden" ref={containerRef}>
                    {loading ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {/* 1st skeleton: always visible */}
                            <SkeletonCard />

                            {/* 2nd skeleton: hidden on mobile, visible from sm */}
                            <div className="hidden sm:block">
                                <SkeletonCard />
                            </div>

                            {/* 3rd skeleton: hidden until lg */}
                            <div className="hidden lg:block">
                                <SkeletonCard />
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            className="flex"
                            animate={{ x }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            drag="x"
                            dragConstraints={{
                                left: -maxIndex * cardWidth,
                                right: 0,
                            }}
                            dragElastic={0.1} // reduces crazy dragging on mobile
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -60 && index < maxIndex) {
                                    setIndex((i) => i + 1); // next (1 by 1)
                                } else if (info.offset.x > 60 && index > 0) {
                                    setIndex((i) => i - 1); // prev (1 by 1)
                                }
                            }}
                        >
                            {testimonials.map((t, i) => (
                                <div
                                    key={`${t.name}-${i}`}
                                    className="shrink-0 px-3"
                                    style={{ width: `${100 / perView}%` }}
                                >
                                    <TestimonialCard t={t} />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Dots */}
                {!loading && (
                    <div className="mt-8 flex justify-center gap-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`h-2.5 w-2.5 rounded-full transition ${i === index
                                    ? "bg-secondary"
                                    : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
