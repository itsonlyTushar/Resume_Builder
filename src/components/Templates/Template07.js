import jsPDF from "jspdf";
import Inter_reg from "../../assets/fonts/inter/InterTight_Regular.ttf";
import Inter_bol from "../../assets/fonts/inter/InterTight_Bold.ttf";
import { drawLeftRight, splitBullets, toHref, wrapItems } from "./templateHelpers";

export const Template07 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add Inter fonts
    doc.addFont(Inter_reg, "Inter_reg", "normal");
    doc.addFont(Inter_bol, "Inter_bol", "normal");
    doc.setFont("Inter_reg");

    const leftMargin = 20;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const rightX = pageWidth - leftMargin;
    const contentWidth = rightX - leftMargin;
    const bottomMargin = 20;

    // Set mint green background
    doc.setFillColor(230, 242, 236);
    doc.rect(0, 0, pageWidth, 297, "F");

    const checkAddPage = (extraSpace = 0) => {
      if (yPosition + extraSpace > pageHeight - bottomMargin) {
        doc.addPage();
        doc.setFillColor(230, 242, 236);
        doc.rect(0, 0, pageWidth, 297, "F");
        yPosition = 20;
      }
    };

    const details = formData.personalDetails?.[0] || {};

    // Helper function to check if a string has meaningful content
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to check if a section has valid data
    const hasValidData = (section, requiredFields) => {
      if (!section) return false;
      if (Array.isArray(section)) {
        return (
          section.length > 0 &&
          section.some((item) =>
            requiredFields.some((field) => hasContent(item[field]))
          )
        );
      }
      return requiredFields.some((field) => hasContent(section[field]));
    };

    // Helper function to add section header
    const addSectionHeader = (title) => {
      yPosition += 5;
      checkAddPage(20);
      doc.setFont("Inter_bol");
      doc.setFontSize(12);
      doc.setTextColor(27, 77, 62);
      doc.text(title.toUpperCase(), leftMargin, yPosition);
    };

    // Helper function to add section divider
    const addSectionDivider = () => {
      yPosition += 5;
      doc.setDrawColor(83, 187, 137);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 5;
    };

    // Header section - Only show if name exists
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setTextColor(27, 77, 62);
      doc.setFontSize(22);
      doc.setFont("Inter_bol");
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .toUpperCase();
      doc.splitTextToSize(fullName, contentWidth).forEach((line, i) => {
        if (i > 0) yPosition += 9;
        doc.text(line, leftMargin, yPosition);
      });

      // Contact Information - Only show if any contact detail exists
      const contactFields = [
        details.phoneNumber,
        details.email,
        details.linkedin,
      ].filter(hasContent);

      if (contactFields.length > 0) {
        yPosition += 8;
        doc.setFontSize(9);
        doc.setFont("Inter_reg");
        wrapItems(doc, contactFields, " | ", contentWidth).forEach((line, i) => {
          if (i > 0) yPosition += 4;
          doc.text(line, leftMargin, yPosition);
        });
      }
    }

    // Professional Summary - Only if about text exists
    if (hasContent(details.about)) {
      yPosition += 10;
      doc.setFont("Inter_reg");
      doc.setFontSize(9);
      const summary = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin
      );
      summary.forEach((line, i) => {
        doc.text(line, leftMargin, yPosition + i * 4);
      });
      yPosition += summary.length * 4 - 1;
      addSectionDivider();
    }

    // Experience Section
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      addSectionHeader("EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          checkAddPage(20);
          yPosition += 8;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(exp.role)) {
            doc.splitTextToSize(exp.role, contentWidth).forEach((line, i) => {
              if (i > 0) yPosition += 5;
              doc.text(line, leftMargin, yPosition);
            });
          }

          const expDetails = [exp.companyName, exp.location, exp.year]
            .filter(hasContent)
            .join(" | ");

          if (expDetails) {
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.splitTextToSize(expDetails, contentWidth).forEach((line) => {
              yPosition += 5;
              doc.text(line, leftMargin, yPosition);
            });
          }

          if (hasContent(exp.description)) {
            yPosition += 8;
            doc.setFont("Inter_reg");
            doc.setFontSize(9);
            splitBullets(exp.description).forEach((bullet) => {
              const wrappedBullet = doc.splitTextToSize(
                `• ${bullet}`,
                pageWidth - 2 * leftMargin - 5
              );
              checkAddPage(wrappedBullet.length * 4);
              wrappedBullet.forEach((line, i) => {
                doc.text(line, leftMargin + 5, yPosition + i * 4);
              });
              yPosition += wrappedBullet.length * 4;
            });
          }
        }
      });
      addSectionDivider();
    }

    // Certifications

    const certifications =
      formData.certification?.filter(
        (cert) => hasContent(cert.year) || hasContent(cert.certiName)
      ) || [];

    if (certifications.length > 0) {
      doc.setFont("Inter_bol");

      addSectionHeader("Certifications");
      certifications.forEach((cert) => {
        yPosition += 6;
        checkAddPage(5);
        const setCertFont = () => {
          doc.setFont("Inter_reg");
          doc.setFontSize(10);
        };
        const certLines = drawLeftRight(doc, {
          left: hasContent(cert.certiName) ? cert.certiName.trim() : "",
          right: hasContent(cert.year) ? cert.year.trim() : "",
          x: leftMargin,
          rightX,
          y: yPosition,
          lineHeight: 5,
          setLeftFont: setCertFont,
          setRightFont: setCertFont,
        });
        yPosition += (certLines - 1) * 5;
      });
      addSectionDivider();

    }

    // Project Section
    if (hasValidData(formData.projectDetails, ["year", "projectName"])) {
      addSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName) || hasContent(pro.year)) {
          checkAddPage(20);
          yPosition += 10;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);

          const projectHeader = [pro.projectName, pro.year]
            .filter(hasContent)
            .join(" | ");

          if (projectHeader) {
            doc.splitTextToSize(projectHeader, contentWidth).forEach((line, i) => {
              if (i > 0) yPosition += 5;
              doc.text(line, leftMargin, yPosition);
            });
          }

          if (hasContent(pro.techStack)) {
            doc.setFont("Inter_reg");
            doc.setFontSize(9.5);
            doc.splitTextToSize(pro.techStack, contentWidth).forEach((line) => {
              yPosition += 4.5;
              doc.text(line, leftMargin, yPosition);
            });
          }

          if (hasContent(pro.projectLink)) {
            const clickText = "  -  Link";
            doc.setFontSize(8);
            doc.text(clickText, leftMargin - 2, yPosition + 5);
            doc.link(
              leftMargin - 2,
              yPosition + 3,
              doc.getTextWidth(clickText),
              5,
              { url: toHref(pro.projectLink.trim()) }
            );
          }

          if (hasContent(pro.description)) {
            yPosition += hasContent(pro.projectLink) ? 9 : 5;
            doc.setFont("Inter_reg");
            doc.setFontSize(9);
            const descWrapped = doc.splitTextToSize(pro.description, pageWidth - 2 * leftMargin - 10);
            checkAddPage(descWrapped.length * 4);
            descWrapped.forEach((line, i) => {
              doc.text(line, leftMargin + 5, yPosition + i * 4);
            });
            yPosition += (descWrapped.length - 1) * 4;
          }
        }
      });
      yPosition += 3;
      addSectionDivider();
    }

    // Education Section
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      addSectionHeader("EDUCATION");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.course) || hasContent(edu.collegeName)) {
          checkAddPage(20);
          yPosition += 8;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(edu.course)) {
            doc.splitTextToSize(edu.course, contentWidth).forEach((line, i) => {
              if (i > 0) yPosition += 5;
              doc.text(line, leftMargin, yPosition);
            });
          }

          const eduDetails = [edu.collegeName, edu.location, edu.year]
            .filter(hasContent)
            .join(" | ");

          if (eduDetails) {
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.splitTextToSize(eduDetails, contentWidth).forEach((line, i) => {
              yPosition += i === 0 ? 8 : 5;
              doc.text(line, leftMargin, yPosition);
            });
          }
        }
      });
      addSectionDivider();
    }

    // Skills Section
    const skills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );
    
    if (skills.length > 0) {
      addSectionHeader("SKILLS");

      yPosition += 8;
      doc.setFont("Inter_reg");
      doc.setFontSize(9);

      // Create three columns for skills, filled top to bottom
      const skillsPerColumn = Math.ceil(skills.length / 3);
      const columnWidth = (pageWidth - 2 * leftMargin) / 3;

      for (let row = 0; row < skillsPerColumn; row++) {
        const cells = [0, 1, 2]
          .map((column) => skills[column * skillsPerColumn + row])
          .map((skill) =>
            skill ? doc.splitTextToSize(`• ${skill.skillName.trim()}`, columnWidth - 4) : [],
          );
        const rowLines = Math.max(...cells.map((lines) => lines.length));
        checkAddPage(rowLines * 4);
        cells.forEach((lines, column) => {
          lines.forEach((line, i) => {
            doc.text(line, leftMargin + columnWidth * column, yPosition + i * 4);
          });
        });
        yPosition += (rowLines - 1) * 4 + 8;
      }

      yPosition += 5;
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};