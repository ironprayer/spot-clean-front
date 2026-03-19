"use client";

interface OpacitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function OpacitySlider({ value, onChange }: OpacitySliderProps) {
  return (
    <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-md w-44">
      <svg
        className="w-4 h-4 text-gray-500 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3" strokeWidth="2" />
        <path
          strokeWidth="2"
          strokeLinecap="round"
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        />
      </svg>
      <input
        type="range"
        min={0.1}
        max={0.9}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 accent-green-500"
      />
    </div>
  );
}
