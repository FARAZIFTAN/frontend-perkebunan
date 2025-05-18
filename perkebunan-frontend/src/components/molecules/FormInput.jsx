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
  options = []  // Untuk radio dan checkbox
}) => {
  
  // Fungsi menangani perubahan input
  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    // Khusus untuk number, konversi ke integer jika ada nilai
    if (type === 'number' && inputValue !== '') {
      inputValue = parseInt(inputValue);
      if (isNaN(inputValue)) {
        inputValue = '';
      }
    }

    // Khusus untuk checkbox
    if (type === 'checkbox') {
      inputValue = e.target.checked;
    }

    // Khusus untuk radio
    if (type === 'radio') {
      inputValue = e.target.value;
    }

    // Panggil fungsi onChange dengan data yang sudah diproses
    onChange({ target: { name: name, value: inputValue } });
  };

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      {/* Input Tipe Text, Email, Password, Number, Date, Tel */}
      {['text', 'email', 'password', 'number', 'date', 'tel'].includes(type) && (
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
      )}

      {/* Input Tipe Checkbox */}
      {type === 'checkbox' && (
        <input
          type="checkbox"
          checked={checked}
          onChange={handleInputChange}
          name={name}
          required={required}
          disabled={disabled}
          className={`form-checkbox ${error ? 'input-error' : ''}`}
        />
      )}

      {/* Input Tipe Radio */}
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

      {/* Input Tipe Textarea */}
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
  }))
};

export default FormInput;
