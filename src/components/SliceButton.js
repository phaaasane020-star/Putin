import Link from "next/link";

// variant: flame | light | dark | wa | ocean      size: sm | md | lg
export default function SliceButton({ href, external, variant = "flame", size = "md", type, className = "", children, ...rest }) {
  const cls = `slice slice-${variant} ${size === "md" ? "" : `slice-${size}`} ${className}`.trim();
  const inner = <span className="slice-text">{children}</span>;
  if (!href) return <button type={type || "button"} className={cls} {...rest}>{inner}</button>;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>{inner}</a>;
  return <Link href={href} className={cls} {...rest}>{inner}</Link>;
}
