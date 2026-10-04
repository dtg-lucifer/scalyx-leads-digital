"use client";

import { ExternalLink, Globe, Mail, Phone, ShieldCheck } from "lucide-react";
import { forwardRef } from "react";
import { InvoiceData } from "@/types/invoice";

interface InvoicePreviewProps {
  data: InvoiceData;
  scale?: number;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data, scale = 1 }, ref) => {
    const subtotal = data.items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
    const taxAmount = (subtotal * (Number(data.taxRate) || 0)) / 100;
    const total = subtotal + taxAmount;

    const fontClass =
      data.font === "roboto"
        ? "font-sans"
        : data.font === "poppins"
        ? "font-sans"
        : "font-mono";

    const formatCurrency = (val: number) => {
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
      <div
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
        }}
        className="invoice-scale-wrapper transition-transform duration-150"
      >
        <div
          ref={ref}
          id="invoice-document"
          className={`a4-sheet bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between p-[18mm] ${fontClass}`}
          style={{
            width: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box",
          }}
        >
          {/* Top Decorative Header Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

          <div>
            {/* Header Section */}
            <div className="flex justify-between items-start pb-8 border-b border-slate-200">
              {/* Company Info */}
              <div className="max-w-[60%]">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative size-12 rounded-none overflow-hidden shadow-xs shrink-0 bg-transparent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.company.logoUrl || "/assets/scalyx_light.png"}
                      alt={data.company.name}
                      className="w-full h-full object-contain rounded-none"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                      {data.company.name}
                    </h1>
                    <a
                      href={data.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-1"
                    >
                      <Globe className="size-3" />
                      {data.company.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="size-2.5 opacity-70" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mt-1">
                  {data.company.tagline}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3 text-slate-400" />
                    {data.company.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3 text-slate-400" />
                    {data.company.phone}
                  </span>
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-none bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
                  Tax Invoice
                </div>
                <h2 className="text-2xl font-mono font-bold tracking-tight text-slate-900">
                  {data.invoiceNumber || "INV-0000"}
                </h2>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-end gap-3 text-slate-500">
                    <span>Issue Date:</span>
                    <span className="font-semibold text-slate-800">
                      {data.issueDate ? new Date(data.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3 text-slate-500">
                    <span>Due Date:</span>
                    <span className="font-semibold text-slate-800">
                      {data.dueDate ? new Date(data.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To & Payment Info */}
            <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Billed To
                </p>
                <h3 className="text-base font-bold text-slate-900">
                  {data.client.name || "Client Name"}
                </h3>
                {data.client.email && (
                  <p className="text-xs text-slate-600 mt-1">{data.client.email}</p>
                )}
                {data.client.phone && (
                  <p className="text-xs text-slate-600">{data.client.phone}</p>
                )}
                {data.client.address && (
                  <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">
                    {data.client.address}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Payment Destination
                </p>
                <p className="text-xs font-semibold text-slate-800">
                  {data.company.name}
                </p>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  {data.paymentDetails || "Contact for bank transfer / UPI"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-none border border-emerald-200">
                  <ShieldCheck className="size-3.5" />
                  Verified Vendor: scalyx.in
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-3">Item Description</th>
                    <th className="py-3 px-3 text-right w-44">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {data.items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                        No items added yet. Add an item from the left panel.
                      </td>
                    </tr>
                  ) : (
                    data.items.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-800">
                          {item.description || "Unnamed item"}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {formatCurrency(Number(item.cost) || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="border-t-2 border-slate-200 text-xs">
                  <tr>
                    <td colSpan={2} className="py-2 px-3 text-right font-medium text-slate-500">
                      Subtotal
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-medium text-slate-800">
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>

                  {data.taxRate > 0 && (
                    <tr>
                      <td colSpan={2} className="py-1.5 px-3 text-right font-medium text-slate-500">
                        Tax / GST ({data.taxRate}%)
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-medium text-slate-800">
                        {formatCurrency(taxAmount)}
                      </td>
                    </tr>
                  )}

                  <tr className="border-t-2 border-slate-900 bg-slate-50/80">
                    <td colSpan={2} className="py-3 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-900">
                      Total Due
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-base font-bold text-blue-600">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bottom Section: Notes, Signature, and Footer */}
          <div className="pt-8 mt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-8 items-end mb-8">
              {/* Notes */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Terms & Notes
                </p>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm whitespace-pre-line">
                  {data.notes || "All amounts are in specified currency. Please clear payment by the due date."}
                </p>
              </div>

              {/* Signature / Authorization */}
              <div className="flex flex-col items-end">
                <div className="w-48 text-center">
                  <div className="h-12 flex items-center justify-center">
                    <span className="font-serif italic text-lg font-bold text-slate-800 tracking-wider">
                      Scalyx
                    </span>
                  </div>
                  <div className="border-t border-slate-400/80 pt-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Authorized Signatory
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">https://scalyx.in</p>
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>
                Generated via LeadsDigital • Scalyx •{" "}
                <a
                  href="https://scalyx.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  scalyx.in
                </a>
              </span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";
