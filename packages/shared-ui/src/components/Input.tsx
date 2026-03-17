import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const reactId = useId();
    const inputId = id || reactId;
    const inputClasses = [styles.input, error && styles.error, className].filter(Boolean).join(" ");

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={inputClasses} aria-invalid={!!error} {...props} />
        {error && (
          <span className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
