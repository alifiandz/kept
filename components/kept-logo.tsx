export function KeptLogo({ className = "" }: { className?: string }) {
  return <img className={`kept-logo-image ${className}`.trim()} src="/kept-logo.png" alt="" aria-hidden="true" />;
}
