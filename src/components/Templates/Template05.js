import roboto_reg from "../../assets/fonts/roboto/Roboto_Regular.ttf";
import roboto_bol from "../../assets/fonts/roboto/Roboto_Medium.ttf";
import jsPDF from "jspdf";

export const Template05 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts - Using Roboto for optimal ATS readability
    doc.addFont(roboto_reg, "roboto_reg", "normal");
    doc.addFont(roboto_bol, "roboto_bol", "normal");
    doc.setFont("roboto_reg");

    // Initialize basic layout parameters
    const leftMargin = 20;
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * leftMargin;

    const details = formData.personalDetails?.[0] || {};

    // Helper function to check if a string has meaningful content
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function for section headers
    const addSectionHeader = (title) => {
      doc.setFont("roboto_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), leftMargin, yPosition);
      yPosition += 2;
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 5;
    };

    // Header Section - Only display if name exists
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setFontSize(22);
      doc.setFont("roboto_bol");
      const fullName = [details.firstName || "", details.lastName || ""]
        .filter(Boolean)
        .join(" ")
        .toUpperCase();
      doc.text(fullName, leftMargin, yPosition);
    }

    // Contact Information - Only display if any contact info exists
    const contactFields = [
      details.email,
      details.phoneNumber,
      details.linkedin,
      details.location,
    ].filter(hasContent);

    if (contactFields.length > 0) {
      yPosition += 8;
      doc.setFont("roboto_reg");
      doc.setFontSize(10);
      const contactInfo = contactFields.join(" | ");
      doc.text(contactInfo, leftMargin, yPosition);
    }

    // Professional Summary - Only display if about text exists
    if (hasContent(details.about)) {
      yPosition += 12;
      addSectionHeader("Professional Summary");
      doc.setFont("roboto_reg");
      doc.setFontSize(10);
      const summary = doc.splitTextToSize(details.about, contentWidth);
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 5 + 5;
    }

    // Core Competencies/Skills Section - Only display if skills exist and have names
    const validSkills =
      formData.skills?.filter((skill) => hasContent(skill.skillName)) || [];
    if (validSkills.length > 0) {
      yPosition += 8;
      addSectionHeader("Core Competencies");
      doc.setFont("roboto_reg");
      doc.setFontSize(10);

      const skillsLine = validSkills
        .map((skill) => skill.skillName.trim())
        .join(" • ");

      const wrappedSkills = doc.splitTextToSize(skillsLine, contentWidth - 5);
      doc.text(wrappedSkills, leftMargin, yPosition);
      yPosition += wrappedSkills.length * 5 + 3;
    }

    // Professional Experience - Only display if valid experiences exist
    const validExperiences =
      formData.experienceDetails?.filter(
        (exp) =>
          hasContent(exp.role) ||
          hasContent(exp.companyName) ||
          hasContent(exp.description)
      ) || [];

    if (validExperiences.length > 0) {
      yPosition += 5;
      addSectionHeader("Professional Experience");

      validExperiences.forEach((exp) => {
        if (hasContent(exp.role)) {
          doc.setFont("roboto_bol");
          doc.setFontSize(11);
          doc.text(exp.role, leftMargin, yPosition);
        }

        if (hasContent(exp.year)) {
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          doc.text(exp.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 5;

        if (hasContent(exp.companyName)) {
          doc.text(exp.companyName, leftMargin, yPosition);
        }

        if (hasContent(exp.location)) {
          doc.text(exp.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
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
            doc.text(wrappedBullet, leftMargin + 5, yPosition);
            yPosition += wrappedBullet.length * 5;
          });
        }
        yPosition += 5;
      });
    }

    // Certifications

    const certifications =
      formData.certification?.filter(
        (cert) => hasContent(cert.year) || hasContent(cert.certiName)
      ) || [];

    if (certifications.length > 0) {
      doc.setFont("roboto_bol");
      
      addSectionHeader("Certifications");
      certifications.forEach((cert) => {
        yPosition += 6;
        doc.setFont("roboto_reg");
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

      yPosition += 8;
    }

    // Projects Section - Only display if valid projects exist
    const validProjects =
      formData.projectDetails?.filter(
        (project) =>
          hasContent(project.projectName) || hasContent(project.description)
      ) || [];

    if (validProjects.length > 0) {
      yPosition += 5;
      addSectionHeader("Technical Projects");

      validProjects.forEach((project) => {
        if (hasContent(project.projectName)) {
          doc.setFont("roboto_bol");
          doc.setFontSize(11);
          doc.text(project.projectName, leftMargin, yPosition);
        }

        if (hasContent(project.year)) {
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          doc.text(project.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        if (hasContent(project.description)) {
          yPosition += 5;
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          const wrappedDesc = doc.splitTextToSize(
            project.description,
            contentWidth - 5
          );
          doc.text(wrappedDesc, leftMargin, yPosition);
          yPosition += wrappedDesc.length * 5;
        }

        if (hasContent(project.techStack)) {
          yPosition += 4;
          const techStackText = `Technologies: ${project.techStack}`;
          const wrappedTech = doc.splitTextToSize(
            techStackText,
            contentWidth - 5
          );
          doc.text(wrappedTech, leftMargin, yPosition);
          yPosition += wrappedTech.length * 5;
        }

        if (hasContent(project.projectLink)) {
          const clickText = "Link";
          doc.text(clickText, leftMargin, yPosition);
          doc.link(leftMargin, yPosition - 3, doc.getTextWidth(clickText), 5, {
            url: project.projectLink,
          });
        }

        yPosition += 8;
      });
    }

    // Education Section - Only display if valid education entries exist
    const validEducation =
      formData.educationDetails?.filter(
        (edu) => hasContent(edu.course) || hasContent(edu.collegeName)
      ) || [];

    if (validEducation.length > 0) {
      yPosition += 5;
      addSectionHeader("Education");

      validEducation.forEach((edu) => {
        if (hasContent(edu.course)) {
          doc.setFont("roboto_bol");
          doc.setFontSize(11);
          doc.text(edu.course, leftMargin, yPosition);
        }

        if (hasContent(edu.year)) {
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          doc.text(edu.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 5;

        if (hasContent(edu.collegeName) || hasContent(edu.location)) {
          doc.setFont("roboto_reg");
          const eduLocation = [edu.collegeName, edu.location]
            .filter(hasContent)
            .join(", ");
          doc.text(eduLocation, leftMargin, yPosition);
        }
        yPosition += 8;
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
