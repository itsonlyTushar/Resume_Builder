import jsPDF from "jspdf";
import noto_reg from "../../assets/fonts/noto/NotoSans-Regular.ttf";
import noto_bol from "../../assets/fonts/noto/NotoSans-Bold.ttf";
import noto_semi from "../../assets/fonts/noto/NotoSans-SemiBold.ttf";

/**
 * Template20 – "Minimalist ATS"
 * Ultra-clean single-column, double-rule dividers, tight spacing.
 * Prioritises maximum content density while staying scannable.
 * ATS-optimised: no graphics, no columns, top-to-bottom reading order.
 * Font: Noto Sans – universal coverage, excellent screen & print clarity.
 */
export const Template20 = ({ formData }) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  try {
    doc.addFont(noto_reg, "noto_reg", "normal");
    doc.addFont(noto_bol, "noto_bol", "normal");
    doc.addFont(noto_semi, "noto_semi", "normal");

    const left = 14;
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const right = pageW - 14;
    const contentW = right - left;
    const bottom = 14;
    let y = 16;

    const has = (s) => s && s.trim().length > 0;
    const anyHas = (arr, fields) =>
      arr && arr.some((item) => fields.some((f) => has(item[f])));

    const pageBreak = (need = 0) => {
      if (y + need > pageH - bottom) {
        doc.addPage();
        y = 16;
      }
    };

    // Double-rule section divider
    const addSection = (title) => {
      y += 3;
      pageBreak(12);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(left, y, right, y);
      doc.setLineWidth(0.2);
      doc.line(left, y + 1.2, right, y + 1.2);
      y += 5;
      doc.setFont("noto_bol");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), left, y);
      y += 6;
    };

    const d = formData.personalDetails?.[0] || {};

    // ── Header: Name centred, contact below ──
    if (has(d.firstName) || has(d.lastName)) {
      doc.setFont("noto_bol");
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      const name = `${d.firstName || ""} ${d.lastName || ""}`.trim().toUpperCase();
      doc.text(name, pageW / 2, y, { align: "center" });
      y += 7;
    }

    // Contact line
    const contacts = [d.email, d.phoneNumber, d.linkedin, d.location].filter(has);
    if (contacts.length > 0) {
      doc.setFont("noto_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text(contacts.join("   ·   "), pageW / 2, y, { align: "center" });
      y += 4;
    }

    const extraLinks = [d.portfolio, d.github].filter(has);
    if (extraLinks.length > 0) {
      doc.setFont("noto_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text(extraLinks.join("   ·   "), pageW / 2, y, { align: "center" });
      y += 4;
    }

    // ── Summary ──
    if (has(d.about)) {
      addSection("Summary");
      doc.setFont("noto_reg");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      const lines = doc.splitTextToSize(d.about, contentW);
      pageBreak(lines.length * 3.8);
      doc.text(lines, left, y);
      y += lines.length * 3.8 + 1;
    }

    // ── Experience ──
    const validExp =
      formData.experienceDetails?.filter((e) =>
        [e.companyName, e.role, e.description, e.year, e.location].some(has)
      ) || [];
    if (validExp.length > 0) {
      addSection("Experience");
      validExp.forEach((exp, idx) => {
        pageBreak(16);
        if (idx > 0) y += 2;

        // Row 1: Company bold left, date right
        if (has(exp.companyName)) {
          doc.setFont("noto_bol");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(exp.companyName, left, y);
        }
        if (has(exp.year)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(exp.year, right, y, { align: "right" });
        }
        y += 4.5;

        // Row 2: Role italic left, location right
        if (has(exp.role)) {
          doc.setFont("noto_semi");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          doc.text(exp.role, left, y);
        }
        if (has(exp.location)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 100, 100);
          doc.text(exp.location, right, y, { align: "right" });
        }
        y += 5;

        // Bullets
        if (has(exp.description)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(30, 30, 30);
          const bullets = exp.description.split("•").filter((s) => s.trim().length > 0);
          bullets.forEach((b) => {
            const bt = doc.splitTextToSize(`•  ${b.trim()}`, contentW - 6);
            pageBreak(bt.length * 3.8);
            doc.text(bt, left + 3, y);
            y += bt.length * 3.8;
          });
        }
        y += 2;
      });
    }

    // ── Education ──
    if (anyHas(formData.educationDetails, ["collegeName", "course", "year", "location"])) {
      addSection("Education");
      formData.educationDetails.forEach((edu, idx) => {
        if (![edu.collegeName, edu.course, edu.year, edu.location].some(has)) return;
        pageBreak(12);
        if (idx > 0) y += 2;

        if (has(edu.course)) {
          doc.setFont("noto_bol");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          doc.text(edu.course, left, y);
        }
        if (has(edu.year)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(edu.year, right, y, { align: "right" });
        }
        y += 4.5;
        const sub = [edu.collegeName, edu.location].filter(has).join(" – ");
        if (sub) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(sub, left, y);
        }
        y += 5;
      });
    }

    // ── Projects ──
    const validProjects =
      formData.projectDetails?.filter((p) =>
        [p.projectName, p.techStack, p.description, p.projectLink, p.year].some(has)
      ) || [];
    if (validProjects.length > 0) {
      addSection("Projects");
      validProjects.forEach((pro, idx) => {
        pageBreak(14);
        if (idx > 0) y += 2;

        if (has(pro.projectName)) {
          doc.setFont("noto_bol");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          doc.text(pro.projectName, left, y);
        }
        if (has(pro.year)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(pro.year, right, y, { align: "right" });
        }
        y += 4.5;
        if (has(pro.techStack)) {
          doc.setFont("noto_semi");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(`Tech: ${pro.techStack}`, left, y);
          y += 4;
        }
        if (has(pro.description)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(30, 30, 30);
          const desc = doc.splitTextToSize(pro.description, contentW - 6);
          pageBreak(desc.length * 3.8);
          doc.text(desc, left + 3, y);
          y += desc.length * 3.8 + 1;
        }
        if (has(pro.projectLink)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8);
          doc.setTextColor(0, 90, 160);
          doc.textWithLink(pro.projectLink, left + 3, y, { url: pro.projectLink });
          doc.setTextColor(0, 0, 0);
          y += 4;
        }
        y += 1;
      });
    }

    // ── Skills ──
    const validSkills = formData.skills?.filter((s) => has(s.skillName)) || [];
    if (validSkills.length > 0) {
      addSection("Skills");
      doc.setFont("noto_reg");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      const skillStr = validSkills.map((s) => s.skillName.trim()).join("   ·   ");
      const wrapped = doc.splitTextToSize(skillStr, contentW);
      pageBreak(wrapped.length * 4);
      doc.text(wrapped, left, y);
      y += wrapped.length * 4 + 1;
    }

    // ── Certifications ──
    const validCerts =
      formData.certification?.filter((c) => has(c.certiName) || has(c.year)) || [];
    if (validCerts.length > 0) {
      addSection("Certifications");
      validCerts.forEach((cer) => {
        pageBreak(6);
        doc.setFont("noto_semi");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        if (has(cer.certiName)) doc.text(cer.certiName, left, y);
        if (has(cer.year)) {
          doc.setFont("noto_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(cer.year, right, y, { align: "right" });
        }
        y += 5;
      });
    }

    return doc;
  } catch {
    return doc;
  }
};
