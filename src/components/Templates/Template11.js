import jsPDF from "jspdf";
import Arvo_reg from "../../assets/fonts/arvo/Arvo_Regular.ttf";
import Arvo_bol from "../../assets/fonts/arvo/Arvo_Bold.ttf";

export const Template11 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const leftMargin = 20;
  let yPosition = 15;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - 2 * leftMargin;
  const bottomMargin = 20;
  const pageHeight = doc.internal.pageSize.height;

  const checkAddPage = (extraSpace = 0) => {
    if (yPosition + extraSpace > pageHeight - bottomMargin) {
      doc.addPage();
      yPosition = 15;
    }
  };

  const details = formData.personalDetails?.[0] || {};

  // Helper function to check if a string has meaningful content
  const hasContent = (str) => str && str.trim().length > 0;

  // Helper function for section headers
  const addSectionHeader = (title) => {
    doc.setFont("Arvo_bol");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 8;
  };

  try {
    // Add fonts
    doc.addFont(Arvo_reg, "Arvo_reg", "normal");
    doc.addFont(Arvo_bol, "Arvo_bol", "normal");
    doc.setFont("Arvo_reg");

    // Header Section - Name (only if name exists)
    const firstName = details.firstName || "";
    const lastName = details.lastName || "";
    if (hasContent(firstName) || hasContent(lastName)) {
      doc.setFont("Arvo_bol");
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      const fullName = `${firstName} ${lastName}`.trim().toUpperCase();
      doc.text(fullName, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 8;
    }

    // Contact Information (only if any contact details exist)
    const contactDetails = [
      details.phoneNumber,
      details.email,
      details.linkedin,
      details.address,
    ].filter(hasContent);

    if (contactDetails.length > 0) {
      doc.setFontSize(10);
      doc.setFont("Arvo_reg");
      const contactInfo = contactDetails.join(" · ");
      doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;
    }

    // Professional Summary (only if about exists)
    if (hasContent(details.about)) {
      addSectionHeader("PROFILE SUMMARY");

      doc.setFont("Arvo_reg");
      doc.setFontSize(10);
      const summary = doc.splitTextToSize(details.about, contentWidth);
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 3 + 9;
    }

    // Skills Section (only if skills exist and have content)
    const validSkills = formData.skills?.filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("STRENGTHS AND EXPERTISE");

      const skillGroups = [];
      const skillsPerRow = 3;
      const columnWidth = contentWidth / 3;

      for (let i = 0; i < validSkills.length; i += skillsPerRow) {
        skillGroups.push(validSkills.slice(i, i + skillsPerRow));
      }

      doc.setFont("Arvo_reg");
      doc.setFontSize(10);

      skillGroups.forEach((row) => {
        row.forEach((skill, colIndex) => {
          const xPos = leftMargin + colIndex * columnWidth;
          doc.text(skill.skillName, xPos, yPosition);
        });
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Experience Section (only if valid experiences exist)
    const validExperiences = formData.experienceDetails?.filter(
      (exp) =>
        hasContent(exp.companyName) ||
        hasContent(exp.role) ||
        hasContent(exp.description)
    );

    if (validExperiences?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("PROFESSIONAL EXPERIENCE");

      validExperiences.forEach((exp) => {
        if (hasContent(exp.companyName)) {
          doc.setFont("Arvo_bol");
          doc.setFontSize(11);
          doc.text(exp.companyName, leftMargin, yPosition);

          if (hasContent(exp.year)) {
            doc.setFont("Arvo_reg");
            doc.text(exp.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
          yPosition += 6;
        }

        if (hasContent(exp.role)) {
          doc.setFont("Arvo_reg");
          doc.text(exp.role, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(exp.description)) {
          const bullets = exp.description.split("•").filter(hasContent);
          bullets.forEach((bullet) => {
            const bulletText = `• ${bullet.trim()}`;
            const wrappedBullet = doc.splitTextToSize(
              bulletText,
              contentWidth - 5
            );
            doc.text(wrappedBullet, leftMargin + 5, yPosition);
            yPosition += wrappedBullet.length * 5;
          });
        }
        yPosition += 2;
      });
    }

    // Education Section (only if valid education entries exist)
    const validEducation = formData.educationDetails?.filter(
      (edu) => hasContent(edu.collegeName) || hasContent(edu.course)
    );

    if (validEducation?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("EDUCATION");

      validEducation.forEach((edu) => {
        if (hasContent(edu.collegeName)) {
          doc.setFontSize(11);
          doc.setFont("Arvo_bol");
          doc.text(edu.collegeName, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(edu.course)) {
          doc.setFont("Arvo_reg");
          doc.text(edu.course, leftMargin, yPosition);

          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
          yPosition += 8;
        }
      });
    }

    // Education Section (only if valid education entries exist)
    const validCertification = formData.certification?.filter(
      (cert) => hasContent(cert.certiName) || hasContent(cert.year)
    );

    if (validCertification?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("CERTIFICATIONS");

      validCertification.forEach((cert) => {
        checkAddPage(8); // Estimate space needed for each cert
        if (hasContent(cert.certiName)) {
          doc.setFontSize(11);
          doc.setFont("Arvo_bol");
          doc.text(cert.certiName, leftMargin, yPosition);
        }

        if (hasContent(cert.year)) {
          doc.setFont("Arvo_reg");
          doc.text(cert.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
          yPosition += 8;
        }
      });
    }

    // Projects Section (only if valid projects exist)
    const validProjects = formData.projectDetails?.filter(
      (proj) =>
        hasContent(proj.projectName) ||
        hasContent(proj.techStack) ||
        hasContent(proj.projectLink)
    );

    if (validProjects?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("PROJECTS");

      validProjects.forEach((proj) => {
        checkAddPage(8); // Estimate space needed for each project
        if (hasContent(proj.projectName)) {
          doc.setFont("Arvo_bol");
          doc.text(proj.projectName, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(proj.techStack)) {
          checkAddPage(6);
          doc.setFont("Arvo_reg");
          doc.text(proj.techStack, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(proj.projectLink)) {
          checkAddPage(8);
          doc.setFontSize(10);
          doc.text(proj.projectLink, leftMargin, yPosition);

          if (hasContent(proj.year)) {
            doc.text(proj.year, pageWidth - leftMargin, yPosition, {
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
