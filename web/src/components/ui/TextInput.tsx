import { tv } from "tailwind-variants";
import { IconAlertTriangle } from "@tabler/icons-react";

const textInput = tv({
  base: "flex flex-col gap-2"
});

const textInputLabel = tv({
  base: "typography-xs",
  variants: {
    default: {
      true: "text-gray-500",
    },
    active: {
      true: "text-blue",
    },
    error: {
      true: "text-danger",
    },
  },
  defaultVariants: {
    default: true,
    active: false,
    error: false,
  }
});

const textInputField = tv({
  base: "w-full border rounded-lg p-4 typography-md placeholder:color-gray-400 h-12 text-gray-600 focus:border-[1.5px]",
  variants: {
    default: {
      true: "border-gray-300 outline-none focus:border-blue",
    },
    error: {
      true: "border-danger outline-none focus:border-danger"
    },
  },
  defaultVariants: {
    default: true,
    error: false,
  }
});

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string,
  name: string,
  default?: boolean,
  active?: boolean,
  error?: string,
  prefix?: string,
}


export function TextInput({ id, className, label, error, prefix, style, ...props }: TextInputProps) {
   const paddingWhenPrefix = prefix ? `${prefix.length}ch` : undefined

  return (
    <div className={textInput({ className })}>
      {label && <label htmlFor={id} className={textInputLabel({ error: Boolean(error) })}>{label}</label>}
      <div className="relative w-full">
        {prefix && (
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 typography-md text-gray-400"
          >
            {prefix}
          </span>
        )}
        <input
          type="text" 
          id={id} 
          className={textInputField({ error: Boolean(error) })} 
          style={{
            ...style,
            paddingLeft: prefix
              ? `calc(${paddingWhenPrefix} + 0.5rem)`
              : undefined,
          }}
          {...props} />
      </div>
      {error && <p className="typography-sm text-gray-500 flex items-center gap-1"><IconAlertTriangle size={16} className="text-danger" />{error}</p>}
    </div>
  )
}