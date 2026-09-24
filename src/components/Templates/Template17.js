import jsPDF from "jspdf";
import GelasioRegular from "../../assets/fonts/gelasio/Gelasio-Regular.ttf";
import GelasioBold from "../../assets/fonts/gelasio/Gelasio-Bold.ttf";
import CaladeaRegular from "../../assets/fonts/caladea/Caladea-Regular.ttf";
import { toHref } from "./templateHelpers";

// Developer template. Mirrors the "Full Stack Developer" Word resume: US Letter,
// single column, Georgia-metric serif body (Gelasio), Cambria-metric contact
// line (Caladea) and uppercase section headings over a full-width rule.
//
// Summary, descriptions and certification names accept **double asterisks** to
// bold keywords. Descriptions take one bullet per line.

const BODY_FONT = "Gelasio";
const CONTACT_FONT = "Caladea";

// Measurements in mm, taken from the source document
const MARGIN_X = 12.7; // 0.5in
const MARGIN_Y = 7.6; // 0.3in
const BULLET_X = MARGIN_X + 6.35; // bullet glyph at 0.25in
const BULLET_TEXT_X = MARGIN_X + 12.7; // hanging bullet text at 0.5in
const LINE_GAP = 3.7; // wrapped lines inside a paragraph
const PARA_GAP = 4.4; // between bullets, and from an entry heading to its first bullet
const ENTRY_GAP = 5.1; // last line of an entry -> next entry heading
const SECTION_GAP = 5.0; // last line of a section -> next section heading
const HEADING_GAP = 4.9; // section heading -> first line of the section
const CONTACT_GAP = 5.2; // between wrapped contact lines

const DEFAULT_SECTION_ORDER = [
  "description",
  "skills",
  "experience",
  "projects",
  "education",
];

const hasContent = (str) => typeof str === "string" && str.trim().length > 0;

// "Built **Dine Easy** in React" -> [{ text: "Built " }, { text: "Dine Easy", bold: true }, ...]
const parseBold = (str) => {
  const parts = str.split("**");
  // an unmatched ** stays as literal text
  if (parts.length % 2 === 0) {
    const last = parts.pop();
    parts[parts.length - 1] += `**${last}`;
  }
  return parts
    .map((text, i) => ({ text, bold: i % 2 === 1 }))
    .filter((run) => run.text);
};

// One bullet per line. A single paragraph is split into sentences, but only at
// ". " before a capital, so "React.js" or "$1.2M" stay intact.
const toBullets = (str) => {
  const lines = str
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[•●▪◦‣·]|[-–*](?=\s))\s*/, "").trim())
    .filter(Boolean);
  if (lines.length !== 1) return lines;
  return lines[0].replace(/([.!?])\s+(?=[A-Z0-9(*])/g, "$1\n").split("\n");
};

// Joins neighbouring pieces of the same weight and drops the line's trailing space
const mergePieces = (pieces) => {
  const merged = pieces.reduce((acc, piece) => {
    const last = acc[acc.length - 1];
    if (last && last.bold === piece.bold) last.text += piece.text;
    else acc.push({ ...piece });
    return acc;
  }, []);
  const last = merged[merged.length - 1];
  if (last) last.text = last.text.trimEnd();
  return merged.filter((segment) => segment.text);
};

export const Template17 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  try {
    doc.addFont(GelasioRegular, BODY_FONT, "normal");
    doc.addFont(GelasioBold, BODY_FONT, "bold");
    doc.addFont(CaladeaRegular, CONTACT_FONT, "normal");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const rightX = pageWidth - MARGIN_X;
    const contentWidth = rightX - MARGIN_X;
    const bottomY = pageHeight - MARGIN_Y - 1;

    // Baseline of the last line drawn
    let y = MARGIN_Y;

    const setBody = (bold = false, size = 10) => {
      doc.setFont(BODY_FONT, bold ? "bold" : "normal");
      doc.setFontSize(size);
    };

    // Starts a new page when the next `height` mm would run past the bottom margin
    const ensureSpace = (height) => {
      if (y + height > bottomY) {
        doc.addPage();
        y = MARGIN_Y;
      }
    };

    const advance = (gap) => {
      ensureSpace(gap);
      y += gap;
    };

    const underline = (x, baseline, width) => {
      doc.setLineWidth(0.2);
      doc.line(x, baseline + 0.4, x + width, baseline + 0.4);
    };

    const measure = (text, bold) => {
      setBody(bold);
      return doc.getTextWidth(text);
    };

    // Word-wraps styled runs to maxWidth. Each line is a list of pieces that keep
    // their spaces, so the PDF text layer reads as plain sentences for ATS parsers.
    const wrapRuns = (runs, maxWidth) => {
      const words = [];
      let word = { pieces: [], space: null };
      runs.forEach(({ text, bold }) => {
        text.split(/(\s+)/).forEach((chunk, i) => {
          if (!chunk) return;
          if (i % 2 === 0) {
            word.pieces.push({ text: chunk, bold });
          } else if (word.pieces.length) {
            word.space = { text: " ", bold };
            words.push(word);
            word = { pieces: [], space: null };
          }
        });
      });
      if (word.pieces.length) words.push(word);

      const lines = [];
      let line = [];
      let width = 0;
      const breakLine = () => {
        lines.push(line);
        line = [];
        width = 0;
      };

      words.forEach(({ pieces, space }) => {
        const wordWidth = pieces.reduce((sum, p) => sum + measure(p.text, p.bold), 0);
        if (line.length && width + wordWidth > maxWidth) breakLine();

        if (wordWidth > maxWidth) {
          // unbreakable text such as a long URL: split it between characters
          pieces.forEach(({ text, bold }) => {
            [...text].forEach((char) => {
              const charWidth = measure(char, bold);
              if (line.length && width + charWidth > maxWidth) breakLine();
              line.push({ text: char, bold });
              width += charWidth;
            });
          });
        } else {
          line.push(...pieces);
          width += wordWidth;
        }

        if (space) {
          line.push(space);
          width += measure(space.text, space.bold);
        }
      });
      if (line.length) lines.push(line);

      return lines.map(mergePieces);
    };

    // Draws wrapped lines, the first one on the current baseline
    const drawLines = (lines, x) => {
      lines.forEach((segments, i) => {
        if (i > 0) advance(LINE_GAP);
        let cursor = x;
        segments.forEach(({ text, bold }) => {
          setBody(bold);
          doc.text(text, cursor, y);
          cursor += doc.getTextWidth(text);
        });
      });
    };

    const drawSectionHeading = (title) => {
      // keep the heading with the first two lines of its section
      ensureSpace(SECTION_GAP + HEADING_GAP + LINE_GAP);
      advance(SECTION_GAP);
      setBody(false, 12);
      doc.text(title, MARGIN_X, y);
      doc.setLineWidth(0.53); // 1.5pt rule
      doc.line(MARGIN_X - 0.5, y + 1.45, rightX + 0.5, y + 1.45);
    };

    // Moves to the next entry, keeping its heading with its first bullet
    const startEntry = (gap) => {
      ensureSpace(gap + PARA_GAP);
      advance(gap);
    };

    const dateWidth = (date) => {
      if (!hasContent(date)) return 0;
      setBody(true);
      return doc.getTextWidth(date.trim()) + 4;
    };

    // Runs `drawLeft`, then puts the bold date flush right on its first line. The
    // date is drawn last so text extraction reads "Company ... 05/2025" rather
    // than "05/2025Company", and lands on the first line's page if `drawLeft`
    // crossed a page break.
    const withDate = (date, drawLeft) => {
      const firstY = y;
      const firstPage = doc.getCurrentPageInfo().pageNumber;
      drawLeft();
      if (!hasContent(date)) return;
      const lastPage = doc.getCurrentPageInfo().pageNumber;
      doc.setPage(firstPage);
      setBody(true);
      doc.text(date.trim(), rightX, firstY, { align: "right" });
      doc.setPage(lastPage);
    };

    // Entry heading: styled text on the left, bold date flush right on the first line
    const drawEntryHeading = (runs, date) => {
      withDate(date, () =>
        drawLines(wrapRuns(runs, contentWidth - dateWidth(date)), MARGIN_X),
      );
    };

    const drawBullet = (runs, gap = PARA_GAP) => {
      advance(gap);
      // bold 13pt matches the size of the source document's Symbol-font bullet while
      // staying on the text baseline, so parsers read it as the start of the line
      setBody(true, 13);
      doc.text("•", BULLET_X, y);
      drawLines(wrapRuns(runs, rightX - BULLET_TEXT_X), BULLET_TEXT_X);
    };

    const drawBullets = (description) => {
      if (!hasContent(description)) return;
      toBullets(description).forEach((bullet) => drawBullet(parseBold(bullet)));
    };

    // "Link: <url>" with the date flush right
    const drawLinkLine = (url, date) => {
      const maxWidth = contentWidth - dateWidth(date);
      withDate(date, () => {
        setBody(false);
        const label = "Link: ";
        doc.text(label, MARGIN_X, y);
        const x = MARGIN_X + doc.getTextWidth(label);
        doc.splitTextToSize(url, maxWidth - (x - MARGIN_X)).forEach((line, i) => {
          if (i > 0) advance(LINE_GAP);
          setBody(false);
          doc.textWithLink(line, x, y, { url: toHref(url) });
          underline(x, y, doc.getTextWidth(line));
        });
      });
    };

    // ── Header ──────────────────────────────────────────────────────────────
    const details = formData.personalDetails?.[0] || {};
    const fullName = [details.firstName, details.lastName]
      .filter(hasContent)
      .map((name) => name.trim())
      .join(" ");

    doc.setProperties({
      title: fullName ? `${fullName} - Resume` : "Resume",
      author: fullName,
      subject: "Resume",
    });
    doc.setLanguage("en-US");

    y = MARGIN_Y + 6.5;
    if (fullName) {
      setBody(true, 20);
      doc.text(fullName.toUpperCase(), pageWidth / 2, y, { align: "center" });
    }

    const contactItems = [
      [details.phoneNumber],
      [details.location],
      [details.email, (email) => `mailto:${email}`],
      [details.linkedin, toHref],
      [details.github, toHref],
      [details.portfolio, toHref],
    ]
      .filter(([text]) => hasContent(text))
      .map(([text, toLink]) => ({ text: text.trim(), href: toLink?.(text.trim()) }));

    // Wrap between items, never inside one, so URLs stay whole for ATS parsers
    doc.setFont(CONTACT_FONT, "normal");
    doc.setFontSize(11);
    const separator = " | ";
    const separatorWidth = doc.getTextWidth(separator);
    const contactRows = [];
    contactItems.forEach((item) => {
      item.width = doc.getTextWidth(item.text);
      const row = contactRows[contactRows.length - 1];
      if (row && row.width + separatorWidth + item.width <= contentWidth) {
        row.items.push(item);
        row.width += separatorWidth + item.width;
      } else {
        contactRows.push({ items: [item], width: item.width });
      }
    });

    contactRows.forEach((row, i) => {
      y += i === 0 ? 6.5 : CONTACT_GAP;
      let x = (pageWidth - row.width) / 2;
      row.items.forEach((item, j) => {
        if (j > 0) {
          doc.text(separator, x, y);
          x += separatorWidth;
        }
        if (item.href) {
          doc.textWithLink(item.text, x, y, { url: item.href });
          underline(x, y, item.width);
        } else {
          doc.text(item.text, x, y);
        }
        x += item.width;
      });
    });

    // the 11pt contact line sits lower than body text, so the first heading gets 0.8mm more room
    y += 0.8;

    // ── Section renderers ───────────────────────────────────────────────────
    const renderSummary = () => {
      if (!hasContent(details.about)) return;
      drawSectionHeading("SUMMARY");
      details.about
        .split(/\r?\n/)
        .filter(hasContent)
        .forEach((paragraph, i) => {
          advance(i === 0 ? HEADING_GAP : PARA_GAP);
          drawLines(wrapRuns(parseBold(paragraph.trim()), contentWidth), MARGIN_X);
        });
    };

    const renderSkills = () => {
      // group by category in the order the categories were first entered
      const groups = new Map();
      (formData.skills || []).forEach(({ skillName, category }) => {
        if (!hasContent(skillName)) return;
        const label = hasContent(category) && category !== "Select" ? category.trim() : "";
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label).push(skillName.trim());
      });
      if (groups.size === 0) return;

      drawSectionHeading("SKILLS");
      [...groups].forEach(([label, names], i) => {
        const runs = [{ text: names.join(", "), bold: false }];
        if (label) runs.unshift({ text: `${label}: `, bold: true });
        drawBullet(runs, i === 0 ? HEADING_GAP : PARA_GAP);
      });
    };

    const renderExperience = () => {
      const entries = (formData.experienceDetails || []).filter((exp) =>
        [exp.companyName, exp.role, exp.location, exp.year, exp.description].some(hasContent),
      );
      if (entries.length === 0) return;

      drawSectionHeading("WORK EXPERIENCE");
      entries.forEach((exp, i) => {
        startEntry(i === 0 ? HEADING_GAP : ENTRY_GAP);
        // **Company**: Role - Location
        const runs = [];
        if (hasContent(exp.companyName)) runs.push({ text: exp.companyName.trim(), bold: true });
        if (hasContent(exp.role)) {
          runs.push({ text: `${runs.length ? ": " : ""}${exp.role.trim()}`, bold: false });
        }
        if (hasContent(exp.location)) {
          runs.push({ text: `${runs.length ? " - " : ""}${exp.location.trim()}`, bold: false });
        }
        drawEntryHeading(runs, exp.year);
        drawBullets(exp.description);
      });
    };

    const renderProjects = () => {
      const entries = (formData.projectDetails || []).filter((pro) =>
        [pro.projectName, pro.techStack, pro.projectLink, pro.year, pro.description].some(hasContent),
      );
      if (entries.length === 0) return;

      drawSectionHeading("PROJECTS");
      entries.forEach((pro, i) => {
        startEntry(i === 0 ? HEADING_GAP : ENTRY_GAP);
        // **Project** | Tech stack, then "Link: url" with the date on the right
        const runs = [];
        if (hasContent(pro.projectName)) runs.push({ text: pro.projectName.trim(), bold: true });
        if (hasContent(pro.techStack)) {
          runs.push({ text: `${runs.length ? " | " : ""}${pro.techStack.trim()}`, bold: false });
        }
        const hasLink = hasContent(pro.projectLink);
        drawEntryHeading(runs, hasLink ? "" : pro.year);
        if (hasLink) {
          if (runs.length) advance(LINE_GAP);
          drawLinkLine(pro.projectLink.trim(), pro.year);
        }
        drawBullets(pro.description);
      });
    };

    const renderEducation = () => {
      const entries = (formData.educationDetails || []).filter((edu) =>
        [edu.collegeName, edu.course, edu.location, edu.year].some(hasContent),
      );
      if (entries.length === 0) return;

      drawSectionHeading("EDUCATION");
      entries.forEach((edu, i) => {
        startEntry(i === 0 ? HEADING_GAP : PARA_GAP);
        // **College** || Location - Course
        const runs = [];
        if (hasContent(edu.collegeName)) runs.push({ text: edu.collegeName.trim(), bold: true });
        const rest = [edu.location, edu.course]
          .filter(hasContent)
          .map((part) => part.trim())
          .join(" - ");
        if (rest) runs.push({ text: `${runs.length ? " || " : ""}${rest}`, bold: false });
        drawEntryHeading(runs, edu.year);
      });
    };

    const renderCertifications = () => {
      const entries = (formData.certification || []).filter((cert) =>
        [cert.certiName, cert.year].some(hasContent),
      );
      if (entries.length === 0) return;

      drawSectionHeading(entries.length > 1 ? "CERTIFICATIONS" : "CERTIFICATION");
      entries.forEach((cert, i) => {
        startEntry(i === 0 ? HEADING_GAP : PARA_GAP);
        drawEntryHeading(parseBold((cert.certiName || "").trim()), cert.year);
      });
    };

    // ── Render sections in user-defined order ──────────────────────────────
    const sectionRenderers = {
      description: renderSummary,
      skills: renderSkills,
      experience: renderExperience,
      projects: renderProjects,
      education: renderEducation,
    };

    // saved resumes may predate a section, so append any the stored order lacks
    const sectionOrder = [
      ...new Set([...(formData.sectionOrder || []), ...DEFAULT_SECTION_ORDER]),
    ];
    sectionOrder.forEach((sectionId) => sectionRenderers[sectionId]?.());

    // Certifications always appear last (not user-reorderable)
    renderCertifications();

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
