import {Link} from '@remix-run/react';
import React, {useEffect, useState} from 'react';
import {Spinner} from './Spinner';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary';
  type: 'button' | 'submit';
  size: 'sm' | 'md';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  type,
  loading,
  variant,
  onClick,
  to,
  size = 'md',
  fullWidth = false,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (loading === false && onClick !== undefined && isClicked) {
      onClick();
      setIsClicked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleClick = () => {
    if (onClick !== undefined && loading === undefined) {
      onClick();
    }
    setIsClicked(true);
  };

  const variantClassName =
    variant === 'primary'
      ? 'bg-[#ff5a5f] text-white'
      : 'text-black border border-black bg-opacity-0';

  const sizeClassNames = `${size === 'sm' ? 'px-2' : 'py-2 px-4'}`;

  const className = `${sizeClassNames} bg-[#ff5a5f] rounded-md hover:transform hover:scale-105 duration-100 ${variantClassName}`;

  const lableWithSpinner = loading ? (
    <>
      {label} {<Spinner />}
    </>
  ) : (
    label
  );

  return (
    <>
      {to ? (
        <Link className={`${fullWidth ? 'w-full' : ''}`} to={to}>
          <button
            className={className}
            type={type}
            disabled={disabled}
            onClick={handleClick}
          >
            <div className="flex justify-center items-center gap-2">
              {lableWithSpinner}
            </div>
          </button>
        </Link>
      ) : (
        <button
          className={`${className} ${fullWidth ? 'w-full' : ''}`}
          type={type}
          disabled={disabled}
          onClick={handleClick}
        >
          <div className="flex justify-center items-center gap-2">
            {lableWithSpinner}
          </div>
        </button>
      )}
    </>
  );
};

export default Button;
