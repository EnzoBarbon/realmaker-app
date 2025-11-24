export function SpainFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#C8102E"/>
      <rect y="6" width="36" height="12" fill="#FFD700"/>
      <rect width="36" height="6" fill="#C8102E"/>
      <rect y="18" width="36" height="6" fill="#C8102E"/>
    </svg>
  );
}
