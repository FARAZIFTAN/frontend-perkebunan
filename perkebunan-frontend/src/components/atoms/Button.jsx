import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ 
  text, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon,
  loading = false,
  iconPosition = 'left'
}) => {

  // Kelas tombol dengan dinamis
  const buttonClasses = `
    btn
    btn-${variant}
    btn-${size}
    ${fullWidth ? 'btn-full-width' : ''}
    ${loading ? 'btn-loading' : ''}
  `.trim();

  return (
    <button
      onClick={onClick}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner">⏳</span>}
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon">{icon}</span>
      )}
      {!loading && text}
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.element,
  loading: PropTypes.bool,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default Button;
