import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface SmartSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export default function SmartSearchInput({ placeholder, value, onChange, suggestions }: SmartSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const matches = suggestions.filter((s) =>
        s.toLowerCase().startsWith(value.toLowerCase())
      );
      setFiltered(matches);
      setOpen(matches.length > 0);
    } else {
      setFiltered(suggestions);
      setOpen(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { if (value.length > 0 && filtered.length > 0) setOpen(true); else if (value.length === 0) { setFiltered(suggestions); setOpen(true); } }}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card rounded-xl shadow-card-hover border border-border overflow-hidden max-h-48 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => { onChange(item); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <MapPin className="h-3.5 w-3.5 text-secondary" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
