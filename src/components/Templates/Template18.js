import jsPDF from "jspdf";
import mont_reg from "../../assets/fonts/montserrat/Montserrat-Regular.ttf";
import mont_bol from "../../assets/fonts/montserrat/Montserrat-Bold.ttf";
import { drawLeftRight, splitBullets, toHref, wrapItems } from "./templateHelpers";

/**
 * Template18 – "Clean Modern"
 * Single-column, generous white-space, thin accent-color section lines.
 * ATS-friendly: no tables, no columns, standard reading order.
 * Font: Montserrat (widely recognized, highly legible).
 */
export const Template18 = ({ formData }) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  try {
    doc.addFont(mont_reg, "mont_reg", "normal");
    doc.addFont(mont_bol, "mont_bol", "normal");

    const leftMargin = 18;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - 2 * leftMargin;
    const bottomMargin = 18;
    let y = 20;

    const accentR = 37, accentG = 99, accentB = 163; // steel-blue accent

    const hasContent = (s) => s && s.trim().length > 0;
    const hasAny = (arr, fields) =>
      arr && arr.some((item) => fields.some((f) => hasContent(item[f])));

    const checkPage = (need = 0) => {
      if (y + need > pageHeight - bottomMargin) {
        doc.addPage();
        y = 20;
      }
    };

    // Bold title on the left, date on the right; returns the lines the title took
    const drawTitleRow = (title, date, titleSize = 10.5) =>
      drawLeftRight(doc, {
        left: hasContent(title) ? title.trim() : "",
        right: hasContent(date) ? date.trim() : "",
        x: leftMargin,
        rightX: pageWidth - leftMargin,
        y,
        lineHeight: 5,
        setLeftFont: () => {
          doc.setFont("mont_bol");
          doc.setFontSize(titleSize);
        },
        setRightFont: () => {
          doc.setFont("mont_reg");
          doc.setFontSize(9);
        },
      });

    // Grey sub-line under a title, wrapped to the content width
    const drawSubLine = (text) => {
      doc.setFont("mont_reg");
      doc.setFontSize(9);
      doc.setTextColor(90, 90, 90);
      doc.splitTextToSize(text, contentWidth).forEach((line, i) => {
        if (i > 0) y += 4;
        doc.text(line, leftMargin, y);
      });
      doc.setTextColor(0, 0, 0);
    };

    const addSection = (title) => {
      y += 4;
      checkPage(24); // heading plus the first entry below it
      doc.setFont("mont_bol");
      doc.setFontSize(11);
      doc.setTextColor(accentR, accentG, accentB);
      doc.text(title.toUpperCase(), leftMargin, y);
      y += 2;
      doc.setDrawColor(accentR, accentG, accentB);
      doc.setLineWidth(0.6);
      doc.line(leftMargin, y, pageWidth - leftMargin, y);
      y += 6;
      doc.setTextColor(0, 0, 0);
    };

    // ── Personal Details ──
    const d = formData.personalDetails?.[0] || {};

    if (hasContent(d.firstName) || hasContent(d.lastName)) {
      doc.setFont("mont_bol");
      doc.setFontSize(26);
      doc.setTextColor(30, 30, 30);
      doc
        .splitTextToSize(`${d.firstName || ""} ${d.lastName || ""}`.trim(), contentWidth)
        .forEach((line, i) => {
          if (i > 0) y += 10;
          doc.text(line, pageWidth / 2, y, { align: "center" });
        });
      y += 8;
    }

    // Contact row
    const contacts = [d.phoneNumber, d.email, d.linkedin, d.location].filter(hasContent);
    if (contacts.length > 0) {
      doc.setFont("mont_reg");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      wrapItems(doc, contacts, "  |  ", contentWidth).forEach((line) => {
        doc.text(line, pageWidth / 2, y, { align: "center" });
        y += 4;
      });
    }

    // Portfolio / GitHub on second line if present
    const links = [d.portfolio, d.github].filter(hasContent);
    if (links.length > 0) {
      doc.setFont("mont_reg");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      wrapItems(doc, links, "  |  ", contentWidth).forEach((line) => {
        doc.text(line, pageWidth / 2, y, { align: "center" });
        y += 4;
      });
    }

    y += 2;

    // ── Professional Summary ──
    if (hasContent(d.about)) {
      addSection("Professional Summary");
      doc.setFont("mont_reg");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(d.about, contentWidth);
      checkPage(lines.length * 4);
      doc.text(lines, leftMargin, y);
      y += lines.length * 4 + 2;
    }

    // ── Skills ──
    const validSkills = formData.skills?.filter((s) => hasContent(s.skillName)) || [];
    if (validSkills.length > 0) {
      addSection("Skills");
      doc.setFont("mont_reg");
      doc.setFontSize(9.5);
      const skillStr = validSkills.map((s) => s.skillName.trim()).join("  •  ");
      const wrapped = doc.splitTextToSize(skillStr, contentWidth);
      checkPage(wrapped.length * 4);
      doc.text(wrapped, leftMargin, y);
      y += wrapped.length * 4 + 2;
    }

    // ── Experience ──
    const validExp =
      formData.experienceDetails?.filter((e) =>
        [e.companyName, e.role, e.description, e.year, e.location].some(hasContent)
      ) || [];
    if (validExp.length > 0) {
      addSection("Experience");
      validExp.forEach((exp) => {
        checkPage(18);
        // Role (bold) with the year right-aligned
        y += (drawTitleRow(exp.role, exp.year) - 1) * 5 + 5;
        // Company + location
        const sub = [exp.companyName, exp.location].filter(hasContent).join("  –  ");
        if (sub) {
          drawSubLine(sub);
          y += 5;
        }
        // Description bullets
        if (hasContent(exp.description)) {
          doc.setFont("mont_reg");
          doc.setFontSize(9);
          splitBullets(exp.description).forEach((b) => {
            const bText = doc.splitTextToSize(`•  ${b}`, contentWidth - 4);
            checkPage(bText.length * 4);
            doc.text(bText, leftMargin + 2, y);
            y += bText.length * 4;
          });
        }
        y += 4;
      });
    }

    // ── Education ──
    if (hasAny(formData.educationDetails, ["collegeName", "course", "year", "location"])) {
      addSection("Education");
      formData.educationDetails.forEach((edu) => {
        if (![edu.collegeName, edu.course, edu.year, edu.location].some(hasContent)) return;
        checkPage(14);
        y += (drawTitleRow(edu.collegeName, edu.year) - 1) * 5 + 5;
        const sub = [edu.course, edu.location].filter(hasContent).join("  –  ");
        if (sub) drawSubLine(sub);
        y += 6;
      });
    }

    // ── Projects ──
    const validProjects =
      formData.projectDetails?.filter((p) =>
        [p.projectName, p.techStack, p.description, p.projectLink, p.year].some(hasContent)
      ) || [];
    if (validProjects.length > 0) {
      addSection("Projects");
      validProjects.forEach((pro) => {
        checkPage(16);
        y += (drawTitleRow(pro.projectName, pro.year) - 1) * 5 + 5;
        if (hasContent(pro.techStack)) {
          drawSubLine(pro.techStack);
          y += 5;
        }
        if (hasContent(pro.description)) {
          doc.setFont("mont_reg");
          doc.setFontSize(9);
          const desc = doc.splitTextToSize(pro.description, contentWidth - 4);
          checkPage(desc.length * 4);
          doc.text(desc, leftMargin + 2, y);
          y += desc.length * 4 + 1;
        }
        if (hasContent(pro.projectLink)) {
          doc.setFont("mont_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(accentR, accentG, accentB);
          const url = toHref(pro.projectLink.trim());
          doc.splitTextToSize(pro.projectLink.trim(), contentWidth - 2).forEach((line) => {
            doc.textWithLink(line, leftMargin + 2, y, { url });
            y += 4;
          });
          doc.setTextColor(0, 0, 0);
        }
        y += 3;
      });
    }

    // ── Certifications ──
    const validCerts =
      formData.certification?.filter((c) => hasContent(c.certiName) || hasContent(c.year)) || [];
    if (validCerts.length > 0) {
      addSection("Certifications");
      validCerts.forEach((cer) => {
        checkPage(8);
        y += (drawTitleRow(cer.certiName, cer.year, 10) - 1) * 5 + 6;
      });
    }

    return doc;
  } catch {
    return doc;
  }
};
