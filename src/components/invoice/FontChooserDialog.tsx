"use client";

import React, { useEffect } from "react";
import { FontType } from "@/types/invoice";
import { Check, X, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FontOption {
  id: FontType;
  name: string;
  className: string;
  description: string;
  sample: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    id: "poppins",
    name: "Poppins",
    className: "font-sans",
    description: "Geometric & Modern — Signature typography used on scalyx.in",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
  },
  {
    id: "roboto",
    name: "Roboto",
    className: "font-sans",
    description: "Clean & Professional — High legibility neo-grotesque standard",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
  },
  {
    id: "systemfont",
    name: "System Font",
    className: "font-mono",
    description: "Native & Neutral — Default system UI typography (SF Pro / Segoe UI / Monospace)",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
  },
];

interface FontChooserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFont: FontType;
  onSelectFont: (font: FontType) => void;
}

export default function FontChooserDialog({
  isOpen,
  onClose,
  selectedFont,
  onSelectFont,
}: FontChooserDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl md:max-w-2xl bg-card border border-border rounded-none shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-none bg-primary/10 text-primary border border-primary/20">
              <Type className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Choose Invoice Typography</h3>
              <p className="text-xs text-muted-foreground">
                Select a font to customize both the preview and exported A4 PDF.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-none hover:bg-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Font List */}
        <div className="p-6 space-y-3">
          {FONT_OPTIONS.map((option) => {
            const isSelected = selectedFont === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSelectFont(option.id);
                }}
                className={`w-full text-left p-4 rounded-none border transition-all relative flex flex-col gap-2 ${
                  isSelected
                    ? "bg-accent/40 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/50 hover:bg-accent/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-sm font-semibold text-foreground ${option.className}`}>
                      {option.name}
                    </span>
                    {option.id === "poppins" && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-none">
                        Scalyx Default
                      </span>
                    )}
                  </div>
                  <div
                    className={`size-5 rounded-none flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-transparent"
                    }`}
                  >
                    <Check className="size-3" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">{option.description}</p>

                <div
                  className={`mt-1 p-2.5 rounded-none bg-muted/40 border border-border text-xs text-foreground tracking-wide ${option.className}`}
                >
                  <p className="font-semibold text-xs">
                    INVOICE #INV-2026-001 • Total: ₹85,000.00
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{option.sample}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/20 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Active font: <strong className="text-foreground capitalize">{selectedFont}</strong>
          </span>
          <Button onClick={onClose} size="sm">
            Apply & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
