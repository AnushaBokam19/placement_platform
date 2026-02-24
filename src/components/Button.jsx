import React from "react";

export default function Button({ children, variant = "primary", onClick, ...rest }) {
  const className = `btn ${variant === "secondary" ? "secondary" : ""}`;
  return (
    <button className={className} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
