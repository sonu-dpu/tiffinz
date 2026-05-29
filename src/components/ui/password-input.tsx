import * as React from "react";
import { EyeClosed, LucideEye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
}

function PasswordInput({
  className,
  label,
  errorMessage = "",
  ref,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const id = React.useId();

  const inputClassNames = cn(
    // Base input styles
    "flex h-9 w-full min-w-0 rounded-md border bg-transparent pl-3 pr-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
    "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",

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

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const inputElement = (
    <div className="relative w-full">
      <div className="w-full flex">
        <input
        type={showPassword ? "text" : "password"}
        id={id}
        ref={ref}
        data-slot="input"
        className={inputClassNames}
        {...props}
      />
      <Button
        variant={"outline"}
        type="button"
        onClick={togglePasswordVisibility}
        // className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeClosed className="h-4 w-4" aria-hidden="true" />
        ) : (
          <LucideEye className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
      </div>
      {errorMessage && (
        <span className="text-red-600 text-sm mt-1 block">{errorMessage}</span>
      )}
    </div>
  );

  return label ? (
    <div className="space-y-1 w-full">
      <label
        htmlFor={id}
        className={cn("block text-sm font-medium text-left", errorMessage && "text-red-600")}
      >
        {label}
      </label>
      {inputElement}
    </div>
  ) : (
    inputElement
  );
}

export { PasswordInput };
