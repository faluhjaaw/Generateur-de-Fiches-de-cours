interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Main circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />

      {/* Document/Sheet icon */}
      <rect x="25" y="20" width="50" height="60" rx="4" fill="white" opacity="0.9" />

      {/* Lines representing text on the sheet */}
      <line x1="32" y1="30" x2="68" y2="30" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="38" x2="68" y2="38" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="46" x2="55" y2="46" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />

      {/* Checkmark or education symbol */}
      <circle cx="50" cy="60" r="10" fill="#2563eb" />
      <path
        d="M 46 60 L 49 63 L 54 57"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="w-10 h-10" />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900 leading-tight">
          FichePro
        </span>
        <span className="text-xs text-gray-500 leading-tight">
          Générateur de Fiches
        </span>
      </div>
    </div>
  );
}
