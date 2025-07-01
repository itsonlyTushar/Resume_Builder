import jsPDF from "jspdf";
import Inter_reg from "../../assets/fonts/inter/InterTight_Regular.ttf";
import Inter_bol from "../../assets/fonts/inter/InterTight_Bold.ttf";

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

    // Set mint green background
    doc.setFillColor(230, 242, 236);
    doc.rect(0, 0, pageWidth, 297, "F");

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
      doc.text(fullName, leftMargin, yPosition);

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
        doc.text(contactFields.join(" | "), leftMargin, yPosition);
      }
    }

    // Professional Summary - Only if about text exists
    if (hasContent(details.about)) {
      yPosition += 10;
      const summary = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin
      );
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 3;
      addSectionDivider();
    }

    // Experience Section
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      addSectionHeader("EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          yPosition += 8;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(exp.role)) {
            doc.text(exp.role, leftMargin, yPosition);
          }

          const expDetails = [exp.companyName, exp.location, exp.year]
            .filter(hasContent)
            .join(" | ");

          if (expDetails) {
            yPosition += 5;
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.text(expDetails, leftMargin, yPosition);
          }

          if (hasContent(exp.description)) {
            yPosition += 8;
            const bullets = exp.description.split("•").filter(hasContent);
            bullets.forEach((bullet) => {
              const bulletPoint = `• ${bullet.trim()}`;
              const wrappedBullet = doc.splitTextToSize(
                bulletPoint,
                pageWidth - 2 * leftMargin - 5
              );
              doc.setFontSize(9);
              doc.text(wrappedBullet, leftMargin + 5, yPosition);
              yPosition += wrappedBullet.length * 3;
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
        doc.setFont("Inter_reg");
        doc.setFontSize(10);

        if (hasContent(cert.certiName)) {
          doc.text(cert.certiName, leftMargin, yPosition);
        }

        if (hasContent(cert.year)) {
          doc.text(cert.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }
      });
      addSectionDivider();

    }

    // Project Section
    if (hasValidData(formData.projectDetails, ["year", "projectName"])) {
      addSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName) || hasContent(pro.year)) {
          yPosition += 10;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);

          const projectHeader = [pro.projectName, pro.year]
            .filter(hasContent)
            .join(" | ");

          if (projectHeader) {
            doc.text(projectHeader, leftMargin, yPosition);
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
              { url: pro.projectLink }
            );
          }

          if (hasContent(pro.description)) {
            yPosition += 8;
            doc.setFont("Inter_reg");
            doc.setFontSize(9);
            doc.text(`• ${pro.description}`, leftMargin + 5, yPosition);
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
          yPosition += 8;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(edu.course)) {
            doc.text(edu.course, leftMargin, yPosition);
          }

          const eduDetails = [edu.collegeName, edu.location, edu.year]
            .filter(hasContent)
            .join(" | ");

          if (eduDetails) {
            yPosition += 8;
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.text(eduDetails, leftMargin, yPosition);
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

      // Create three columns for skills
      const skillsPerColumn = Math.ceil(skills.length / 3);
      const columnWidth = (pageWidth - 2 * leftMargin) / 3;
      
      skills.forEach((skill, index) => {
        const columnIndex = Math.floor(index / skillsPerColumn);
        const xPosition = leftMargin + columnWidth * columnIndex;
        const localY = yPosition + (index % skillsPerColumn) * 8;

        doc.text(`• ${skill.skillName}`, xPosition, localY);
      });

      yPosition += skillsPerColumn * 8 + 5;
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};