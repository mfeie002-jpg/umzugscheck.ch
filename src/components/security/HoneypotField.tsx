import React from 'react';

interface HoneypotFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Invisible honeypot field to catch bots.
 * Real users won't see or fill this field.
 * Bots that auto-fill all fields will be caught.
 */
export const HoneypotField: React.FC<HoneypotFieldProps> = ({ name, value, onChange }) => {
  return (
    <div 
      aria-hidden="true" 
      style={{ 
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        opacity: 0,
        height: 0,
        width: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <label htmlFor={name}>Leave this field empty</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};
