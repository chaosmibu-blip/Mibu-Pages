import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  price: number;
  period: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  highlighted = false,
  disabled = false,
  onSelect,
}: PricingCardProps) {
  return (
    <Card
      className={`p-8 flex flex-col transition-transform duration-200 hover-elevate cursor-pointer hover:scale-[1.02] ${
        highlighted
          ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-105 relative z-10 hover:scale-[1.07]"
          : ""
      }`}
      data-testid={`card-pricing-${title.toLowerCase()}`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            推薦
          </span>
        </div>
      )}

      <h3
        className={`text-2xl font-bold ${highlighted ? "" : "text-foreground"}`}
        data-testid={`text-plan-title-${title.toLowerCase()}`}
      >
        {title}
      </h3>

      <div className="mt-4">
        <span
          className="text-4xl font-bold"
          data-testid={`text-plan-price-${title.toLowerCase()}`}
        >
          NT${price}
        </span>
        <span className={highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
          {period}
        </span>
      </div>

      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check
              className={`w-5 h-5 flex-shrink-0 ${
                highlighted ? "text-primary-foreground" : "text-green-500"
              }`}
            />
            <span className={highlighted ? "" : "text-foreground"}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSelect}
        disabled={disabled}
        variant={highlighted ? "secondary" : "default"}
        className={`w-full mt-8 ${
          highlighted
            ? "bg-white text-primary hover:bg-white/90"
            : ""
        }`}
        data-testid={`button-select-${title.toLowerCase()}`}
      >
        {buttonText}
      </Button>
    </Card>
  );
}
