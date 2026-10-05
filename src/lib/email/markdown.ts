import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/**
 * Converts Markdown string into email-safe inline HTML with anti-overflow,
 * sharp-corner styles, and tight typography.
 */
export async function markdownToEmailHtml(markdown: string): Promise<string> {
  if (!markdown || !markdown.trim()) return "";

  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  let html = String(file);

  // Inlined styles for HTML email compatibility with sharp corners and anti-overflow constraints
  html = html
    .replace(
      /<p>/g,
      "<p style=\"margin: 0 0 16px 0; color: #334155; font-size: 14.5px; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;\">",
    )
    .replace(
      /<h1>/g,
      "<h1 style=\"margin: 22px 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 800; letter-spacing: -0.6px; line-height: 1.25; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;\">",
    )
    .replace(
      /<h2>/g,
      "<h2 style=\"margin: 20px 0 10px 0; color: #0f172a; font-size: 18px; font-weight: 700; letter-spacing: -0.4px; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;\">",
    )
    .replace(
      /<h3>/g,
      "<h3 style=\"margin: 16px 0 8px 0; color: #0f172a; font-size: 15px; font-weight: 700; line-height: 1.35; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;\">",
    )
    .replace(
      /<ul>/g,
      "<ul style=\"margin: 0 0 16px 0; padding-left: 20px; color: #334155; font-size: 14.5px; line-height: 1.65; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;\">",
    )
    .replace(
      /<ol>/g,
      "<ol style=\"margin: 0 0 16px 0; padding-left: 20px; color: #334155; font-size: 14.5px; line-height: 1.65; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;\">",
    )
    .replace(
      /<li>/g,
      '<li style="margin-bottom: 6px; line-height: 1.6; color: #334155; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">',
    )
    .replace(/<strong>/g, '<strong style="color: #0f172a; font-weight: 700;">')
    .replace(/<em>/g, '<em style="color: #1e293b; font-style: italic;">')
    .replace(
      /<a /g,
      '<a style="color: #2563eb; text-decoration: underline; font-weight: 600; word-break: break-all; overflow-wrap: anywhere;" ',
    )
    .replace(
      /<blockquote>/g,
      '<blockquote style="margin: 16px 0; padding: 10px 16px; border-left: 3px solid #0f172a; background-color: #f8fafc; border-radius: 0px !important; color: #475569; font-style: italic; word-break: break-word; overflow-wrap: anywhere; box-sizing: border-box; max-width: 100%;">',
    )
    .replace(
      /<code>/g,
      '<code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 0px !important; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12.5px; color: #0f172a; border: 1px solid #e2e8f0; word-break: break-all; overflow-wrap: anywhere;">',
    )
    .replace(
      /<pre>/g,
      '<pre style="background-color: #0f172a; color: #f8fafc; padding: 12px 14px; border-radius: 0px !important; overflow-x: auto; margin: 16px 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; white-space: pre-wrap; word-break: break-all; overflow-wrap: anywhere; box-sizing: border-box; max-width: 100%;">',
    )
    .replace(
      /<hr>/g,
      '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">',
    )
    .replace(
      /<table/g,
      '<table style="width: 100%; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 18px 0; font-size: 13.5px; box-sizing: border-box; word-break: break-word; border-radius: 0px !important;"',
    )
    .replace(
      /<th/g,
      '<th style="border: 1px solid #e2e8f0; padding: 8px 10px; background-color: #f8fafc; font-weight: 700; color: #0f172a; text-align: left; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;"',
    )
    .replace(
      /<td/g,
      '<td style="border: 1px solid #e2e8f0; padding: 8px 10px; color: #334155; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;"',
    )
    .replace(
      /<del>/g,
      '<del style="color: #94a3b8; text-decoration: line-through;">',
    );

  // Eliminate trailing/extra bottom space inside quotes:
  // Remove the 16px bottom paragraph margin when inside a blockquote
  html = html.replace(
    /<blockquote([\s\S]*?)<\/blockquote>/g,
    (_fullMatch, bqInner) => {
      // Find the opening blockquote tag and its content
      const closeTagIndex = bqInner.indexOf(">");
      if (closeTagIndex === -1) return _fullMatch;
      const bqAttrs = bqInner.substring(0, closeTagIndex);
      let content = bqInner.substring(closeTagIndex + 1);

      // Clean all paragraph margins and padding inside the quote
      content = content.replace(
        /<p style="margin: 0 0 16px 0;([^"]*)"/g,
        '<p style="margin: 0 !important; padding: 0 !important;$1"',
      );
      content = content.replace(
        /<p>/g,
        '<p style="margin: 0 !important; padding: 0 !important;">',
      );

      return `<blockquote${bqAttrs}>${content}</blockquote>`;
    },
  );

  return html;
}
