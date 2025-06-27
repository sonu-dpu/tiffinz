import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
}

function Input({
  className,
  type,
  label,
  errorMessage = "",
  ...props
}: InputProps) {
  const id = React.useId();

  const inputClassNames = cn(
    // Base input styles
    "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
    "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",

    // File input styles
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",

    // Focus and accessibility
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

    // Disabled styles
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

    // Error state
    errorMessage && "border-red-500",

    // Custom className
    className
  );

  const inputElement = (
    <input
      type={type}
      id={id}
      data-slot="input"
      className={inputClassNames}
      {...props}
    />
  );

  return label ? (
    <div className="space-y-1 w-full">
      <label
        htmlFor={id}
        className={cn("block text-sm font-medium", errorMessage && "text-red-600")}
      >
        {label}
      </label>
      {inputElement}
      {errorMessage && (
        <span className="text-red-600 text-sm">{errorMessage}</span>
      )}
    </div>
  ) : (
    inputElement
  );
}

export { Input };
