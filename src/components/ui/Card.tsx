import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm",
        hover && "transition-all hover:shadow-md hover:bg-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
