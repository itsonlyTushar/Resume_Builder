import jsPDF from "jspdf";
import inter_reg from "../../assets/fonts/inter/InterTight_Regular.ttf";
import inter_bol from "../../assets/fonts/inter/InterTight_Bold.ttf";

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

    const checkRightPage = (need = 0) => {
      if (rightY + need > pageHeight - bottomMargin) {
        doc.addPage();
        drawSidebar();
        rightY = 22;
      }
    };

    const addRightHeader = (title) => {
      rightY += 3;
      checkRightPage(12);
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
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      const first = d.firstName || "";
      const last = d.lastName || "";
      if (hasContent(first)) {
        doc.text(first.toUpperCase(), 8, leftY);
        leftY += 7;
      }
      if (hasContent(last)) {
        doc.text(last.toUpperCase(), 8, leftY);
        leftY += 7;
      }
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
        doc.setTextColor(180, 180, 180);
        doc.text(item.label, 8, leftY);
        leftY += 4;
        doc.setTextColor(255, 255, 255);
        const wrapped = doc.splitTextToSize(item.value, sidebarW - 14);
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
        // Role
        if (hasContent(exp.role)) {
          doc.setFont("inter_bol");
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.text(exp.role, rightStart, rightY);
        }
        if (hasContent(exp.year)) {
          doc.setFont("inter_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(120, 120, 120);
          doc.text(exp.year, rightMargin, rightY, { align: "right" });
        }
        rightY += 5;
        const sub = [exp.companyName, exp.location].filter(hasContent).join(" – ");
        if (sub) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(sub, rightStart, rightY);
          rightY += 5;
        }
        if (hasContent(exp.description)) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          const bullets = exp.description.split("•").filter((s) => s.trim().length > 0);
          bullets.forEach((b) => {
            const bt = doc.splitTextToSize(`•  ${b.trim()}`, rightContentW - 4);
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
        if (hasContent(edu.collegeName)) {
          doc.setFont("inter_bol");
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.text(edu.collegeName, rightStart, rightY);
        }
        if (hasContent(edu.year)) {
          doc.setFont("inter_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(120, 120, 120);
          doc.text(edu.year, rightMargin, rightY, { align: "right" });
        }
        rightY += 5;
        const sub = [edu.course, edu.location].filter(hasContent).join(" – ");
        if (sub) {
          doc.setFont("inter_reg");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(sub, rightStart, rightY);
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
        if (hasContent(pro.projectName)) {
          doc.setFont("inter_bol");
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.text(pro.projectName, rightStart, rightY);
        }
        if (hasContent(pro.year)) {
          doc.setFont("inter_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(120, 120, 120);
          doc.text(pro.year, rightMargin, rightY, { align: "right" });
        }
        rightY += 5;
        if (hasContent(pro.techStack)) {
          doc.setFont("inter_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 100, 100);
          doc.text(pro.techStack, rightStart, rightY);
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
          doc.textWithLink(pro.projectLink, rightStart + 2, rightY, { url: pro.projectLink });
          doc.setTextColor(0, 0, 0);
          rightY += 4;
        }
        rightY += 3;
      });
    }

    return doc;
  } catch {
    return doc;
  }
};
