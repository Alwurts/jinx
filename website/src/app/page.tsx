import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CardMemberInfo } from "@/components/members/member-info";
import { Separator } from "@/components/ui/separator";
import LogoText from "@/components/icons/logo-text";
import type { Member } from "@/types/members";
import HeroSection from "@/components/herosection/hero";
import USPSection from "@/components/usp/usp-section";
import PricingCard, {
  PricingCardProps,
} from "@/components/pricing/PricingComponent";
import { packages } from "@/components/pricing/pricingData";

const teamMembers: Member[] = [
  {
    name: "Alejandro Wurts",
    role: "CEO",
    image: "/alwurts_adult.jpg",
    youngImage: "/alwurts_young.jpg",
    coffeeOrder: "Espresso",
    techTool: "v0",
    techToolLink: "https://v0.dev/",
    linkedInLink: "https://www.linkedin.com/in/alejandrowurts/",
    xLink: "https://x.com/alwurts",
  },
  {
    name: "Ilse Löhr",
    role: "PM & CCO",
    image: "/ilse_adult.jpg",
    youngImage: "/ilse_young.jpg",
    coffeeOrder: "Caramel Latte Macchiato",
    techTool: "Tailwind CSS",
    techToolLink: "https://tailwindcss.com/",
    linkedInLink:
      "https://de.linkedin.com/in/ilse-l%C3%B6hr-687b681b8?trk=people-guest_people_search-card",
  },
  {
    name: "Ketjona Lepuri",
    role: "CFO & HoS",
    image: "/ketjona_adult.jpg",
    youngImage: "/ketjona_young.jpg",
    coffeeOrder: "Espresso",
    techTool: "Angular",
    techToolLink: "https://angular.dev/",
    linkedInLink: "https://www.linkedin.com/in/ketjona-lepuri-6bb2a81b7/",
  },
  {
    name: "Xhesika Samarxhiu",
    role: "CMO",
    image: "/xhesika_adult.jpg",
    youngImage: "/xhesika_young.jpg",
    coffeeOrder: "Cappuccino",
    techTool: "React",
    techToolLink: "https://react.dev/",
    linkedInLink: "https://www.linkedin.com/in/xhesika-samarxhiu-23066b1a9/",
  },
  {
    name: "Amirali Shaban Khamseh",
    role: "CTO",
    image: "/amir_adult.jpg",
    youngImage: "/amir_young.jpg",
    coffeeOrder: "Flat White",
    techTool: "React",
    techToolLink: "https://react.dev/",
    linkedInLink: "https://www.linkedin.com/in/amirali-khamseh/",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-4">
      <HeroSection />
      <Separator className="mt-4" />
      <USPSection />
      <Separator className="mt-4" />
      <div className="flex justify-around my-16">
        {packages.map((item) => (
          <PricingCard
            key={item.name}
            features={item.features}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
      <Separator className="mt-4" />
      <div className="mt-24 mb-16 text-center">
        <p className="scroll-m-20 text-lg font-extrabold tracking-tight mb-1.5">
          We make the magic happen
        </p>
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Meet Our Team
        </h1>
      </div>
      <div className="flex flex-col items-start mb-5">
        {teamMembers.map((member) => (
          <CardMemberInfo key={member.name} {...member} />
        ))}
      </div>
    </main>
  );
}
