'use client';

import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { sanitizeInlineHtml } from '@/lib/blogs';

interface RichTextProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

// A lightweight contentEditable rich-text field supporting bold / italic /
// underline. Formatting is applied with document.execCommand (well supported
// for these inline styles) and the HTML is sanitized to a small allow-list on
// every change so only <b>/<i>/<u>/<br> survive.
export default function RichText({
  value,
  onChange,
  placeholder,
  className = '',
  ariaLabel,
}: RichTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [empty, setEmpty] = useState(!value);

  // Seed the editor once; afterwards it is uncontrolled to preserve the caret.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
      setEmpty(!value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    if (!ref.current) return;
    const clean = sanitizeInlineHtml(ref.current.innerHTML);
    setEmpty(!clean);
    onChange(clean);
  };

  const format = (command: 'bold' | 'italic' | 'underline') => {
    ref.current?.focus();
    document.execCommand(command, false);
    emit();
  };

  return (
    <div
      className={`rounded-md border transition-colors ${
        focused ? 'border-[#DCC898]' : 'border-gray-300'
      } ${className}`}
    >
      <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1.5">
        <ToolbarButton label="Bold" onClick={() => format('bold')}>
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => format('italic')}>
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton label="Underline" onClick={() => format('underline')}>
          <Underline size={14} />
        </ToolbarButton>
      </div>

      <div className="relative">
        {empty && placeholder && (
          <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-gray-400">
            {placeholder}
          </span>
        )}
        <div
          ref={ref}
          role="textbox"
          aria-label={ariaLabel || placeholder}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={() => {
            setFocused(false);
            emit();
          }}
          onFocus={() => setFocused(true)}
          className="min-h-[44px] px-3 py-2.5 text-sm text-[#1a1a1a] leading-relaxed focus:outline-none [&_b]:font-semibold [&_i]:italic [&_u]:underline"
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // Prevent the editor from losing focus/selection before the command runs.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-[#1a1a1a] transition-colors"
    >
      {children}
    </button>
  );
}
