"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export function RatingInput({ value, onChange, disabled }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={cn(
            "transition-colors",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && onChange(rating)}
          onMouseEnter={() => !disabled && setHoverRating(rating)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          disabled={disabled}
        >
          <Star
            className={cn(
              "w-6 h-6",
              (hoverRating || value) >= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}