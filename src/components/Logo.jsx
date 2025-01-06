import React from 'react';

const Logo = ({ width = '200px', className = '' }) => {
  return (
    <img 
      src="/lo.png"
      alt="PrePlay Logo"
      style={{
        width: width,
        height: 'auto'
      }}
      className={className}
    />
  );
};

export default Logo; 