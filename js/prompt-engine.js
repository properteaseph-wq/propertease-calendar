export function generateNanoPrompt({ idea, category, stylePack, allowProject }) {
  const base = [
    "Create a premium social media visual for a real estate educational post.",
    "Tone: authoritative, clear, modern, non-salesy.",
    `Category: ${category || "Education"}.`,
    `Style pack: ${stylePack}.`,
    allowProject ? "Project mention allowed if it strengthens the lesson." : "Do not mention projects unless explicitly required.",
    "Composition: modern editorial layout, strong hierarchy, clean spacing, readable typography.",
    "Include: headline, 3 to 5 concise bullets, small footer for branding.",
    "Format: 4:5 ratio, high resolution.",
    "Negative: clutter, dated templates, cheesy gradients, low contrast, generic stock look."
  ];
  if (idea?.trim()) base.push(`Content idea: ${idea.trim()}`);
  return base.join("\n");
}
