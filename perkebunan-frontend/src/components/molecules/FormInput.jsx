import React from 'react';
import PropTypes from 'prop-types';
import './FormInput.css';

const FormInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  name,
  required = false,
  error,
  disabled = false,
  className = '',
  checked = false,
  rows = 3,
  options = [],
  icon = null
}) => {
  
  // Handle input changes
  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    if (type === 'number' && inputValue !== '') {
      inputValue = parseInt(inputValue);
      if (isNaN(inputValue)) {
        inputValue = '';
      }
    }

    if (type === 'checkbox') {
      inputValue = e.target.checked;
    }

    if (type === 'radio') {
      inputValue = e.target.value;
    }

    onChange({ target: { name: name, value: inputValue } });
  };

  // Render the appropriate input icon
  const renderInputIcon = () => {
    if (icon) return icon;
    
    // Default icons based on input type
    const iconsByType = {
      text: <span>✏️</span>,
      email: <span>✉️</span>,
      password: <span>🔒</span>,
      number: <span>🔢</span>,
      date: <span>📅</span>,
      tel: <span>📞</span>
    };
    
    return iconsByType[type] || null;
  };

  return (
    <div className={`form-group ${className} ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      {/* Text, Email, Password, Number, Date, Tel inputs */}
      {['text', 'email', 'password', 'number', 'date', 'tel'].includes(type) && (
        <div className={icon || renderInputIcon() ? 'input-with-icon' : ''}>
          {(icon || renderInputIcon()) && (
            <div className="input-icon">
              {icon || renderInputIcon()}
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            name={name}
            required={required}
            disabled={disabled}
            className={`form-input ${error ? 'input-error' : ''}`}
          />
        </div>
      )}

      {/* Checkbox input */}
      {type === 'checkbox' && (
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleInputChange}
            name={name}
            required={required}
            disabled={disabled}
            className={`form-checkbox ${error ? 'input-error' : ''}`}
            id={`checkbox-${name}`}
          />
          <label htmlFor={`checkbox-${name}`} className="checkbox-label">
            {placeholder}
          </label>
        </div>
      )}

      {/* Radio input group */}
      {type === 'radio' && options.length > 0 && (
        <div className="form-radio-group">
          {options.map((option, index) => (
            <label key={index} className="form-radio">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleInputChange}
                disabled={disabled}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}

      {/* Textarea input */}
      {type === 'textarea' && (
        <textarea
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          name={name}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`form-textarea ${error ? 'input-error' : ''}`}
        />
      )}

      {/* Error message with animation */}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'date', 'checkbox', 'radio', 'textarea']),
  name: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  checked: PropTypes.bool,
  rows: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })),
  icon: PropTypes.element
};

export default FormInput;