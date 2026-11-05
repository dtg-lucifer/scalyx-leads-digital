/**
 * Contract Security & Password Protection Engine
 * Generates self-decrypting, AES-256-GCM encrypted standalone contract documents
 * and encrypted PDF downloads.
 */

import { SCALYX_LOGO_DATA_URI } from "@/lib/branding";
import { generateContractPdf } from "./pdf";
import { ContractBlock } from "./types";

/**
 * Generates a self-decrypting standalone HTML file protected by AES-GCM 256-bit encryption.
 * Recipient can open it in ANY browser (offline / mobile / desktop) and unlock it with the chosen password.
 */
export async function createPasswordProtectedHtml(
  contractHtml: string,
  password: string,
  meta: {
    referenceNo: string;
    clientName: string;
    contractTitle: string;
  },
): Promise<string> {
  // Use Web Crypto API
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive AES key using PBKDF2
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  const encryptedContent = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    aesKey,
    encoder.encode(contractHtml),
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encryptedHex = Array.from(new Uint8Array(encryptedContent))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.contractTitle} — ${meta.referenceNo} (Confidential)</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .lock-container {
      margin: auto;
      width: 100%;
      max-width: 440px;
      padding: 36px 32px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      text-align: center;
    }
    .lock-logo {
      height: 40px;
      width: auto;
      margin-bottom: 20px;
    }
    .lock-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 8px;
      background: #f1f5f9;
      color: #475569;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .lock-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .lock-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .input-group {
      margin-bottom: 16px;
      text-align: left;
    }
    .input-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }
    .input-field {
      width: 100%;
      height: 40px;
      padding: 8px 12px;
      font-size: 13px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.15s;
    }
    .input-field:focus {
      border-color: #0f172a;
      box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
    }
    .unlock-btn {
      width: 100%;
      height: 40px;
      background: #0f172a;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .unlock-btn:hover { background: #1e293b; }
    .error-msg {
      margin-top: 12px;
      font-size: 11.5px;
      color: #e11d48;
      display: none;
    }
    .lock-footer {
      margin-top: 24px;
      font-size: 10.5px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }
    #contract-viewport {
      display: none;
      width: 100%;
      min-height: 100vh;
    }
    .unlocked-actions-bar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #e2e8f0;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      padding: 6px 16px;
      background: #0f172a;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .unlocked-actions-bar { display: none !important; }
      body { background: #ffffff !important; }
    }
  </style>
</head>
<body>
  <div id="lock-screen" style="display: flex; min-height: 100vh;">
    <div class="lock-container">
      <img src="${SCALYX_LOGO_DATA_URI}" alt="Scalyx Logo" class="lock-logo" />
      <div><span class="lock-badge">CONFIDENTIAL AGREEMENT</span></div>
      <h1 class="lock-title">${meta.contractTitle}</h1>
      <p class="lock-desc">
        Ref: <strong>${meta.referenceNo}</strong> &bull; Prepared for <strong>${meta.clientName}</strong>.<br/>
        This agreement is encrypted with 256-bit AES. Enter your security password to view and execute.
      </p>

      <form id="unlock-form" onsubmit="handleUnlock(event)">
        <div class="input-group">
          <label class="input-label" for="password">Document Access Password</label>
          <input type="password" id="password" class="input-field" placeholder="Enter password..." required autofocus />
        </div>
        <button type="submit" id="submit-btn" class="unlock-btn">Unlock &amp; View Contract</button>
        <div id="error-msg" class="error-msg">Incorrect password. Please verify and try again.</div>
      </form>

      <div class="lock-footer">
        Secured by Scalyx Cryptographic Verification System
      </div>
    </div>
  </div>

  <div id="contract-viewport">
    <div class="unlocked-actions-bar">
      <div style="font-size: 12px; font-weight: 600; color: #0f172a;">
        ${meta.contractTitle} &bull; <span style="color: #64748b;">${meta.referenceNo}</span>
      </div>
      <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
    </div>
    <div id="contract-content"></div>
  </div>

  <script>
    const SALT_HEX = "${saltHex}";
    const IV_HEX = "${ivHex}";
    const ENCRYPTED_HEX = "${encryptedHex}";

    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      return bytes;
    }

    async function handleUnlock(e) {
      e.preventDefault();
      const passwordInput = document.getElementById("password").value;
      const errorMsg = document.getElementById("error-msg");
      const submitBtn = document.getElementById("submit-btn");

      submitBtn.disabled = true;
      submitBtn.innerText = "Decrypting...";
      errorMsg.style.display = "none";

      try {
        const encoder = new TextEncoder();
        const salt = hexToBytes(SALT_HEX);
        const iv = hexToBytes(IV_HEX);
        const ciphertext = hexToBytes(ENCRYPTED_HEX);

        const passwordKey = await crypto.subtle.importKey(
          "raw",
          encoder.encode(passwordInput),
          { name: "PBKDF2" },
          false,
          ["deriveKey"]
        );

        const aesKey = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256",
          },
          passwordKey,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
          aesKey,
          ciphertext
        );

        const decoder = new TextDecoder();
        const decryptedHtml = decoder.decode(decrypted);

        // Hide lock screen and display decrypted contract
        document.getElementById("lock-screen").style.display = "none";
        const viewport = document.getElementById("contract-viewport");
        viewport.style.display = "block";
        
        // Inject content safely into an isolated iframe to preserve all exact styles
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.border = "none";
        iframe.style.display = "block";
        document.getElementById("contract-content").appendChild(iframe);
        iframe.srcdoc = decryptedHtml;

        iframe.onload = () => {
          try {
            const h = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = (h + 80) + "px";
          } catch(e) {}
        };
      } catch (err) {
        errorMsg.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.innerText = "Unlock & View Contract";
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Downloads a password-protected PDF using proper jsPDF 128-bit encryption.
 * Generates real encrypted vector PDF without using browser print.
 */
export async function downloadPasswordProtectedPdf(
  blocks: ContractBlock[],
  password: string,
  filename: string = "Contract-Agreement-Confidential.pdf",
  contractTitle?: string,
): Promise<void> {
  const doc = generateContractPdf(blocks, {
    password,
    filename,
    contractTitle,
  });
  doc.save(filename);
}

/**
 * Downloads an unencrypted native PDF using vector layout.
 */
export async function downloadCleanPdf(
  blocks: ContractBlock[],
  filename: string = "Contract-Agreement.pdf",
  contractTitle?: string,
): Promise<void> {
  const doc = generateContractPdf(blocks, {
    filename,
    contractTitle,
  });
  doc.save(filename);
}

