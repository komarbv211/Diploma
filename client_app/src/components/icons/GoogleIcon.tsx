import React from 'react';

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.5a4.7 4.7 0 01-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.43z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.96-.9 6.61-2.44l-3.3-2.56c-.92.62-2.1.99-3.31.99-2.54 0-4.7-1.72-5.47-4.03H1.1v2.53A10 10 0 0010 20z" fill="#34A853"/>
      <path d="M4.53 12.96A5.99 5.99 0 014.1 10c0-.96.17-1.89.43-2.96V4.51H1.1A10 10 0 000 10c0 1.64.39 3.19 1.1 4.49l3.43-2.53z" fill="#FBBC05"/>
      <path d="M10 3.96c1.47 0 2.78.51 3.81 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 001.1 4.51l3.43 2.53C5.3 5.68 7.46 3.96 10 3.96z" fill="#EA4335"/>
    </g>
  </svg>
);

export default GoogleIcon; 