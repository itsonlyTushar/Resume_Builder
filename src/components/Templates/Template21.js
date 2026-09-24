import jsPDF from "jspdf";
import pop_reg from "../../assets/fonts/poppins/Poppins_Regular.ttf";
import pop_semi from "../../assets/fonts/poppins/Poppins_SemiBold.ttf";
import pop_bol from "../../assets/fonts/poppins/Poppins-Bold.ttf";
import { drawLeftRight, splitBullets, toHref, wrapItems } from "./templateHelpers";

/**
 * Template21 – "Bold Header Band"
 * Full-width dark header band containing name + contact, followed by a
 * two-column body: left (65%) for experience/projects, right (35%) for
 * skills, education, certifications. Alternating light-gray backgrounds
 * on right-column sections for visual separation.
 * ATS-friendly: all real text, standard top-down parsing, no images.
 * Font: Poppins – modern, friendly, highly readable.
 */
export const Template21 = ({ formData }) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  try {
    doc.addFont(pop_reg, "pop_reg", "normal");
    doc.addFont(pop_semi, "pop_semi", "normal");
    doc.addFont(pop_bol, "pop_bol", "normal");

    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const marginL = 14;
    const marginR = 14;
    const bottomM = 14;

    // Two-column layout dimensions
    const colGap = 8;
    const leftColW = (pageW - marginL - marginR - colGap) * 0.62;
    const rightColStart = marginL + leftColW + colGap;
    const rightColW = pageW - rightColStart - marginR;

    const has = (s) => s && s.trim().length > 0;

    // Each column tracks its own page: the right column starts back on page 1
    // after the left one, and either can continue onto later pages
    let leftPage = 1;
    let rightPage = 1;

    const goToPage = (n) => {
      while (doc.getNumberOfPages() < n) doc.addPage();
      doc.setPage(n);
    };

    const checkLeftPage = (need = 0) => {
      if (leftY + need > pageH - bottomM) {
        leftPage += 1;
        goToPage(leftPage);
        leftY = 16;
      }
    };
    const checkRightPage = (need = 0) => {
      if (rightY + need > pageH - bottomM) {
        rightPage += 1;
        goToPage(rightPage);
        rightY = 16;
      }
    };

    // Semi-bold title on the left, grey date on the right; returns the lines the title took
    const drawTitleRow = (title, date) =>
      drawLeftRight(doc, {
        left: has(title) ? title.trim() : "",
        right: has(date) ? date.trim() : "",
        x: marginL,
        rightX: marginL + leftColW,
        y: leftY,
        lineHeight: 4.5,
        setLeftFont: () => {
          doc.setFont("pop_semi");
          doc.setFontSize(10);
          doc.setTextColor(20, 20, 20);
        },
        setRightFont: () => {
          doc.setFont("pop_reg");
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
        },
      });

    // Wrapped lines in the left column; leaves leftY on the last line
    const drawLeftLines = (text, lineHeight) => {
      doc.splitTextToSize(text, leftColW).forEach((line, i) => {
        if (i > 0) {
          leftY += lineHeight;
          checkLeftPage(0);
        }
        doc.text(line, marginL, leftY);
      });
    };

    const addLeftHeader = (title) => {
      checkLeftPage(20); // heading plus the first entry below it
      doc.setFont("pop_bol");
      doc.setFontSize(11);
      doc.setTextColor(35, 55, 80);
      doc.text(title.toUpperCase(), marginL, leftY);
      leftY += 2;
      doc.setDrawColor(35, 55, 80);
      doc.setLineWidth(0.6);
      doc.line(marginL, leftY, marginL + leftColW, leftY);
      leftY += 4;
    };

    const addRightHeader = (title) => {
      rightY += 2;
      checkRightPage(18); // heading plus the first entry below it
      doc.setFont("pop_bol");
      doc.setFontSize(10);
      doc.setTextColor(35, 55, 80);
      doc.text(title.toUpperCase(), rightColStart, rightY);
      rightY += 2;
      doc.setDrawColor(35, 55, 80);
      doc.setLineWidth(0.4);
      doc.line(rightColStart, rightY, rightColStart + rightColW, rightY);
      rightY += 6;
    };

    const d = formData.personalDetails?.[0] || {};

    // ═══ HEADER BAND ═══
    const bandWidth = pageW - marginL - marginR;
    doc.setFont("pop_bol");
    doc.setFontSize(24);
    const nameLines =
      has(d.firstName) || has(d.lastName)
        ? doc.splitTextToSize(`${d.firstName || ""} ${d.lastName || ""}`.trim(), bandWidth)
        : [];
    doc.setFont("pop_reg");
    doc.setFontSize(8.5);
    const contactLines = wrapItems(
      doc,
      [d.email, d.phoneNumber, d.linkedin, d.location].filter(has),
      "   |   ",
      bandWidth,
    );
    const extraLines = wrapItems(doc, [d.portfolio, d.github].filter(has), "   |   ", bandWidth);

    // baselines: name at 18, contacts 9mm below it, extra links 6mm below those
    const nameBottom = 18 + Math.max(nameLines.length - 1, 0) * 10;
    const contactYs = contactLines.map((_, i) => nameBottom + 9 + i * 5);
    const extraStart = (contactYs[contactYs.length - 1] ?? nameBottom + 3) + 6;
    const extraYs = extraLines.map((_, i) => extraStart + i * 5);
    const lastLine = extraYs[extraYs.length - 1] ?? contactYs[contactYs.length - 1] ?? nameBottom;
    const headerH = Math.max(38, lastLine + 5);

    doc.setFillColor(35, 55, 80);
    doc.rect(0, 0, pageW, headerH, "F");

    doc.setFont("pop_bol");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    nameLines.forEach((line, i) => doc.text(line, marginL, 18 + i * 10));

    doc.setFont("pop_reg");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 210, 225);
    contactLines.forEach((line, i) => doc.text(line, marginL, contactYs[i]));
    extraLines.forEach((line, i) => doc.text(line, marginL, extraYs[i]));

    let leftY = headerH + 10;
    let rightY = headerH + 10;

    // ═══ LEFT COLUMN – Summary, Experience, Projects ═══

    // Summary
    if (has(d.about)) {
      addLeftHeader("Professional Summary");
      doc.setFont("pop_reg");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(d.about, leftColW);
      checkLeftPage(lines.length * 4);
      doc.text(lines, marginL, leftY);
      leftY += lines.length * 4 + 1;
    }

    // Experience
    const validExp =
      formData.experienceDetails?.filter((e) =>
        [e.companyName, e.role, e.description, e.year, e.location].some(has)
      ) || [];
    if (validExp.length > 0) {
      addLeftHeader("Experience");
      validExp.forEach((exp) => {
        checkLeftPage(16);
        leftY += (drawTitleRow(exp.role, exp.year) - 1) * 4.5 + 4.5;
        const sub = [exp.companyName, exp.location].filter(has).join(" · ");
        if (sub) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(90, 90, 90);
          drawLeftLines(sub, 4);
          leftY += 4.5;
        }
        if (has(exp.description)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(40, 40, 40);
          splitBullets(exp.description).forEach((b) => {
            const bt = doc.splitTextToSize(`•  ${b}`, leftColW - 4);
            checkLeftPage(bt.length * 3.8);
            doc.text(bt, marginL + 2, leftY);
            leftY += bt.length * 3.8;
          });
        }
        leftY += 1;
      });
      leftY += 1;
    }

    // Projects
    const validProjects =
      formData.projectDetails?.filter((p) =>
        [p.projectName, p.techStack, p.description, p.projectLink, p.year].some(has)
      ) || [];
    if (validProjects.length > 0) {
      addLeftHeader("Projects");
      validProjects.forEach((pro) => {
        checkLeftPage(14);
        leftY += (drawTitleRow(pro.projectName, pro.year) - 1) * 4.5 + 4.5;
        if (has(pro.techStack)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(90, 90, 90);
          drawLeftLines(pro.techStack, 4);
          leftY += 4.5;
        }
        if (has(pro.description)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(40, 40, 40);
          const desc = doc.splitTextToSize(pro.description, leftColW - 4);
          checkLeftPage(desc.length * 3.8);
          doc.text(desc, marginL + 2, leftY);
          leftY += desc.length * 3.8 + 1;
        }
        if (has(pro.projectLink)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8);
          doc.setTextColor(50, 100, 160);
          const url = toHref(pro.projectLink.trim());
          doc.splitTextToSize(pro.projectLink.trim(), leftColW - 2).forEach((line) => {
            doc.textWithLink(line, marginL + 2, leftY, { url });
            leftY += 4;
          });
          doc.setTextColor(0, 0, 0);
        }
        leftY += 3;
      });
    }

    // ═══ RIGHT COLUMN – Skills, Education, Certifications ═══

    goToPage(rightPage);

    // Skills
    const validSkills = formData.skills?.filter((s) => has(s.skillName)) || [];
    if (validSkills.length > 0) {
      addRightHeader("Skills");
      doc.setFont("pop_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      validSkills.forEach((skill) => {
        const lines = doc.splitTextToSize(skill.skillName.trim(), rightColW - 6);
        const extra = (lines.length - 1) * 3.8;
        checkRightPage(5 + extra);
        doc.setFillColor(240, 243, 247);
        doc.roundedRect(rightColStart, rightY - 3.2, rightColW, 5.4 + extra, 1.5, 1.5, "F");
        lines.forEach((line, i) => doc.text(line, rightColStart + 3, rightY + i * 3.8));
        rightY += 7 + extra;
      });
      rightY += 1;
    }

    // Education
    const validEdu =
      formData.educationDetails?.filter((e) =>
        [e.collegeName, e.course, e.year, e.location].some(has)
      ) || [];
    if (validEdu.length > 0) {
      addRightHeader("Education");
      validEdu.forEach((edu) => {
        checkRightPage(14);
        if (has(edu.collegeName)) {
          doc.setFont("pop_semi");
          doc.setFontSize(9);
          doc.setTextColor(20, 20, 20);
          const wrapped = doc.splitTextToSize(edu.collegeName, rightColW);
          doc.text(wrapped, rightColStart, rightY);
          rightY += wrapped.length * 4;
        }
        if (has(edu.course)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(70, 70, 70);
          const wrapped = doc.splitTextToSize(edu.course, rightColW);
          doc.text(wrapped, rightColStart, rightY);
          rightY += wrapped.length * 3.5;
        }
        const loc = [edu.location, edu.year].filter(has).join(" · ");
        if (loc) {
          doc.setFont("pop_reg");
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          const wrapped = doc.splitTextToSize(loc, rightColW);
          doc.text(wrapped, rightColStart, rightY);
          rightY += wrapped.length * 3.5;
        }
        rightY += 4;
      });
    }

    // Certifications
    const validCerts =
      formData.certification?.filter((c) => has(c.certiName) || has(c.year)) || [];
    if (validCerts.length > 0) {
      addRightHeader("Certifications");
      validCerts.forEach((cer) => {
        checkRightPage(8);
        if (has(cer.certiName)) {
          doc.setFont("pop_semi");
          doc.setFontSize(8.5);
          doc.setTextColor(20, 20, 20);
          const wrapped = doc.splitTextToSize(cer.certiName, rightColW);
          doc.text(wrapped, rightColStart, rightY);
          rightY += wrapped.length * 3.5;
        }
        if (has(cer.year)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text(cer.year, rightColStart, rightY);
          rightY += 3.5;
        }
        rightY += 3;
      });
    }

    return doc;
  } catch {
    return doc;
  }
};
