"use client";

import React, { useState, useRef } from "react";
import { InvoiceData, InvoiceItem, SCALYX_DEFAULTS, INITIAL_INVOICE_DATA } from "@/types/invoice";
import {
  Plus,
  Trash2,
  Download,
  Printer,
  Type,
  Building2,
  User,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (newData: InvoiceData) => void;
  onOpenFontDialog: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
}

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "AED", symbol: "AED", label: "AED (AED) - UAE Dirham" },
];

export default function InvoiceForm({
  data,
  onChange,
  onOpenFontDialog,
  onDownloadPdf,
  isDownloading,
}: InvoiceFormProps) {
  const [itemInput, setItemInput] = useState("");
  const [costInput, setCostInput] = useState("");
  const [inputError, setInputError] = useState("");
  const itemInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState<"client" | "meta" | "company">("client");

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedItem = itemInput.trim();
    const parsedCost = parseFloat(costInput);

    if (!trimmedItem) {
      setInputError("Please enter an item description");
      itemInputRef.current?.focus();
      return;
    }

    if (isNaN(parsedCost) || parsedCost <= 0) {
      setInputError("Please enter a valid cost greater than 0");
      return;
    }

    setInputError("");

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: trimmedItem,
      cost: parsedCost,
    };

    onChange({
      ...data,
      items: [...data.items, newItem],
    });

    setItemInput("");
    setCostInput("");
    itemInputRef.current?.focus();
  };

  const handleRemoveItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const found = CURRENCIES.find((c) => c.code === currencyCode);
    if (found) {
      onChange({
        ...data,
        currency: found.code,
        currencySymbol: found.symbol,
      });
    }
  };

  const handleResetToSample = () => {
    onChange({
      ...INITIAL_INVOICE_DATA,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    });
  };

  const handleClearItems = () => {
    onChange({
      ...data,
      items: [],
    });
  };

  const subtotal = data.items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
  const taxAmount = (subtotal * (Number(data.taxRate) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const formatExactCurrency = (val: number) => {
    if (val === undefined || val === null || isNaN(val)) return `${data.currencySymbol} 0.00`;
    const strVal = val.toString();
    const parts = strVal.split(".");
    const intFormatted = Number(parts[0]).toLocaleString("en-IN");
    if (parts.length > 1) {
      const decimals = parts[1].length === 1 ? parts[1] + "0" : parts[1];
      return `${data.currencySymbol} ${intFormatted}.${decimals}`;
    }
    return `${data.currencySymbol} ${intFormatted}.00`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border border-border rounded-none shadow-xs">
        <div className="flex items-center gap-2">
          {/* Font Dialog Trigger */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenFontDialog}
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <Type className="size-3.5 text-primary" />
            <span>Font:</span>
            <Badge variant="secondary" className="capitalize text-[11px] px-1.5 py-0">
              {data.font}
            </Badge>
          </Button>

          {/* Sample Data Reset */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetToSample}
            title="Load sample invoice data"
            className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            <span>Sample</span>
          </Button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <Printer className="size-3.5" />
            <span>Print</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="h-9 gap-2 text-xs font-semibold"
          >
            {isDownloading ? (
              <>
                <div className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-none animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                <span>Download A4 PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2 Inputs for Item and Cost + Button to Add Record */}
      <div className="p-6 bg-card border border-border rounded-none shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-primary/10 text-primary border border-primary/20">
              <Plus className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Add Item to Invoice</h2>
              <p className="text-xs text-muted-foreground">Enter item description and cost</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px]">
            Quick Line Item
          </Badge>
        </div>

        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Input 1: Item */}
            <div className="sm:col-span-2">
              <label
                htmlFor="item-name"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Item Name / Description <span className="text-destructive">*</span>
              </label>
              <Input
                ref={itemInputRef}
                id="item-name"
                type="text"
                placeholder="e.g. Next.js SaaS Web Application Development"
                value={itemInput}
                onChange={(e) => {
                  setItemInput(e.target.value);
                  if (inputError) setInputError("");
                }}
              />
            </div>

            {/* Input 2: Cost */}
            <div>
              <label
                htmlFor="item-cost"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Cost ({data.currencySymbol}) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                  {data.currencySymbol}
                </span>
                <Input
                  id="item-cost"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="25000"
                  value={costInput}
                  onChange={(e) => {
                    setCostInput(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  className="pl-7 font-mono"
                />
              </div>
            </div>
          </div>

          {inputError && (
            <p className="text-xs text-destructive font-medium">{inputError}</p>
          )}

          {/* Add Record Button */}
          <Button type="submit" className="w-full h-10 gap-2 text-xs font-semibold">
            <Plus className="size-4" />
            <span>Add Record to Invoice</span>
          </Button>
        </form>
      </div>

      {/* Item Records Table & Live Total */}
      <div className="p-6 bg-card border border-border rounded-none shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Invoice Records ({data.items.length})
          </h3>
          {data.items.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearItems}
              className="text-xs text-destructive hover:text-destructive h-7 px-2"
            >
              Clear all
            </Button>
          )}
        </div>

        {data.items.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-border rounded-none bg-muted/20">
            <p className="text-xs text-muted-foreground">
              No items in the invoice yet. Enter an item and cost above to add your first record!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {data.items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-none bg-muted/30 border border-border hover:bg-muted/50 transition-all text-xs"
              >
                <div className="flex items-center gap-3 max-w-[65%]">
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {item.description}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-foreground">
                    {formatExactCurrency(Number(item.cost))}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Total Calculation Summary */}
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Amount Due
          </span>
          <div className="text-right">
            <span className="text-xl font-mono font-black text-foreground">
              {formatExactCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion / Tabbed Settings: Client, Invoice Meta, Company Details */}
      <div className="p-6 bg-card border border-border rounded-none shadow-xs space-y-4">
        <div className="flex border-b border-border gap-1 pb-2">
          <Button
            type="button"
            variant={activeSection === "client" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("client")}
            className="text-xs h-8 gap-1.5"
          >
            <User className="size-3.5" />
            Client Details
          </Button>

          <Button
            type="button"
            variant={activeSection === "meta" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("meta")}
            className="text-xs h-8 gap-1.5"
          >
            <FileText className="size-3.5" />
            Invoice & Tax
          </Button>

          <Button
            type="button"
            variant={activeSection === "company" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("company")}
            className="text-xs h-8 gap-1.5"
          >
            <Building2 className="size-3.5" />
            Company (Scalyx)
          </Button>
        </div>

        {/* Client Details Section */}
        {activeSection === "client" && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Client / Company Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Acme Corporation"
                value={data.client.name}
                onChange={(e) =>
                  onChange({
                    ...data,
                    client: { ...data.client, name: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Client Email
                </label>
                <Input
                  type="email"
                  placeholder="billing@acmecorp.com"
                  value={data.client.email}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      client: { ...data.client, email: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Client Phone
                </label>
                <Input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={data.client.phone || ""}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      client: { ...data.client, phone: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Client Address
              </label>
              <Textarea
                rows={2}
                placeholder="Bangalore, Karnataka, India"
                value={data.client.address || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    client: { ...data.client, address: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Invoice Metadata Section */}
        {activeSection === "meta" && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Invoice Number
                </label>
                <Input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => onChange({ ...data, invoiceNumber: e.target.value })}
                  className="font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Issue Date
                </label>
                <Input
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => onChange({ ...data, issueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Currency
                </label>
                <select
                  value={data.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full h-9 px-3 py-1 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-card text-foreground">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Tax / GST Rate (%)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={data.taxRate}
                    onChange={(e) =>
                      onChange({ ...data, taxRate: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Payment Details / Instructions
              </label>
              <Input
                type="text"
                value={data.paymentDetails}
                onChange={(e) => onChange({ ...data, paymentDetails: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Notes & Terms
              </label>
              <Textarea
                rows={2}
                value={data.notes}
                onChange={(e) => onChange({ ...data, notes: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Company Section (Scalyx) */}
        {activeSection === "company" && (
          <div className="space-y-3.5">
            <div className="p-3 bg-muted/40 border border-border rounded-none text-xs text-foreground flex items-center justify-between">
              <span>Defaults configured for <strong>https://scalyx.in</strong></span>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => onChange({ ...data, company: SCALYX_DEFAULTS })}
                className="text-[11px] h-auto p-0"
              >
                Reset to Scalyx
              </Button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Company Name
              </label>
              <Input
                type="text"
                value={data.company.name}
                onChange={(e) =>
                  onChange({
                    ...data,
                    company: { ...data.company, name: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Website Link
                </label>
                <Input
                  type="text"
                  value={data.company.website}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      company: { ...data.company, website: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Support Phone / WhatsApp
                </label>
                <Input
                  type="text"
                  value={data.company.phone}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      company: { ...data.company, phone: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Company Tagline / Subtitle
              </label>
              <Input
                type="text"
                value={data.company.tagline}
                onChange={(e) =>
                  onChange({
                    ...data,
                    company: { ...data.company, tagline: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
