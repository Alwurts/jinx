import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export type PricingCardProps = {
  name: string;
  price: number;
  features: string[];
};

export default function PricingCard({
  name = "Basic",
  price = 10,
  features = ["Feature 1", "Feature 2", "Feature 3"],
}: PricingCardProps) {
  return (
    <Card className="w-full max-w-sm relative border-primary shadow-lg  flex flex-col justify-between">
      <div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold">${price}</span>
            </div>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Link
          href="/contact"
          className="w-full
        "
        >
          <Button className="w-full font-semibold" variant="default">
            Subscribe Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
