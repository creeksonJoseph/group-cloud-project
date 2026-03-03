import { useState, useEffect } from "react";

const BinaryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 40" fill="currentColor">
    <text x="10" y="15" fontSize="12" fontFamily="monospace">101</text>
    <text x="10" y="30" fontSize="12" fontFamily="monospace">010</text>
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const HourglassIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
  </svg>
);

interface FloatingSVG {
  id: number;
  x: number;
  y: number;
  delay: number;
  type: 'binary' | 'clock' | 'hourglass';
  size: number;
}

const FloatingSVGs = () => {
  const [svgs, setSvgs] = useState<FloatingSVG[]>([]);

  useEffect(() => {
    const types: ('binary' | 'clock' | 'hourglass')[] = ['binary', 'clock', 'hourglass'];
    const newSvgs = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      type: types[Math.floor(Math.random() * types.length)],
      size: 16 + Math.random() * 8, // 16-24px
    }));
    setSvgs(newSvgs);
  }, []);

  const renderSVG = (svg: FloatingSVG) => {
    const baseClasses = "absolute text-neon-green opacity-10 hover:opacity-30 transition-opacity duration-300";
    
    switch (svg.type) {
      case 'binary':
        return <BinaryIcon className={baseClasses} />;
      case 'clock':
        return <ClockIcon className={baseClasses} />;
      case 'hourglass':
        return <HourglassIcon className={baseClasses} />;
      default:
        return <BinaryIcon className={baseClasses} />;
    }
  };

  return (
    <div className="floating-svgs">
      {svgs.map((svg) => (
        <div
          key={svg.id}
          className="absolute pointer-events-none"
          style={{
            left: `${svg.x}%`,
            top: `${svg.y}%`,
            width: `${svg.size}px`,
            height: `${svg.size}px`,
            animation: `float 10s infinite ease-in-out ${svg.delay}s`,
          }}
        >
          {renderSVG(svg)}
        </div>
      ))}
    </div>
  );
};

export default FloatingSVGs;