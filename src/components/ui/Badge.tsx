import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-700": variant === "default",
          "bg-primary/10 text-primary": variant === "primary",
          "bg-secondary/10 text-secondary": variant === "secondary",
          "bg-accent/20 text-amber-800": variant === "accent",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
