import React from 'react';

interface AethosLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { full: { width: 120, height: 40 }, icon: 32 },
  md: { full: { width: 180, height: 60 }, icon: 48 },
  lg: { full: { width: 240, height: 80 }, icon: 64 },
  xl: { full: { width: 300, height: 100 }, icon: 80 },
} as const;

const GlowPulse = ({ animated }: { animated: boolean }) =>
  animated ? (
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
  ) : null;

export const AethosLogo: React.FC<AethosLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  animated = true,
}) => {
  if (variant === 'icon') {
    const iconSize = sizes[size].icon;

    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label="Aethos Work"
      >
        <path
          d="M 25,5 L 42,20 L 25,45 L 8,20 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.6"
        />
        <path d="M 25,5 L 25,45" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <path d="M 8,20 L 42,20" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <path d="M 8,20 L 25,45" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M 42,20 L 25,45" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M 25,5 L 42,20 L 25,20 Z" fill="currentColor" opacity="0.3" />
        <path d="M 25,5 L 8,20 L 25,20 Z" fill="currentColor" opacity="0.2" />
        <circle cx="25" cy="25" r="5" fill="currentColor" opacity="0.8">
          <GlowPulse animated={animated} />
        </circle>
      </svg>
    );
  }

  if (variant === 'wordmark') {
    return (
      <svg
        width={sizes[size].full.width}
        height={sizes[size].full.height}
        viewBox="0 0 160 50"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label="Aethos Work"
      >
        <text
          x="5"
          y="28"
          fontFamily="Inter, -apple-system, sans-serif"
          fontSize="26"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="3"
        >
          AETHOS
        </text>
        <line x1="5" y1="35" x2="125" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <text
          x="5"
          y="45"
          fontFamily="Inter, -apple-system, sans-serif"
          fontSize="9"
          fontWeight="300"
          fill="currentColor"
          letterSpacing="5"
          opacity="0.8"
        >
          W O R K
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={sizes[size].full.width}
      height={sizes[size].full.height}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aethos Work"
    >
      <g transform="translate(10, 10)">
        <path
          d="M 20,5 L 32,15 L 20,35 L 8,15 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
        />
        <path d="M 20,5 L 20,35" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <path d="M 8,15 L 32,15" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <path d="M 8,15 L 20,35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M 32,15 L 20,35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M 20,5 L 32,15 L 20,15 Z" fill="currentColor" opacity="0.3" />
        <path d="M 20,5 L 8,15 L 20,15 Z" fill="currentColor" opacity="0.2" />
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.8">
          <GlowPulse animated={animated} />
        </circle>
      </g>

      <text
        x="55"
        y="28"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="1.5"
      >
        AETHOS
      </text>
      <text
        x="55"
        y="42"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="300"
        fill="currentColor"
        letterSpacing="3.5"
        opacity="0.8"
      >
        WORK
      </text>
    </svg>
  );
};
