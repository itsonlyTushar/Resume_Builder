import jsPDF from "jspdf";
import noto_reg from "../../assets/fonts/noto/NotoSans-Regular.ttf";
import noto_bol from "../../assets/fonts/noto/NotoSans-Bold.ttf";
import noto_semi from "../../assets/fonts/noto/NotoSans-SemiBold.ttf";
import toast from "react-hot-toast";
import { checkStr } from "../../utils/helpers";
import { drawLeftRight, splitBullets, toHref, wrapItems } from "./templateHelpers";

export const Template15 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 15;
    const rightX = pageWidth - margin;
    const contentWidth = rightX - margin;
    const bottomMargin = 20;
    let y = 20;

    const checkAddPage = (extraSpace = 0) => {
      if (y + extraSpace > pageHeight - bottomMargin) {
        pdf.addPage();
        y = 15;
      }
    };

    // Register Noto fonts
    pdf.addFont(noto_reg, "NotoSans", "normal");
    pdf.addFont(noto_bol, "NotoSans", "bold");
    pdf.addFont(noto_semi, "NotoSans", "semibold");
    pdf.setFont("NotoSans", "normal");

    // Draws a heading bar at the current y, keeping it with the first lines below
    const drawSectionHeader = (title) => {
      checkAddPage(22);
      pdf.setFillColor(173, 255, 168);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");
      pdf.setTextColor(0);
      pdf.setFont("NotoSans", "bold");
      pdf.setFontSize(12);
      pdf.text(title, margin + 2, y + 5.5);
      pdf.setFont("NotoSans", "normal");
      return y + 12;
    };

    // Text on the left, date on the right; returns the lines the text took
    const drawTitleRow = (title, date, setTitleFont, lineHeight) =>
      drawLeftRight(pdf, {
        left: checkStr(title || "") ? title.trim() : "",
        right: checkStr(date || "") ? date.trim() : "",
        x: margin,
        rightX,
        y,
        lineHeight,
        setLeftFont: setTitleFont,
        setRightFont: () => {
          pdf.setFont("NotoSans", "normal");
          pdf.setFontSize(8);
        },
      });

    // Wrapped lines at the current y, moving y down by lineHeight per line
    const drawLines = (text, lineHeight) => {
      pdf.splitTextToSize(text, contentWidth).forEach((line) => {
        checkAddPage(lineHeight);
        pdf.text(line, margin, y);
        y += lineHeight;
      });
    };

    const hasAny = (items, fields) =>
      (items || []).filter((item) => item && fields.some((f) => checkStr(item[f] || "")));

    const addMultiLine = (text, x, yStart, maxWidth, lineHeight = 5) => {
      const lines = pdf.splitTextToSize(text || "", maxWidth);
      lines.forEach((line) => {
        checkAddPage(lineHeight);
        pdf.text(line, x, y);
        y += lineHeight;
      });
      return y;
    };

    const personal = formData.personalDetails?.[0] || {};
    const linkedin = checkStr(personal.linkedin || "") ? personal.linkedin : "";
    const name = `${checkStr(personal.firstName || "") ? personal.firstName : ""} ${checkStr(personal.lastName || "") ? personal.lastName : ""}`;
    const phone = checkStr(personal.phoneNumber || "") ? personal.phoneNumber : "";
    const email = checkStr(personal.email || "") ? personal.email : "";

    // Header
    pdf.setFont("NotoSans", "semibold");
    pdf.setFontSize(20);
    pdf.setTextColor(0);
    pdf.splitTextToSize(name.trim(), contentWidth).forEach((line, i) => {
      if (i > 0) y += 8;
      pdf.text(line, margin, y);
    });

    pdf.setFont("NotoSans", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    const gap = 6;
    const [linkedinW, phoneW, emailW] = [linkedin, phone, email].map((t) => pdf.getTextWidth(t));
    const spreadFits =
      margin + linkedinW + gap <= pageWidth / 2 - phoneW / 2 &&
      pageWidth / 2 + phoneW / 2 + gap <= rightX - emailW;
    if (spreadFits) {
      pdf.text(linkedin, margin, y + 6);
      pdf.text(phone, pageWidth / 2, y + 6, { align: "center" });
      pdf.text(email, rightX, y + 6, { align: "right" });
    } else {
      // too long to spread out: list them, wrapping between items
      const items = [linkedin, phone, email].filter(Boolean);
      wrapItems(pdf, items, "  |  ", contentWidth).forEach((line, i) => {
        if (i > 0) y += 4.5;
        pdf.text(line, margin, y + 6);
      });
    }
    y += 16;

    // Summary
    if (checkStr(personal.about || "")) {
      y = drawSectionHeader("Professional summary");
      pdf.setFontSize(9);
      y = addMultiLine(personal.about, margin, y, pageWidth - margin * 2);
    }

    // Skills
    if (hasAny(formData.skills, ["skillName"]).length > 0) {
      y = drawSectionHeader("Skills");
      const skillList = formData.skills
        .map((s) => checkStr(s.skillName || "") && s.skillName.trim())
        .filter(Boolean)
        .join(" • ");
      pdf.setFontSize(9);
      y = addMultiLine(skillList, margin, y, pageWidth - margin * 2);
    }

    // Work History
    const experiences = hasAny(formData.experienceDetails, [
      "role",
      "companyName",
      "location",
      "year",
      "description",
    ]);
    if (experiences.length > 0) {
      y = drawSectionHeader("Work history");
      experiences.forEach((exp) => {
        checkAddPage(20);

        const {
          role,
          companyName,
          location,
          year,
          description,
        } = exp;

        pdf.setTextColor(0);
        const roleLines = drawTitleRow(role, year, () => {
          pdf.setFont("NotoSans", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(0);
        }, 4.5);
        y += (roleLines - 1) * 4.5 + 4;

        const companyLine = [companyName, location].filter((s) => checkStr(s || "")).join(", ");
        if (companyLine) {
          pdf.setFont("NotoSans", "semibold");
          pdf.setFontSize(8);
          pdf.setTextColor(80);
          drawLines(companyLine, 4);
          y += 1;
        }

        if (checkStr(description || "")) {
          pdf.setFont("NotoSans", "normal");
          pdf.setTextColor(60);
          pdf.setFontSize(8);
          splitBullets(description).forEach((bullet) => {
            const bulletText = pdf.splitTextToSize(`• ${bullet}`, pageWidth - margin * 2 - 5);
            bulletText.forEach((line) => {
              checkAddPage(5);
              pdf.text(line, margin + 3, y);
              y += 5;
            });
          });
          y += 3;
        }
      });
    }

    // Education
    const educations = hasAny(formData.educationDetails, ["collegeName", "course", "location", "year"]);
    if (educations.length > 0) {
      y = drawSectionHeader("Education");
      educations.forEach((edu) => {
        checkAddPage(15);

        if (checkStr(edu.course || "")) {
          pdf.setFont("NotoSans", "bold");
          pdf.setFontSize(10);
          pdf.splitTextToSize(edu.course, contentWidth).forEach((line, i) => {
            if (i > 0) y += 4.5;
            pdf.text(line, margin, y);
          });
        }
        y += 4;

        const collegeLine = [edu.collegeName, edu.location].filter((s) => checkStr(s || "")).join(", ");
        const collegeLines = drawTitleRow(collegeLine, edu.year, () => {
          pdf.setFont("NotoSans", "semibold");
          pdf.setFontSize(8);
        }, 4);
        y += (collegeLines - 1) * 4 + 8;
      });
    }

    // Projects
    const projects = hasAny(formData.projectDetails, [
      "projectName",
      "techStack",
      "projectLink",
      "year",
      "description",
    ]);
    if (projects.length > 0) {
      y = drawSectionHeader("Projects");
      projects.forEach((pro) => {
        checkAddPage(15);

        if (checkStr(pro.projectName || "") || checkStr(pro.year || "")) {
          pdf.setTextColor(0);
          const nameLines = drawTitleRow(pro.projectName, pro.year, () => {
            pdf.setFont("NotoSans", "bold");
            pdf.setFontSize(10);
            pdf.setTextColor(0);
          }, 4.5);
          y += (nameLines - 1) * 4.5 + 4;
        }

        if (checkStr(pro.techStack || "")) {
          pdf.setFont("NotoSans", "semibold");
          pdf.setFontSize(8);
          pdf.setTextColor(80);
          drawLines(pro.techStack, 4);
        }

        if (checkStr(pro.description || "")) {
          pdf.setFont("NotoSans", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(60);
          y = addMultiLine(pro.description, margin, y, pageWidth - margin * 2);
        }

        if (checkStr(pro.projectLink || "")) {
          pdf.setFont("NotoSans", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(0, 102, 204);
          const url = toHref(pro.projectLink.trim());
          pdf.splitTextToSize(pro.projectLink.trim(), contentWidth).forEach((line) => {
            checkAddPage(5);
            pdf.textWithLink(line, margin, y, { url });
            y += 4;
          });
          pdf.setTextColor(0);
          y += 1;
        }
        y += 3;
      });
    }

    // Awards
    const awardCerts = hasAny(formData.certification, ["certiName", "year"]);
    if (awardCerts.length > 0) {
      y = drawSectionHeader("Certifications");
      awardCerts.forEach((a) => {
        checkAddPage(5);
        pdf.setTextColor(0);
        pdf.circle(margin + 1, y - 1, 0.7, "F");
        const certLines = drawLeftRight(pdf, {
          left: checkStr(a.certiName || "") ? a.certiName.trim() : "",
          right: checkStr(a.year || "") ? a.year.trim() : "",
          x: margin + 5,
          rightX,
          y,
          lineHeight: 4.5,
          setLeftFont: () => {
            pdf.setFont("NotoSans", "normal");
            pdf.setFontSize(9);
          },
          setRightFont: () => {
            pdf.setFont("NotoSans", "normal");
            pdf.setFontSize(8);
          },
        });
        y += (certLines - 1) * 4.5 + 5;
      });
    }

    return pdf;

  } catch (error) {
    toast.error("Error Generating the Resume. Try again...");
    console.error("PDF Generation Error:", error);
  }
};
