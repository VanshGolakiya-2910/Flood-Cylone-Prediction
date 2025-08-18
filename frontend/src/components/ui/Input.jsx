import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className, 
  type = 'text',
  required = false,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'input-field',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
