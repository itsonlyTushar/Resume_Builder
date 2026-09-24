import jsPDF from "jspdf";
import inter_reg from "../../assets/fonts/inter/InterTight_Regular.ttf";
import inter_bol from "../../assets/fonts/inter/InterTight_Bold.ttf";
import { drawLeftRight, splitBullets, toHref } from "./templateHelpers";

/**
 * Template19 – "Elegant Sidebar"
 * Two-column layout: narrow left sidebar (warm charcoal) with contact + skills,
 * wide right column with summary, experience, education, projects, certs.
 * ATS-friendly: text is real selectable text, standard fonts, no images.
 * Font: Inter Tight – clean geometric sans-serif.
 */
export const Template19 = ({ formData }) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  try {
    doc.addFont(inter_reg, "inter_reg", "normal");
    doc.addFont(inter_bol, "inter_bol", "normal");

    const pageWidth = doc.internal.pageSize.width;   // 210
    const pageHeight = doc.internal.pageSize.height;  // 297
    const sidebarW = 62;
    const rightStart = sidebarW + 10;
    const rightMargin = pageWidth - 14;
    const rightContentW = rightMargin - rightStart;
    const bottomMargin = 16;

    let leftY = 22;
    let rightY = 22;

    const hasContent = (s) => s && s.trim().length > 0;

    const drawSidebar = () => {
      doc.setFillColor(42, 42, 50);
      doc.rect(0, 0, sidebarW, pageHeight, "F");
    };

    let leftPage = 1;
    let rightPage = 1;

    // Moves to page n, adding pages (with the sidebar background) as needed
    const goToPage = (n) => {
      while (doc.getNumberOfPages() < n) {
        doc.addPage();
        drawSidebar();
      }
      doc.setPage(n);
    };

    const checkLeftPage = (need = 0) => {
      if (leftY + need > pageHeight - bottomMargin) {
        leftPage += 1;
        goToPage(leftPage);
        leftY = 22;
      }
    };

    const checkRightPage = (need = 0) => {
      if (rightY + need > pageHeight - bottomMargin) {
        rightPage += 1;
        goToPage(rightPage);
        rightY = 22;
      }
    };

    // Bold title on the left, grey date on the right; returns the lines the title took
    const drawTitleRow = (title, date) =>
      drawLeftRight(doc, {
        left: hasContent(title) ? title.trim() : "",
        right: hasContent(date) ? date.trim() : "",
        x: rightStart,
        rightX: rightMargin,
        y: rightY,
        lineHeight: 4.5,
        setLeftFont: () => {
          doc.setFont("inter_bol");
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
        },
        setRightFont: () => {
          doc.setFont("inter_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(120, 120, 120);
        },
      });

    // Wrapped lines in the right column; leaves rightY on the last line
    const drawRightLines = (text, lineHeight) => {
      doc.splitTextToSize(text, rightContentW).forEach((line, i) => {
        if (i > 0) {
          rightY += lineHeight;
          checkRightPage(0);
        }
        doc.text(line, rightStart, rightY);
      });
    };

    const addRightHeader = (title) => {
      rightY += 3;
      checkRightPage(20); // heading plus the first entry below it
      doc.setFont("inter_bol");
      doc.setFontSize(11);
      doc.setTextColor(42, 42, 50);
      doc.text(title.toUpperCase(), rightStart, rightY);
      rightY += 2.5;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(rightStart, rightY, rightMargin, rightY);
      rightY += 6;
    };

    const addLeftHeader = (title) => {
      leftY += 4;
      checkLeftPage(16);
      doc.setFont("inter_bol");
      doc.setFontSize(9.5);
      doc.setTextColor(220, 185, 120); // warm gold
      doc.text(title.toUpperCase(), 8, leftY);
      leftY += 2;
      doc.setDrawColor(220, 185, 120);
      doc.setLineWidth(0.3);
      doc.line(8, leftY, sidebarW - 6, leftY);
      leftY += 6;
    };

    // ── Draw initial sidebar ──
    drawSidebar();

    const d = formData.personalDetails?.[0] || {};

    // ── Name (sidebar top) ──
    if (hasContent(d.firstName) || hasContent(d.lastName)) {
      doc.setFont("inter_bol");
      doc.setTextColor(255, 255, 255);
      const nameParts = [d.firstName, d.lastName]
        .filter(hasContent)
        .map((part) => part.trim().toUpperCase());
      const nameWidth = sidebarW - 14;
      const widestWord = () =>
        Math.max(...nameParts.join(" ").split(/\s+/).map((w) => doc.getTextWidth(w)));
      let nameSize = 18;
      doc.setFontSize(nameSize);
      while (nameSize > 11 && widestWord() > nameWidth) {
        nameSize -= 1;
        doc.setFontSize(nameSize);
      }
      nameParts.forEach((part) => {
        doc.splitTextToSize(part, nameWidth).forEach((line) => {
          doc.text(line, 8, leftY);
          leftY += nameSize * 0.39;
        });
      });
    }

    // ── Contact (sidebar) ──
    const contactItems = [
      { label: "Phone", value: d.phoneNumber },
      { label: "Email", value: d.email },
      { label: "LinkedIn", value: d.linkedin },
      { label: "Location", value: d.location },
      { label: "Portfolio", value: d.portfolio },
      { label: "GitHub", value: d.github },
    ].filter((c) => hasContent(c.value));

    if (contactItems.length > 0) {
      addLeftHeader("Contact");
      doc.setFont("inter_reg");
      doc.setFontSize(8);
      contactItems.forEach((item) => {
        const wrapped = doc.splitTextToSize(item.value, sidebarW - 14);
        checkLeftPage(4 + wrapped.length * 3.5);
        doc.setTextColor(180, 180, 180);
        doc.text(item.label, 8, leftY);
        leftY += 4;
        doc.setTextColor(255, 255, 255);
        doc.text(wrapped, 8, leftY);
        leftY += wrapped.length * 3.5 + 3;
      });
    }

    // ── Skills (sidebar) ──
    const validSkills = formData.skills?.filter((s) => hasContent(s.skillName)) || [];
    if (validSkills.length > 0) {
      addLeftHeader("Skills");
      doc.setFont("inter_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      validSkills.forEach((skill) => {
        const wrapped = doc.splitTextToSize(skill.skillName.trim(), sidebarW - 14);
        checkLeftPage(wrapped.length * 3.5);
        doc.text(wrapped, 10, leftY);
        leftY += wrapped.length * 3.5 + 2.5;
      });
    }

    // ── Certifications (sidebar) ──
    const validCerts =
      formData.certification?.filter((c) => hasContent(c.certiName) || hasContent(c.year)) || [];
    if (validCerts.length > 0) {
      addLeftHeader("Certifications");
      doc.setFont("inter_reg");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      validCerts.forEach((cer) => {
        checkLeftPage(8);
        if (hasContent(cer.certiName)) {
          doc.setFont("inter_bol");
          const wrapped = doc.splitTextToSize(cer.certiName, sidebarW - 14);
          doc.text(wrapped, 8, leftY);
          leftY += wrapped.length * 3.5;
        }
        if (hasContent(cer.year)) {
          doc.setFont("inter_reg");
          doc.setTextColor(180, 180, 180);
          doc.text(cer.year, 8, leftY);
          doc.setTextColor(255, 255, 255);
          leftY += 4;
        }
        leftY += 2;
      });
    }

    // ═══════════════════ RIGHT COLUMN ═══════════════════
    goToPage(rightPage);

    // ── Professional Summary ──
    if (hasContent(d.about)) {
      addRightHeader("Professional Summary");
      doc.setFont("inter_reg");
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(d.about, rightContentW);
      checkRightPage(lines.length * 4);
      doc.text(lines, rightStart, rightY);
      rightY += lines.length * 4 + 2;
    }

    // ── Experience ──
    const validExp =
      formData.experienceDetails?.filter((e) =>
        [e.companyName, e.role, e.description, e.year, e.location].some(hasContent)
      ) || [];
    if (validExp.length > 0) {
      addRightHeader("Experience");
      validExp.forEach((exp) => {
        checkRightPage(18);
        rightY += (drawTitleRow(exp.role, exp.year) - 1) * 4.5 + 5;
        const sub = [exp.companyName, exp.location].filter(hasContent).join(" – ");
        if (sub) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          drawRightLines(sub, 4);
          rightY += 5;
        }
        if (hasContent(exp.description)) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          splitBullets(exp.description).forEach((b) => {
            const bt = doc.splitTextToSize(`•  ${b}`, rightContentW - 4);
            checkRightPage(bt.length * 4);
            doc.text(bt, rightStart + 2, rightY);
            rightY += bt.length * 4;
          });
        }
        rightY += 4;
      });
    }

    // ── Education ──
    const validEdu =
      formData.educationDetails?.filter((e) =>
        [e.collegeName, e.course, e.year, e.location].some(hasContent)
      ) || [];
    if (validEdu.length > 0) {
      addRightHeader("Education");
      validEdu.forEach((edu) => {
        checkRightPage(14);
        rightY += (drawTitleRow(edu.collegeName, edu.year) - 1) * 4.5 + 5;
        const sub = [edu.course, edu.location].filter(hasContent).join(" – ");
        if (sub) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          drawRightLines(sub, 4);
        }
        rightY += 6;
      });
    }

    // ── Projects ──
    const validProjects =
      formData.projectDetails?.filter((p) =>
        [p.projectName, p.techStack, p.description, p.projectLink, p.year].some(hasContent)
      ) || [];
    if (validProjects.length > 0) {
      addRightHeader("Projects");
      validProjects.forEach((pro) => {
        checkRightPage(16);
        rightY += (drawTitleRow(pro.projectName, pro.year) - 1) * 4.5 + 5;
        if (hasContent(pro.techStack)) {
          doc.setFont("inter_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 100, 100);
          drawRightLines(pro.techStack, 4);
          rightY += 5;
        }
        if (hasContent(pro.description)) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          const desc = doc.splitTextToSize(pro.description, rightContentW - 4);
          checkRightPage(desc.length * 4);
          doc.text(desc, rightStart + 2, rightY);
          rightY += desc.length * 4 + 1;
        }
        if (hasContent(pro.projectLink)) {
          doc.setFont("inter_reg");
          doc.setFontSize(8);
          doc.setTextColor(70, 130, 180);
          const url = toHref(pro.projectLink.trim());
          doc.splitTextToSize(pro.projectLink.trim(), rightContentW - 2).forEach((line) => {
            doc.textWithLink(line, rightStart + 2, rightY, { url });
            rightY += 4;
          });
          doc.setTextColor(0, 0, 0);
        }
        rightY += 3;
      });
    }

    return doc;
  } catch {
    return doc;
  }
};
