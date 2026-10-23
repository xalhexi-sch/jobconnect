import React from "react";

export default function JobgioLogo({
  variant = "dark",
  className = "",
  size = "md"
}: {
  variant?: "dark" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const isLight = variant === "light";
  
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Geometric layered cube icon */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full transform transition-transform duration-300 hover:rotate-6"
        >
          {/* Top layer */}
          <path
            d="M12 2L3 6.5L12 11L21 6.5L12 2Z"
            fill={isLight ? "#FFFFFF" : "#111116"}
            className="transition-colors duration-300"
          />
          {/* Middle layer */}
          <path
            d="M3 10.5L12 15L21 10.5M3 14.5L12 19L21 14.5"
            stroke={isLight ? "#FFFFFF" : "#111116"}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
        </svg>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`${textSizes[size]} ${isLight ? "text-white" : "text-[#111116]"} font-bold tracking-tight`}>
          JobConnect
        </span>
        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 uppercase tracking-wider">
          Caraga
        </span>
      </div>
    </div>
  );
}
