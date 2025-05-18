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

  // Enhanced dynamic button classes
  const buttonClasses = `
    btn
    btn-${variant}
    btn-${size}
    ${fullWidth ? 'btn-full-width' : ''}
    ${loading ? 'btn-loading' : ''}
    ${icon ? 'btn-with-icon' : ''}
  `.trim();

  // Added loading spinner with animation
  const renderLoadingSpinner = () => (
    <span className="btn-spinner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
        <path 
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      </svg>
    </span>
  );

  return (
    <button
      onClick={onClick}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
    >
      {loading && renderLoadingSpinner()}
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon">{icon}</span>
      )}
      <span>{!loading && text}</span>
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