import MainContainer from "@/components/container/MainContainer";
import Marquee from "react-fast-marquee";
import React from "react";
import Image from "next/image";

const PartnerMarquee = () => {
  const partners = [
    { name: "GitHub", url: "/partners/github.svg" },
    { name: "Vercel", url: "/partners/vercel.svg" },
    { name: "Supabase", url: "/partners/supabase.svg" },
    { name: "MongoDB", url: "/partners/mongodb.svg" },
    { name: "React", url: "/partners/react.svg" },
    { name: "Next.js", url: "/partners/nextjs.svg" },
    { name: "Docker", url: "/partners/docker.svg" },
    { name: "Figma", url: "/partners/figma.svg" },
  ];

  return (
    <MainContainer className="overflow-hidden py-12 my-6">
      <h3 className="text-4xl font-bold text-center mb-12">Our Partners</h3>

      <Marquee
        speed={40}
        gradient={true}
        gradientWidth={80}
        pauseOnHover
        autoFill
      >
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="mx-8 h-16 w-16 flex items-center justify-center"
          >
            <Image
              src={partner.url}
              alt={partner.name}
              width={80}
              height={80}
              className="object-contain"
              draggable= 'false'
            />
          </div>
        ))}
      </Marquee>
    </MainContainer>
  );
};

export default PartnerMarquee;
