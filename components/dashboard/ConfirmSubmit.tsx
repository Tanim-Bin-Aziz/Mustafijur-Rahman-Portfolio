"use client";

import type { ReactNode } from "react";

export default function ConfirmSubmit({
  message,
  className,
  children,
  title,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  title?: string;
}) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
