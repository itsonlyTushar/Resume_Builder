import Poppins_reg from "../../assets/fonts/poppins/Poppins_Regular.ttf";
import Poppins_bol from "../../assets/fonts/poppins/Poppins_SemiBold.ttf";
import jsPDF from "jspdf";

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
      checkAddPage(17); // Estimate space for header
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
      doc.text(fullName, leftMargin, yPosition);

      // Contact Information - Only display if any contact info exists
      const contactInfo = [details.address, details.email, details.linkedin]
        .filter(hasContent)
        .join(" | ");

      if (contactInfo) {
        yPosition += 8;
        checkAddPage(8);
        doc.setFont("Poppins_reg");
        doc.setFontSize(10);
        doc.text(contactInfo, leftMargin, yPosition);
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
      const maxRows = Math.max(...skillGroups.map((g) => g.length));
      checkAddPage(maxRows * 6 + 5);

      skillGroups.forEach((group, index) => {
        const xPos = leftMargin + index * columnWidth;
        let localY = yPosition;

        group.forEach((skill) => {
          doc.text(skill.skillName, xPos, localY);
          localY += 6;
        });
      });

      yPosition += maxRows * 6 + 5;
    }

    // Professional Experience Section - Only display if valid experience exists
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      yPosition += 5;
      checkAddPage(17);
      addSectionHeader("PROFESSIONAL EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          checkAddPage(20);
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          if (hasContent(exp.role)) {
            doc.text(exp.role, leftMargin, yPosition);
          }
          if (hasContent(exp.year)) {
            doc.text(exp.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

          if (hasContent(exp.companyName)) {
            yPosition += 6;
            checkAddPage(6);
            doc.setFont("Poppins_reg");
            doc.text(exp.companyName, leftMargin, yPosition);
          }

          if (hasContent(exp.description)) {
            yPosition += 6;
            const bullets = exp.description.split("•").filter(hasContent);
            bullets.forEach((bullet) => {
              const bulletText = `• ${bullet.trim()}`;
              const wrappedBullet = doc.splitTextToSize(
                bulletText,
                contentWidth - 5
              );
              checkAddPage(wrappedBullet.length * 5);
              doc.text(wrappedBullet, leftMargin + 5, yPosition);
              yPosition += wrappedBullet.length * 5;
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
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          if (hasContent(edu.course)) {
            doc.text(edu.course, leftMargin, yPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

          if (hasContent(edu.collegeName)) {
            yPosition += 6;
            checkAddPage(6);
            doc.setFont("Poppins_reg");
            doc.text(edu.collegeName, leftMargin, yPosition);
          }

          if (hasContent(edu.location)) {
            yPosition += 5;
            checkAddPage(5);
            doc.setFontSize(10);
            doc.text(edu.location, leftMargin, yPosition);
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
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          doc.text(pro.projectName, leftMargin, yPosition);

          if (hasContent(pro.year)) {
            doc.text(pro.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

          if (hasContent(pro.techStack)) {
            yPosition += 5;
            checkAddPage(5);
            doc.setFont("Poppins_reg");
            doc.setFontSize(9);
            doc.text(pro.techStack, leftMargin, yPosition);
          }

          if (hasContent(pro.projectLink)) {
            yPosition += 6;
            doc.setFontSize(8);
            doc.setFont("Poppins_reg");
            doc.text(pro.projectLink, leftMargin, yPosition);
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
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          doc.text(cert.certiName, leftMargin, yPosition);

          if (hasContent(cert.year)) {
            doc.text(cert.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

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
