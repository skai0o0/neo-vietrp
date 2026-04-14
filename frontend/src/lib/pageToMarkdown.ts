/**
 * Chuyển nội dung vùng chính của app (thẻ <main>) sang Markdown thô,
 * phù hợp để dán vào prompt AI.
 */

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "PATH",
  "TEMPLATE",
]);

function escapeInline(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\n+/g, " ").trim();
}

function collectInline(el: Element): string {
  let out = "";
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent ?? "";
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const e = child as Element;
      const tag = e.tagName;
      if (SKIP_TAGS.has(tag)) continue;
      if (tag === "BR") {
        out += " ";
        continue;
      }
      if (tag === "STRONG" || tag === "B") {
        const t = escapeInline(collectInline(e));
        if (t) out += `**${t}**`;
        continue;
      }
      if (tag === "EM" || tag === "I") {
        const t = escapeInline(collectInline(e));
        if (t) out += `*${t}*`;
        continue;
      }
      if (tag === "A") {
        const href = e.getAttribute("href") ?? "";
        const t = escapeInline(collectInline(e));
        if (t && href) out += `[${t}](${href})`;
        else if (t) out += t;
        continue;
      }
      if (tag === "CODE") {
        const t = (e.textContent ?? "").replace(/`/g, "\\`");
        if (t) out += `\`${t}\``;
        continue;
      }
      out += collectInline(e);
    }
  }
  return out;
}

function blockFromElement(el: Element, depth = 0): string {
  const tag = el.tagName;
  if (SKIP_TAGS.has(tag)) return "";

  if (tag.match(/^H[1-6]$/)) {
    const level = parseInt(tag[1], 10);
    const hashes = "#".repeat(Math.min(level, 6));
    const text = escapeInline(collectInline(el));
    return text ? `${hashes} ${text}\n\n` : "";
  }

  if (tag === "P") {
    const text = escapeInline(collectInline(el));
    return text ? `${text}\n\n` : "";
  }

  if (tag === "UL") {
    let md = "";
    for (const child of el.children) {
      if (child.tagName === "LI") {
        const line = escapeInline(collectInline(child as Element));
        if (line) md += `- ${line}\n`;
      }
    }
    return md ? `${md}\n` : "";
  }

  if (tag === "OL") {
    let md = "";
    let idx = 0;
    for (const child of el.children) {
      if (child.tagName === "LI") {
        const line = escapeInline(collectInline(child as Element));
        if (line) md += `${idx + 1}. ${line}\n`;
        idx++;
      }
    }
    return md ? `${md}\n` : "";
  }

  if (tag === "LI") {
    return "";
  }

  if (tag === "BLOCKQUOTE") {
    const inner = walkBlocks(el, depth);
    if (!inner.trim()) return "";
    return inner
      .split("\n")
      .map((line) => (line.trim() ? `> ${line}` : ">"))
      .join("\n")
      .concat("\n\n");
  }

  if (tag === "PRE") {
    const code = el.textContent ?? "";
    return code.trim() ? `\`\`\`\n${code.trim()}\n\`\`\`\n\n` : "";
  }

  if (tag === "HR") {
    return "---\n\n";
  }

  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return "";
  }

  if (tag === "BUTTON") {
    const t = escapeInline(el.textContent ?? "");
    return t ? `- [nút] ${t}\n` : "";
  }

  if (tag === "IMG") {
    const alt = el.getAttribute("alt") ?? "";
    const src = el.getAttribute("src") ?? "";
    if (alt || src) return `![${alt}](${src})\n\n`;
    return "";
  }

  return walkBlocks(el, depth);
}

function walkBlocks(root: Element, depth = 0): string {
  if (depth > 40) return "";
  let md = "";

  for (const child of root.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const t = (child.textContent ?? "").trim();
      if (t) md += `${t}\n\n`;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      if (el.getAttribute("aria-hidden") === "true") continue;
      if (SKIP_TAGS.has(el.tagName)) continue;
      md += blockFromElement(el, depth + 1);
    }
  }

  return md;
}

export function mainContentToMarkdown(): string {
  if (typeof window === "undefined") return "";

  const main = document.querySelector("main");
  if (!main) return "";

  const header = [
    "# VietRP — snapshot trang",
    "",
    `- **URL:** ${window.location.href}`,
    `- **Đường dẫn:** ${window.location.pathname}`,
    `- **Thời điểm:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
  ].join("\n");

  const body = walkBlocks(main).replace(/\n{3,}/g, "\n\n").trim();
  return `${header}\n${body}\n`.trim();
}
