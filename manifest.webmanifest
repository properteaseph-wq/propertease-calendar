function svgDataURI(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const STYLE_PACKS = {
  editorial: {
    name: "Modern Editorial",
    cues: [
      "contemporary editorial poster layout",
      "Swiss-inspired grid, generous whitespace, strong hierarchy",
      "bold headline, subhead, 3–5 bullets, footer bar",
      "high-contrast typography, clean alignment",
      "subtle grain texture, premium magazine look"
    ]
  },
  clean3d: {
    name: "Clean 3D UI",
    cues: [
      "clean 3D UI illustration, soft shadows, smooth materials",
      "rounded cards, minimal icons, modern tech aesthetic",
      "clear hierarchy, large readable type",
      "premium app-store style visual, crisp lighting"
    ]
  },
  luxMinimal: {
    name: "Luxury Minimal",
    cues: [
      "luxury minimal layout, muted tones, elegant spacing",
      "premium typography, small accents, refined composition",
      "editorial feel, understated but expensive",
      "no clutter, no noisy decorations"
    ]
  },
  boldInfographic: {
    name: "Bold Infographic",
    cues: [
      "bold infographic poster, strong shapes and panels",
      "clear visual sections, icons and callouts",
      "punchy yet professional, high readability",
      "controlled density, strong hierarchy"
    ]
  }
};

export function thumbs() {
  // Small category thumbnails as SVG (no extra files needed)
  return {
    "Buyer Tips": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2b66ff"/><stop offset="1" stop-color="#ff50b4"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(#g)"/><path d="M34 78h52" stroke="white" stroke-width="10" stroke-linecap="round"/><path d="M34 52h38" stroke="white" stroke-width="10" stroke-linecap="round"/><circle cx="86" cy="52" r="8" fill="white"/></svg>`),
    "Loan and Financing": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#1b2742"/><path d="M28 76h64" stroke="#2b66ff" stroke-width="12" stroke-linecap="round"/><path d="M44 50h48" stroke="#ff50b4" stroke-width="12" stroke-linecap="round"/><path d="M32 44l20-18 20 18" fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`),
    "Market Insight": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#11182a"/><path d="M30 78V54" stroke="#2b66ff" stroke-width="12" stroke-linecap="round"/><path d="M54 78V42" stroke="#ff50b4" stroke-width="12" stroke-linecap="round"/><path d="M78 78V60" stroke="#ffd24a" stroke-width="12" stroke-linecap="round"/><path d="M28 86h64" stroke="white" stroke-opacity=".7" stroke-width="8" stroke-linecap="round"/></svg>`),
    "Scams to Avoid": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#2a1420"/><path d="M60 22l40 70H20l40-70z" fill="#ff50b4"/><path d="M60 44v22" stroke="white" stroke-width="10" stroke-linecap="round"/><circle cx="60" cy="76" r="6" fill="white"/></svg>`),
    "Condo Living": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#0f1a2c"/><rect x="32" y="28" width="56" height="66" rx="10" fill="#2b66ff"/><path d="M42 42h10M42 58h10M42 74h10M68 42h10M68 58h10M68 74h10" stroke="white" stroke-width="8" stroke-linecap="round"/></svg>`),
    "OFW Guide": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#15243f"/><path d="M30 70c18-30 42-30 60 0" fill="none" stroke="#ffd24a" stroke-width="10" stroke-linecap="round"/><path d="M40 78h40" stroke="#ff50b4" stroke-width="10" stroke-linecap="round"/><circle cx="60" cy="44" r="14" fill="#2b66ff"/></svg>`),
    "Investing Basics": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#121c33"/><path d="M34 80l18-18 12 12 22-28" fill="none" stroke="#2b66ff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="48" r="10" fill="#ff50b4"/></svg>`),
    "FAQs": svgDataURI(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="28" fill="#1b2742"/><path d="M44 54c0-10 8-18 18-18s18 8 18 18c0 14-18 12-18 26" fill="none" stroke="#2b66ff" stroke-width="10" stroke-linecap="round"/><circle cx="62" cy="90" r="6" fill="#ff50b4"/></svg>`)
  };
}

export function generateNanoPrompt({ idea, category, stylePack, allowProject }) {
  const pack = STYLE_PACKS[stylePack] || STYLE_PACKS.editorial;
  const cues = pack.cues.join(", ");

  const lines = [
    "DETAILED NANO IMAGE PROMPT (4:5)",
    "",
    "Goal: Create a premium, modern educational real estate visual that positions the brand as an authority.",
    "No salesy tone. No cheesy templates. Clean and high-end.",
    "",
    `Category: ${category || "Education"}`,
    `Style Pack: ${pack.name}`,
    "",
    `Visual Direction: ${cues}.`,
    "Composition: strong headline at top, then 3–5 bullets, then a short takeaway line, then a discreet footer for logo/brand.",
    "Typography: modern sans-serif, clear hierarchy, high contrast, generous spacing, crisp alignment.",
    "Background: subtle gradients or soft texture, not noisy. High readability is priority.",
    "Branding: small logo placement bottom-left or bottom-right. Keep it tasteful.",
    "",
    allowProject
      ? "Project mention: allowed ONLY if it naturally supports the lesson and remains subtle."
      : "Project mention: OFF by default. Do NOT mention projects unless explicitly required.",
    "",
    `Content to visualize (use exactly): ${idea?.trim() || "Write an educational real estate tip with clear bullets."}`,
    "",
    "NEGATIVE: dated templates, random clipart, messy layout, low contrast text, generic stock look, too many fonts, loud patterns."
  ];

  return lines.join("\n");
}
