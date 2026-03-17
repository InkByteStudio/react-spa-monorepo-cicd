import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: ReactNode;
}

export function Badge({ variant = "default", children, className, ...props }: BadgeProps) {
  const classNames = [styles.badge, styles[variant], className].filter(Boolean).join(" ");

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
}
