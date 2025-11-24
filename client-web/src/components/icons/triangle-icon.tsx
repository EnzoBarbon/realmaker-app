interface TriangleIconProps {
  className?: string;
}

export function TriangleIcon({ className }: TriangleIconProps) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 240 240" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M221.244 0C237.964 0 244.787 13.3868 236.431 29.7382L135.205 227.75C126.857 244.083 113.145 244.083 104.805 227.75L3.57829 29.7382C-4.80223 13.3868 2.05382 0 18.7578 0H221.244Z" 
        fill="#E7AF2A"
      />
    </svg>
  );
}
