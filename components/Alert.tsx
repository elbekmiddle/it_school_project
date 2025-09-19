"use client";

import { cn } from "@/lib/utils";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
}

export default function Alert({ type = "info", message }: AlertProps) {
  const base = "p-4 rounded-lg mb-4 font-medium";
  const styles = {
    success: "bg-green-100 text-green-700 border border-green-300",
    error: "bg-red-100 text-red-700 border border-red-300",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    info: "bg-blue-100 text-blue-700 border border-blue-300",
  };

  return <div className={cn(base, styles[type])}>{message}</div>;
}
