import jsPDF from "jspdf";
import noto_reg from "../../assets/fonts/noto/NotoSans-Regular.ttf";
import noto_bol from "../../assets/fonts/noto/NotoSans-Bold.ttf";
import noto_semi from "../../assets/fonts/noto/NotoSans-SemiBold.ttf";
import PlayFair from "../../assets/fonts/playfair/PlayfairDisplay-VariableFont_wght.ttf";
import toast from "react-hot-toast";
import { checkEach, checkStr } from "../../utils/helpers";

export const Template15 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 15;
    let y = 20;

    // Register Noto fonts
    pdf.addFont(noto_reg, "NotoSans", "normal");
    pdf.addFont(noto_bol, "NotoSans", "bold");
    pdf.addFont(noto_semi, "NotoSans", "semibold");
    pdf.setFont("NotoSans", "normal");

    const drawSectionHeader = (title, yPosition) => {
      pdf.setFillColor(173, 255, 168);
      pdf.rect(margin, yPosition, pageWidth - margin * 2, 8, "F");
      pdf.setTextColor(0);
      pdf.setFont("NotoSans", "bold");
      pdf.setFontSize(12);
      pdf.text(title, margin + 2, yPosition + 5.5);
      pdf.setFont("NotoSans", "normal");
      return yPosition + 12;
    };

    const addMultiLine = (text, x, yStart, maxWidth, lineHeight = 5) => {
      const lines = pdf.splitTextToSize(text || "", maxWidth);
      lines.forEach((line, idx) => {
        pdf.text(line, x, yStart + idx * lineHeight);
      });
      return yStart + lines.length * lineHeight;
    };

    const personal = formData.personalDetails?.[0] || {};
    const linkedin = checkStr(personal.linkedin) ? personal.linkedin : "";
    const name = `${checkStr(personal.firstName) ? personal.firstName : ""} ${checkStr(personal.lastName) ? personal.lastName : ""}`;
    const phone = checkStr(personal.phoneNumber) ? personal.phoneNumber : "";
    const email = checkStr(personal.email) ? personal.email : "";

    // Header
    pdf.setFont("NotoSans", "semibold");
    pdf.setFontSize(20);
    pdf.setTextColor(0);
    pdf.text(name.trim(), margin, y);

    pdf.setFont("NotoSans", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(linkedin, margin, y + 6);
    pdf.text(phone, pageWidth / 2, y + 6, { align: "center" });
    pdf.text(email, pageWidth - margin, y + 6, { align: "right" });
    y += 16;

    // Summary
    if (checkStr(personal.about)) {
      y = drawSectionHeader("Professional summary", y);
      pdf.setFontSize(9);
      y = addMultiLine(personal.about, margin, y, pageWidth - margin * 2);
    }

    // Skills
    if (checkEach(formData.skills, "skillName")) {
      y = drawSectionHeader("Skills", y);
      const skillList = formData.skills
        .map((s) => checkStr(s.skillName) && s.skillName)
        .filter(Boolean)
        .join(" • ");
      pdf.setFontSize(9);
      y = addMultiLine(skillList, margin, y, pageWidth - margin * 2);
    }

    // Work History
    if (checkEach(formData.experienceDetails, "companyName")) {
      y = drawSectionHeader("Work history", y);
      formData.experienceDetails.forEach((exp) => {
        if (!exp) return;

        const {
          role,
          companyName,
          location,
          year,
          description,
        } = exp;

        if (checkStr(role)) {
          pdf.setFont("NotoSans", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(0);
          pdf.text(role, margin, y);
        }

        if (checkStr(year)) {
          pdf.setFont("NotoSans", "normal");
          pdf.setFontSize(8);
          pdf.text(year, pageWidth - margin, y, { align: "right" });
        }

        y += 4;

        if (checkStr(companyName)) {
          pdf.setFont("NotoSans", "semibold");
          pdf.setFontSize(8);
          pdf.setTextColor(80);
          pdf.text(
            `${companyName}${checkStr(location) ? ", " + location : ""}`,
            margin,
            y
          );
          y += 5;
        }

        if (checkStr(description)) {
          pdf.setFont("NotoSans", "normal");
          pdf.setTextColor(60);
          pdf.setFontSize(8);
          y = addMultiLine(description, margin, y, pageWidth - margin * 2);
          y += 3;
        }
      });
    }

    // Education
    if (checkEach(formData.educationDetails, "collegeName")) {
      y = drawSectionHeader("Education", y);
      formData.educationDetails.forEach((edu) => {
        if (!edu) return;

        if (checkStr(edu.course)) {
          pdf.setFont("NotoSans", "bold");
          pdf.setFontSize(10);
          pdf.text(edu.course, margin, y);
        }
        y += 4;

        if (checkStr(edu.collegeName)) {
          pdf.setFont("NotoSans", "semibold");
          pdf.setFontSize(8);
          pdf.text(
            `${edu.collegeName}${checkStr(edu.location) ? ", " + edu.location : ""}`,
            margin,
            y
          );
        }

        if (checkStr(edu.year)) {
          pdf.setFont("NotoSans", "normal");
          pdf.text(edu.year, pageWidth - margin, y, { align: "right" });
        }

        y += 8;
      });
    }

  

    // Awards
    const awardCerts = formData.certification?.filter(c => checkStr(c.certiName));
    if (awardCerts.length > 0) {
      y = drawSectionHeader("Certifications", y);
      awardCerts.forEach((a) => {
        if (!a || !checkStr(a.certiName)) return;
        pdf.setFont("NotoSans", "normal");
        pdf.setFontSize(9);
        pdf.circle(margin + 1, y - 1, 0.7, "F");
        pdf.text(a.certiName, margin + 5, y);
        y += 5;
      });
    }

    return pdf;

  } catch (error) {
    toast.error("Error Generating the Resume. Try again...");
    console.error("PDF Generation Error:", error);
  }
};
