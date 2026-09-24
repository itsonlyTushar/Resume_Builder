import Poppins_reg from "../../assets/fonts/poppins/Poppins_Regular.ttf";
import Poppins_bol from "../../assets/fonts/poppins/Poppins_SemiBold.ttf";
import jsPDF from "jspdf";
import { drawLeftRight, splitBullets, toHref, wrapItems } from "./templateHelpers";

export const Template09 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts
    doc.addFont(Poppins_reg, "Poppins_reg", "normal");
    doc.addFont(Poppins_bol, "Poppins_bol", "normal");
    doc.setFont("Poppins_reg");

    // Layout constants
    const leftMargin = 20;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * leftMargin;
    const rightX = pageWidth - leftMargin;
    const bottomMargin = 20;
    const pageHeight = doc.internal.pageSize.height;

    // Add this function:
    const checkAddPage = (extraSpace = 0) => {
      if (yPosition + extraSpace > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = 15; // Reset to your top margin
      }
    };

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

    // Helper function for section headers with gray background
    const addSectionHeader = (title) => {
      checkAddPage(30); // header plus the first entry below it
      doc.setFillColor(240, 240, 240);
      doc.rect(
        leftMargin - 5,
        yPosition - 5,
        pageWidth - 2 * (leftMargin - 5),
        10,
        "F"
      );
      doc.setFont("Poppins_bol");
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      doc.text(title.toUpperCase(), leftMargin, yPosition + 2);
      yPosition += 12;
    };

    // Bold title on the left, date on the right; returns the lines the title took
    const drawTitleRow = (title, date) =>
      drawLeftRight(doc, {
        left: hasContent(title) ? title.trim() : "",
        right: hasContent(date) ? date.trim() : "",
        x: leftMargin,
        rightX,
        y: yPosition,
        lineHeight: 5.5,
        setLeftFont: () => {
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
        },
        setRightFont: () => {
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
        },
      });

    // Wrapped lines, each starting `gap` mm below the previous one
    const drawLines = (text, gap) => {
      doc.splitTextToSize(text, contentWidth).forEach((line) => {
        yPosition += gap;
        checkAddPage(0);
        doc.text(line, leftMargin, yPosition);
      });
    };

    const details = formData.personalDetails?.[0] || {};

    // Header Section - Only display if name exists
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      checkAddPage(12);
      doc.setFont("Poppins_bol");
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .toUpperCase();
      doc.splitTextToSize(fullName, contentWidth).forEach((line, i) => {
        if (i > 0) yPosition += 10;
        doc.text(line, leftMargin, yPosition);
      });

      // Contact Information - Only display if any contact info exists
      const contactItems = [details.phoneNumber, details.email, details.linkedin]
        .filter(hasContent)
        .map((item) => item.trim());

      if (contactItems.length > 0) {
        yPosition += 8;
        checkAddPage(8);
        doc.setFont("Poppins_reg");
        doc.setFontSize(10);
        wrapItems(doc, contactItems, " | ", contentWidth).forEach((line, i) => {
          if (i > 0) yPosition += 5;
          doc.text(line, leftMargin, yPosition);
        });
      }
    }

    // Summary Section - Only display if about text exists
    if (hasContent(details.about)) {
      yPosition += 12;
      const summary = doc.splitTextToSize(details.about, contentWidth);
      checkAddPage(summary.length * 5 + 17);
      addSectionHeader("SUMMARY");
      doc.setFont("Poppins_reg");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 5 + 5;
    }

    // Technical Skills Section - Only display if valid skills exist
    const validSkills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills.length > 0) {
      yPosition += 5;
      checkAddPage(17);
      addSectionHeader("TECHNICAL SKILLS");

      // Create three columns for skills
      const skillGroups = [];
      const skillsPerColumn = Math.ceil(validSkills.length / 3);

      for (let i = 0; i < validSkills.length; i += skillsPerColumn) {
        skillGroups.push(validSkills.slice(i, i + skillsPerColumn));
      }

      doc.setFont("Poppins_reg");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const columnWidth = contentWidth / 3;
      const columns = skillGroups.map((group) =>
        group.map((skill) => doc.splitTextToSize(skill.skillName.trim(), columnWidth - 4)),
      );
      // each skill takes its wrapped lines at 4.5mm plus the original 6mm step
      const columnHeight = (column) =>
        column.reduce((sum, lines) => sum + (lines.length - 1) * 4.5 + 6, 0);
      const skillsHeight = Math.max(...columns.map(columnHeight));
      checkAddPage(skillsHeight + 5);

      columns.forEach((column, index) => {
        const xPos = leftMargin + index * columnWidth;
        let localY = yPosition;

        column.forEach((lines) => {
          lines.forEach((line, i) => doc.text(line, xPos, localY + i * 4.5));
          localY += (lines.length - 1) * 4.5 + 6;
        });
      });

      yPosition += skillsHeight + 5;
    }

    // Professional Experience Section - Only display if valid experience exists
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      yPosition += 5;
      checkAddPage(17);
      addSectionHeader("PROFESSIONAL EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          checkAddPage(20);
          yPosition += (drawTitleRow(exp.role, exp.year) - 1) * 5.5;

          if (hasContent(exp.companyName)) {
            doc.setFont("Poppins_reg");
            doc.setFontSize(11);
            drawLines(exp.companyName, 6);
          }

          if (hasContent(exp.location)) {
            doc.setFont("Poppins_reg");
            doc.setFontSize(10);
            drawLines(exp.location, 5);
          }

          if (hasContent(exp.description)) {
            yPosition += 6;
            doc.setFont("Poppins_reg");
            doc.setFontSize(11);
            splitBullets(exp.description).forEach((bullet) => {
              const bulletText = `• ${bullet}`;
              const wrappedBullet = doc.splitTextToSize(
                bulletText,
                contentWidth - 5
              );
              wrappedBullet.forEach((line) => {
                checkAddPage(5);
                doc.text(line, leftMargin + 5, yPosition);
                yPosition += 5;
              });
            });
          }
          yPosition += 5;
        }
      });
    }

    // Education Section - Only display if valid education exists
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      yPosition += 5;
      checkAddPage(17);
      addSectionHeader("EDUCATION");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.course) || hasContent(edu.collegeName)) {
          checkAddPage(19);
          yPosition += (drawTitleRow(edu.course, edu.year) - 1) * 5.5;

          if (hasContent(edu.collegeName)) {
            doc.setFont("Poppins_reg");
            doc.setFontSize(11);
            drawLines(edu.collegeName, 6);
          }

          if (hasContent(edu.location)) {
            doc.setFont("Poppins_reg");
            doc.setFontSize(10);
            drawLines(edu.location, 5);
          }

          yPosition += 8;
        }
      });
    }

    // Projects Section - Only display if valid projects exist
    if (hasValidData(formData.projectDetails, ["projectName"])) {
      yPosition += 5;
      checkAddPage(17);
      addSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName)) {
          checkAddPage(19);
          yPosition += (drawTitleRow(pro.projectName, pro.year) - 1) * 5.5;

          if (hasContent(pro.techStack)) {
            doc.setFont("Poppins_reg");
            doc.setFontSize(9);
            drawLines(pro.techStack, 5);
          }

          if (hasContent(pro.description)) {
            yPosition += 5;
            doc.setFont("Poppins_reg");
            doc.setFontSize(9);
            const desc = doc.splitTextToSize(pro.description, contentWidth - 5);
            checkAddPage(desc.length * 4);
            doc.text(desc, leftMargin, yPosition);
            yPosition += desc.length * 4;
          }

          if (hasContent(pro.projectLink)) {
            doc.setFontSize(8);
            doc.setFont("Poppins_reg");
            doc.setTextColor(0, 102, 204);
            const url = toHref(pro.projectLink.trim());
            doc.splitTextToSize(pro.projectLink.trim(), contentWidth).forEach((line) => {
              yPosition += 4;
              doc.textWithLink(line, leftMargin, yPosition, { url });
            });
            doc.setTextColor(0, 0, 0);
          }

          yPosition += 8;
        }
      });
    }

    // Certifications Section - Only display if valid certifications exist
    if (hasValidData(formData.certification, ["certiName"])) {
      yPosition += 5;
      checkAddPage(17);
      addSectionHeader("CERTIFICATIONS");

      formData.certification.forEach((cert) => {
        if (hasContent(cert.certiName)) {
          checkAddPage(19);
          yPosition += (drawTitleRow(cert.certiName, cert.year) - 1) * 5.5;

          yPosition += 8;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
