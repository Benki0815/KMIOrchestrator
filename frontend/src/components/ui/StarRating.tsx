"use client";

import { Star } from "lucide-react";

export function StarRating({
  value,
  onChange,
  size = 14,
}: {
  value: number | null | undefined;
  onChange?: (value: number) => void;
  size?: number;
}) {
  const current = value ?? 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(i === current ? 0 : i);
          }}
          title={`${i} Stern${i > 1 ? "e" : ""}`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            width={size}
            height={size}
            fill={i <= current ? "#ffb84d" : "none"}
            color={i <= current ? "#ffb84d" : "#5a5f66"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
