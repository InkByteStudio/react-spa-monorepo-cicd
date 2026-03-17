import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleAs?: ElementType;
  footer?: ReactNode;
  children: ReactNode;
}

export function Card({
  title,
  titleAs: TitleTag = "h3",
  footer,
  children,
  className,
  ...props
}: CardProps) {
  const classNames = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={classNames} {...props}>
      {title && (
        <div className={styles.header}>
          <TitleTag className={styles.title}>{title}</TitleTag>
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
