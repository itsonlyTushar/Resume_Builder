// Shared text-layout helpers for the jsPDF templates

// Adds https:// to links typed without a protocol so they stay clickable
export const toHref = (url) =>
  /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`;

// Splits a description into bullet points: one per line or per "•" item.
// Leading "-" / "*" markers are dropped since the templates draw their own.
export const splitBullets = (text = "") =>
  text
    .split(/\r?\n|•/)
    .map((line) => line.replace(/^\s*[-*–]\s+/, "").trim())
    .filter(Boolean);

// Joins items with `separator` into lines no wider than maxWidth, breaking
// between items rather than inside them. Measures with the doc's current font.
export const wrapItems = (doc, items, separator, maxWidth) => {
  const lines = [];
  items.forEach((item) => {
    const last = lines[lines.length - 1];
    if (last !== undefined && doc.getTextWidth(last + separator + item) <= maxWidth) {
      lines[lines.length - 1] = last + separator + item;
    } else {
      lines.push(item);
    }
  });
  // an item too wide for a line on its own still has to be broken
  return lines.flatMap((line) => doc.splitTextToSize(line, maxWidth));
};

/**
 * Draws `left` wrapped so it never runs into `right` (e.g. a date), which sits
 * flush right on the first line. Each side sets its own font and colour through
 * setLeftFont / setRightFont. Returns the number of lines `left` took.
 */
export const drawLeftRight = (
  doc,
  { left, right, x, rightX, y, lineHeight, setLeftFont, setRightFont, gap = 4 },
) => {
  let rightWidth = 0;
  if (right) {
    setRightFont();
    rightWidth = doc.getTextWidth(right) + gap;
  }
  setLeftFont();
  const lines = left ? doc.splitTextToSize(left, rightX - x - rightWidth) : [];
  lines.forEach((line, i) => doc.text(line, x, y + i * lineHeight));
  if (right) {
    setRightFont();
    doc.text(right, rightX, y, { align: "right" });
  }
  return Math.max(lines.length, 1);
};
