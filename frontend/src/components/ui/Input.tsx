import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: string;
  shortcutTag?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, shortcutTag, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            <span>{label}</span>
            {props.required === false && <span className="form-label-optional">Optional</span>}
          </label>
        )}
        <div className="form-input-wrapper">
          {iconLeft && (
            <span className="material-symbols-outlined form-input-icon-left">{iconLeft}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${iconLeft ? 'has-icon-left' : ''} ${className}`.trim()}
            {...props}
          />
          {shortcutTag && (
            <span className="topbar-kbd-shortcut" style={{ position: 'absolute', right: 8 }}>
              {shortcutTag}
            </span>
          )}
        </div>
        {error && <span className="form-error">{error}</span>}
        {!error && hint && <span className="form-hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
