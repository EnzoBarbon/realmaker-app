export function UKFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#012169"/>
      <path d="M0 0L36 24M36 0L0 24" stroke="white" strokeWidth="4"/>
      <path d="M0 0L36 24M36 0L0 24" stroke="#C8102E" strokeWidth="2.5"/>
      <path d="M18 0V24M0 12H36" stroke="white" strokeWidth="8"/>
      <path d="M18 0V24M0 12H36" stroke="#C8102E" strokeWidth="5"/>
    </svg>
  );
}
