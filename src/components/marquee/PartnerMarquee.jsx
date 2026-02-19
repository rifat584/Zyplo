"use client";

import MainContainer from "@/components/container/MainContainer";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const partners = [
  { name: "GitHub", url: "/partners/github.svg" },
  { name: "Vercel", url: "/partners/vercel.svg" },
  { name: "Supabase", url: "/partners/supabase.svg" },
  { name: "MongoDB", url: "/partners/mongodb.svg" },
  { name: "React", url: "/partners/react.svg" },
  { name: "Next.js", url: "/partners/nextjs.svg" },
  { name: "Docker", url: "/partners/docker.svg" },
  { name: "Figma", url: "/partners/figma.svg" },
  { name: "Google", url: "/partners/google.svg" },
  { name: "Stripe", url: "/partners/stripe.svg" },
];

const PartnerMarquee = () => {
  return (
    <section>
      <MainContainer className="px-6 py-12">
        <h3 className="mb-12 text-center text-4xl font-bold text-foreground">
          Our Partners
        </h3>

        <Marquee
          speed={40}
          gradient={true}
          autoFill
          pauseOnHover
          gradientWidth={80}
        >
          <ul className="flex items-center gap-16 px-8">
            {partners.map((partner) => (
              <li key={partner.name} className="shrink-0">
                <Image
                  src={partner.url}
                  alt={partner.name}
                  height={70}
                  width={70}
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
