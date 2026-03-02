"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

type ExportPage = "journey" | "cx_report" | "playbook" | "dashboard";

interface ExportPdfButtonProps {
  page: ExportPage;
  /** Optional document title shown in browser print dialog */
  title?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ExportPdfButton({
  page,
  title,
  variant = "outline",
  size = "sm",
  className,
}: ExportPdfButtonProps) {
  function handleExport() {
    if (title) {
      document.title = title;
    }

    track("pdf_exported", { page });
    window.print();
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      className={className}
      data-print-hide
    >
      <Download className="w-4 h-4 mr-1.5" />
      Export PDF
    </Button>
  );
}
