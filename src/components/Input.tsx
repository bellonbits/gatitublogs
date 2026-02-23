import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-colors font-mono text-sm",
            error && "border-deep-red focus:border-deep-red focus:ring-deep-red",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-deep-red font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
