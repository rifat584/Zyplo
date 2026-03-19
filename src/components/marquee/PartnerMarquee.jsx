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

const rowTwoPartners = [
  { name: "GitLab", url: "/partners/gitlab.svg" },
  { name: "Notion", url: "/partners/notion.svg" },
  { name: "Linear", url: "/partners/linear.svg" },
  { name: "Sentry", url: "/partners/sentry.svg" },
  { name: "Netlify", url: "/partners/netlify.svg" },
  { name: "Atlassian", url: "/partners/atlassian.svg" },
  { name: "Postman", url: "/partners/postman.svg" },
  { name: "Trello", url: "/partners/trello.svg" },
  { name: "Cloudflare", url: "/partners/cloudflare.svg" },
  { name: "Bitbucket", url: "/partners/bitbucket.svg" },
];

const darkModeWhiteLogos = new Set([
  "GitHub",
  "Next.js",
  "Notion",
  "Linear",
  "Sentry",
  "Vercel",
]);

const PartnerLogo = ({ partner, subtle = false }) => (
  <div
    className={[
      "flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-zinc-200/70 bg-card/80 p-2.5 sm:h-16 sm:w-24 sm:p-3",
      "dark:border-border dark:bg-[#0F1629]/80",
      subtle ? "opacity-85" : "",
    ].join(" ")}
  >
    <Image
      src={partner.url}
      alt={partner.name}
      width={54}
      height={54}
      className={[
        subtle ? "h-8 sm:h-9" : "h-9 sm:h-10",
        "w-auto object-contain",
        darkModeWhiteLogos.has(partner.name)
          ? "dark:filter-[brightness(0)_invert(1)]"
          : "",
      ].join(" ")}
    />
  </div>
);

const PartnerMarquee = () => {
  return (
    <section className="bg-background">
      <MainContainer className="px-6 py-14 sm:py-16">
        <h3 className="mb-8 text-center text-3xl font-semibold text-foreground dark:text-gray-100 sm:text-5xl">
          Our Partners
        </h3>

        <div
          className="
            relative overflow-hidden rounded-2xl  bg-zinc-50/70 py-5
             dark:bg-[#111A2E]/60
          "
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
          aria-label="Partner logos"
        >
          <Marquee speed={42} autoFill pauseOnHover gradient={false}>
            <div className="flex items-center gap-8 px-4 sm:gap-12 sm:px-6">
              {partners.map((partner) => (
                <PartnerLogo key={`top-${partner.name}`} partner={partner} />
              ))}
            </div>
          </Marquee>

          <div className="mt-3">
            <Marquee speed={28} autoFill pauseOnHover gradient={false} direction="right">
              <div className="flex items-center gap-8 px-4 sm:gap-12 sm:px-6">
                {rowTwoPartners.map((partner) => (
                  <PartnerLogo key={`bottom-${partner.name}`} partner={partner} subtle />
                ))}
              </div>
            </Marquee>
          </div>
        </div>
      </MainContainer>
    </section>
  );
};

export default PartnerMarquee;
