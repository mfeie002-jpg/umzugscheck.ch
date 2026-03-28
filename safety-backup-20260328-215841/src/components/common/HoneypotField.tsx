import { cn } from "@/lib/utils";

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

/**
 * Honeypot anti-bot field
 * This field is hidden from users but visible to bots.
 * If a bot fills it in, the form submission will be rejected.
 */
export const HoneypotField = ({ 
  value, 
  onChange, 
  name = "website_url" 
}: HoneypotFieldProps) => {
  return (
    <div 
      className={cn(
        "absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden",
        "pointer-events-none"
      )}
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor={name}>
        Do not fill this field
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
};

export default HoneypotField;
