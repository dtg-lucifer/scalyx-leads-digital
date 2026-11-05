import fs from "node:fs";
import path from "node:path";
import { SCALYX_LOGO_BASE64 } from "@/lib/branding";

export { SCALYX_LOGO_BASE64, SCALYX_LOGO_DATA_URI, SCALYX_LOGO_CID } from "@/lib/branding";

export function getScalyxLogoBuffer(): Buffer {
  try {
    const assetPath = path.join(
      process.cwd(),
      "public",
      "assets",
      "scalyx_dark.png",
    );
    if (fs.existsSync(assetPath)) {
      return fs.readFileSync(assetPath);
    }
  } catch {
    // fallback to embedded base64
  }
  return Buffer.from(SCALYX_LOGO_BASE64, "base64");
}
