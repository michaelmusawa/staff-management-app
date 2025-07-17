// app/components/ui/spinner.tsx
"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A simple CSS-based spinner.
 *
 * @param size  One of 'sm' (16px), 'md' (24px), or 'lg' (32px). Default is 'md'.
 * @param className  Additional class names to apply.
 */
export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  // Map size prop to tailwind width/height
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }[size];

  return (
    <div
      className={`
        ${sizeClasses} 
        border-2 
        border-t-transparent 
        border-gray-500 
        rounded-full 
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}
