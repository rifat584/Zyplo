"use client";

import MainContainer from "@/components/container/MainContainer";
import Marquee from "react-fast-marquee";

const partners = [
  { name: "GitHub", url: "https://cdn.simpleicons.org/github" },
  { name: "Vercel", url: "https://cdn.simpleicons.org/vercel" },
  { name: "Supabase", url: "https://cdn.simpleicons.org/supabase" },
  { name: "MongoDB", url: "https://cdn.simpleicons.org/mongodb" },
  { name: "React", url: "https://cdn.simpleicons.org/react" },
  { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs" },
  { name: "Docker", url: "https://cdn.simpleicons.org/docker" },
  { name: "Figma", url: "https://cdn.simpleicons.org/figma" },
];

const PartnerMarquee = () => {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <MainContainer className="px-6">
        <h3 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Our Partners
        </h3>

        <Marquee speed={40} gradient={false} autoFill pauseOnHover>
          <ul className="flex items-center gap-12 px-8">
            {partners.map((partner) => (
              <li key={partner.name} className="shrink-0">
                <img
                  src={partner.url}
                  alt={partner.name}
                  className="size-10 sm:size-12"
                />
              </li>
            ))}
          </ul>
        </Marquee>
      </MainContainer>
    </section>
  );
};

export default PartnerMarquee;
