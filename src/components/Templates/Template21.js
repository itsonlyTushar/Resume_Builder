import jsPDF from "jspdf";
import pop_reg from "../../assets/fonts/poppins/Poppins_Regular.ttf";
import pop_semi from "../../assets/fonts/poppins/Poppins_SemiBold.ttf";
import pop_bol from "../../assets/fonts/poppins/Poppins-Bold.ttf";

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
    const headerH = 38;
    const bottomM = 14;

    // Two-column layout dimensions
    const colGap = 8;
    const leftColW = (pageW - marginL - marginR - colGap) * 0.62;
    const rightColStart = marginL + leftColW + colGap;
    const rightColW = pageW - rightColStart - marginR;

    let leftY = headerH + 10;
    let rightY = headerH + 10;

    const has = (s) => s && s.trim().length > 0;

    const checkLeftPage = (need = 0) => {
      if (leftY + need > pageH - bottomM) {
        doc.addPage();
        leftY = 16;
      }
    };
    const checkRightPage = (need = 0) => {
      if (rightY + need > pageH - bottomM) {
        // Right column continues on the new page only if left already created one
        if (rightY > pageH - bottomM) {
          doc.addPage();
        }
        rightY = 16;
      }
    };

    const addLeftHeader = (title) => {
      checkLeftPage(12);
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
      checkRightPage(12);
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
    doc.setFillColor(35, 55, 80);
    doc.rect(0, 0, pageW, headerH, "F");

    // Name
    if (has(d.firstName) || has(d.lastName)) {
      doc.setFont("pop_bol");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      const name = `${d.firstName || ""} ${d.lastName || ""}`.trim();
      doc.text(name, marginL, 18);
    }

    // Contact row inside header
    const contacts = [d.email, d.phoneNumber, d.linkedin, d.location].filter(has);
    if (contacts.length > 0) {
      doc.setFont("pop_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(200, 210, 225);
      doc.text(contacts.join("   |   "), marginL, 27);
    }

    const extra = [d.portfolio, d.github].filter(has);
    if (extra.length > 0) {
      doc.setFont("pop_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(200, 210, 225);
      doc.text(extra.join("   |   "), marginL, 33);
    }

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
        if (has(exp.role)) {
          doc.setFont("pop_semi");
          doc.setFontSize(10);
          doc.setTextColor(20, 20, 20);
          doc.text(exp.role, marginL, leftY);
        }
        if (has(exp.year)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(exp.year, marginL + leftColW, leftY, { align: "right" });
        }
        leftY += 4.5;
        const sub = [exp.companyName, exp.location].filter(has).join(" · ");
        if (sub) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(90, 90, 90);
          doc.text(sub, marginL, leftY);
          leftY += 4.5;
        }
        if (has(exp.description)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(40, 40, 40);
          const bullets = exp.description.split("•").filter((s) => s.trim().length > 0);
          bullets.forEach((b) => {
            const bt = doc.splitTextToSize(`•  ${b.trim()}`, leftColW - 4);
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
        if (has(pro.projectName)) {
          doc.setFont("pop_semi");
          doc.setFontSize(10);
          doc.setTextColor(20, 20, 20);
          doc.text(pro.projectName, marginL, leftY);
        }
        if (has(pro.year)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(pro.year, marginL + leftColW, leftY, { align: "right" });
        }
        leftY += 4.5;
        if (has(pro.techStack)) {
          doc.setFont("pop_reg");
          doc.setFontSize(8.5);
          doc.setTextColor(90, 90, 90);
          doc.text(pro.techStack, marginL, leftY);
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
          doc.textWithLink(pro.projectLink, marginL + 2, leftY, { url: pro.projectLink });
          doc.setTextColor(0, 0, 0);
          leftY += 4;
        }
        leftY += 3;
      });
    }

    // ═══ RIGHT COLUMN – Skills, Education, Certifications ═══

    // Skills
    const validSkills = formData.skills?.filter((s) => has(s.skillName)) || [];
    if (validSkills.length > 0) {
      addRightHeader("Skills");
      doc.setFont("pop_reg");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      validSkills.forEach((skill) => {
        checkRightPage(5);
        doc.setFillColor(240, 243, 247);
        doc.roundedRect(rightColStart, rightY - 3.2, rightColW, 5.4, 1.5, 1.5, "F");
        doc.text(skill.skillName.trim(), rightColStart + 3, rightY);
        rightY += 7;
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
          doc.text(loc, rightColStart, rightY);
          rightY += 3.5;
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
