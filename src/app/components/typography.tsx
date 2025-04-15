"use client";

import React, { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: TypographyProps) {
  return <h1 className={`heading-1 ${className}`}>{children}</h1>;
}

export function H2({ children, className = "" }: TypographyProps) {
  return <h2 className={`heading-2 ${className}`}>{children}</h2>;
}

export function H3({ children, className = "" }: TypographyProps) {
  return <h3 className={`heading-3 ${className}`}>{children}</h3>;
}

interface TextProps extends TypographyProps {
  muted?: boolean;
  error?: boolean;
  success?: boolean;
  size?: "small" | "regular" | "large";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
}

export function Text({
  children,
  className = "",
  muted = false,
  error = false,
  success = false,
  size = "regular",
  weight = "normal",
  align = "left",
}: TextProps) {
  let textClass = "text-regular";

  if (size === "small") textClass += " text-sm";
  if (size === "large") textClass += " text-lg";

  if (weight === "light") textClass += " font-light";
  if (weight === "medium") textClass += " font-medium";
  if (weight === "semibold") textClass += " font-semibold";
  if (weight === "bold") textClass += " font-bold";

  if (align === "center") textClass += " text-center";
  if (align === "right") textClass += " text-right";

  if (muted) textClass += " text-muted";
  if (error) textClass += " text-error";
  if (success) textClass += " text-success";

  return <p className={`px-8 ${textClass} ${className}`}>{children}</p>;
}

interface LinkProps extends TypographyProps {
  href: string;
  external?: boolean;
}

export function TextLink({ children, className = "", href, external = false }: LinkProps) {
  return (
    <a
      href={href}
      className={`text-link ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
