"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import MainContainer from "@/components/container/MainContainer";
import testimonials from "@/lib/testimonials.json";

const AUTO_SLIDE_MS = 4500;

function TestimonialCard({ testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-border/70 bg-card/72 p-6 shadow-sm backdrop-blur-sm">
      <span className="inline-flex w-fit rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
        Team feedback
      </span>

      <p className="mt-5 text-sm leading-7 text-foreground">
        “{testimonial.quote}”
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/80 text-sm font-semibold text-foreground">
          {testimonial.avatar || testimonial.name?.[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

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

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [maxIndex]);

  const cardWidth = perView > 0 ? containerWidth / perView : 0;
  const x = -index * cardWidth;

  return (
    <section className="bg-background py-20 sm:py-24">
      <MainContainer className="px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-info/20 bg-info/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-info">
            Trusted by product teams
          </span>
          <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            Loved by modern teams
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            Feedback from developers, leads, and product managers using Zyplo to
            keep work visible, accountable, and moving.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden" ref={containerRef}>
          <motion.div
            className="flex"
            animate={{ x }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            drag="x"
            dragConstraints={{ left: -maxIndex * cardWidth, right: 0 }}
            dragElastic={0.06}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 && index < maxIndex) {
                setIndex((i) => i + 1);
              } else if (info.offset.x > 60 && index > 0) {
                setIndex((i) => i - 1);
              }
            }}
          >
            {testimonials.map((testimonial, i) => (
              <div
                key={`${testimonial.name}-${i}`}
                className="shrink-0 px-3"
                style={{ width: `${100 / perView}%` }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-secondary" : "bg-border"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </MainContainer>
    </section>
  );
}
