// components/ui/card.tsx
export function Card({ children }: { children: React.ReactNode }) {
    return <div className="rounded-xl bg-white shadow border border-gray-300 p-4">{children}</div>;
  }
  
  export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
  }
  