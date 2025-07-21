import * as React from "react";

import { cn } from "@/lib/utils";
import "./ui.scss"

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "!mb-2  h-[210px] resize-none w-full rounded-[14px] p-[16px] maintextArea",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };