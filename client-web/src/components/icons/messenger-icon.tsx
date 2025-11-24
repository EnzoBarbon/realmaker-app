interface MessengerIconProps {
  className?: string;
}

export function MessengerIcon({ className = "h-6 w-6" }: MessengerIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
      <path d="M8 13l3 -2l2 2l3 -2" />
    </svg>
  );
}
