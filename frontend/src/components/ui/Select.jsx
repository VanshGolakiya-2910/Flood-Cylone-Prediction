import React from 'react';
import { cn } from '../../utils/cn';

const Select = React.forwardRef(({ 
  label, 
  error, 
  className, 
  options = [],
  placeholder = 'Select an option',
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
      <select
        ref={ref}
        className={cn(
          'input-field',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
