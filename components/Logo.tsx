export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="#1C2340" />
      <path
        d="M24 35s-9.5-6.1-12.4-12.2C9.7 18.6 11.6 14 16 14c2.7 0 4.6 1.6 5.8 3.4C22.9 15.6 24.9 14 27.6 14c4.4 0 6.3 4.6 4.4 8.8C29.1 28.9 24 35 24 35Z"
        fill="#D4AC0D"
      />
    </svg>
  )
}
