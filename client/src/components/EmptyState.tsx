import { Search, MapPin } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No Advertisement Found",
  description = "We're sorry what you were looking for, please try another way",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-48 h-48 mb-6">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
          <circle cx="70" cy="90" r="30" fill="#B078C4" opacity="0.2" />
          <path
            d="M60 110 Q 70 140, 90 130 T 120 120"
            stroke="#B078C4"
            strokeWidth="3"
            fill="none"
          />
          <rect x="80" y="60" width="60" height="80" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="2" />
          <line x1="90" y1="80" x2="130" y2="80" stroke="#e5e7eb" strokeWidth="2" />
          <line x1="90" y1="95" x2="120" y2="95" stroke="#e5e7eb" strokeWidth="2" />
          <line x1="90" y1="110" x2="110" y2="110" stroke="#e5e7eb" strokeWidth="2" />
          <circle cx="145" cy="50" r="15" fill="#B078C4" />
          <text x="145" y="55" textAnchor="middle" fill="white" fontSize="14">?</text>
          <circle cx="50" cy="130" r="12" fill="#60a5fa" />
          <g transform="translate(44, 124)">
            <circle cx="6" cy="6" r="4" fill="none" stroke="white" strokeWidth="1.5" />
            <line x1="9" y1="9" x2="12" y2="12" stroke="white" strokeWidth="1.5" />
          </g>
          <g transform="translate(120, 145)">
            <circle cx="15" cy="15" r="12" fill="#fbbf24" />
            <circle cx="15" cy="15" r="3" fill="none" stroke="white" strokeWidth="1.5" />
            <line x1="15" y1="20" x2="15" y2="27" stroke="white" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-primary mb-2" data-testid="text-empty-title">
        {title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md" data-testid="text-empty-description">
        {description}
      </p>
    </div>
  );
}
