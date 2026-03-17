import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Alert.module.css";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  children: ReactNode;
}

export function Alert({ variant = "info", children, className, ...props }: AlertProps) {
  const classNames = [styles.alert, styles[variant], className].filter(Boolean).join(" ");

  return (
    <div className={classNames} role="alert" {...props}>
      {children}
    </div>
  );
}
