import jsPDF from "jspdf";
import Playflair from "../../assets/fonts/playfair/PlayfairDisplay-VariableFont_wght.ttf";

export const Template04 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Helper function to check if content exists and is not empty
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to validate if any field in an array of fields has content
    const hasAnyContent = (fields) => fields.some((field) => hasContent(field));

    // Reset the document and set initial styles
    doc.addFont(Playflair, "Playfair", "normal");
    doc.setFont("Playfair");
    doc.setFontSize(10);

    const leftMargin = 20;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;

    // Get personal details
    const details = formData.personalDetails?.[0] || {};

    // Header - Name (only display if either first or last name exists)
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setFontSize(24);
      doc.setFont("Playfair", "bold");
      doc.text(
        `${details.firstName || ""} ${details.lastName || ""}`.trim(),
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 10;
    }

    // Contact Information (only display if any contact info exists)
    const contactFields = [
      details.address,
      details.phoneNumber,
      details.email,
      details.linkedin,
    ].filter(hasContent);

    if (contactFields.length > 0) {
      doc.setFontSize(10);
      doc.setFont("Playfair", "normal");
      const contactInfo = contactFields.join(" • ");
      doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 5;
    }

    // About Section
    if (hasContent(details.about)) {
      yPosition += 10;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(16);
      doc.text("About Me", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      yPosition += 8;
      doc.setFont("Playfair", "normal");
      doc.setFontSize(11);
      const description = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin
      );
      doc.text(description, leftMargin, yPosition);
      yPosition += description.length * 5;
    }

    // Education Section
    const validEducation =
      formData.educationDetails?.filter((edu) =>
        hasAnyContent([edu.collegeName, edu.course, edu.location, edu.year])
      ) || [];

    if (validEducation.length > 0) {
      yPosition += 5;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(16);
      doc.text("Education", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      validEducation.forEach((edu) => {
        yPosition += 8;
        doc.setFont("Playfair", "bold");
        doc.setFontSize(12);

        if (hasContent(edu.collegeName)) {
          doc.text(edu.collegeName, leftMargin, yPosition);
        }

        if (hasContent(edu.location)) {
          doc.setFont("Playfair", "normal");
          doc.text(edu.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        if (hasContent(edu.course) || hasContent(edu.year)) {
          yPosition += 6;
          if (hasContent(edu.course)) {
            doc.text(edu.course, leftMargin, yPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
        }
      });
    }

    // Experience Section
    const validExperiences =
      formData.experienceDetails?.filter((exp) =>
        hasAnyContent([
          exp.role,
          exp.companyName,
          exp.location,
          exp.year,
          exp.description,
        ])
      ) || [];

    if (validExperiences.length > 0) {
      yPosition += 10;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(16);
      doc.text("Experience", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      validExperiences.forEach((exp) => {
        yPosition += 8;
        doc.setFont("Playfair", "bold");
        doc.setFontSize(12);

        if (hasContent(exp.role)) {
          doc.text(exp.role, leftMargin, yPosition);
        }

        if (hasContent(exp.location)) {
          doc.text(exp.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        if (hasContent(exp.companyName) || hasContent(exp.year)) {
          yPosition += 6;
          doc.setFont("Playfair", "normal");
          if (hasContent(exp.companyName)) {
            doc.text(exp.companyName, leftMargin, yPosition);
          }
          if (hasContent(exp.year)) {
            doc.text(exp.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
        }

        if (hasContent(exp.description)) {
          yPosition += 6;
          const description = doc.splitTextToSize(
            exp.description,
            pageWidth - 2 * leftMargin
          );
          doc.text(description, leftMargin, yPosition);
          yPosition += description.length * 5;
        }
      });
    }

    // Certifications Sections
    const certifications =
      formData.certification?.filter((cert) =>
        hasAnyContent([cert.certiName, cert.year])
      ) || [];

    if (certifications.length > 0) {
      yPosition += 10;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(16);
      doc.text("Certifications", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      certifications.forEach((cert) => {
        yPosition += 8;
        doc.setFont("Playfair", "bold");
        doc.setFontSize(12);

        if (hasContent(cert.certiName)) {
          doc.text(cert.certiName, leftMargin, yPosition);
        }

        if (hasContent(cert.year)) {
          doc.text(cert.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }
      });
    }

    // Projects Section
    const validProjects =
      formData.projectDetails?.filter((project) =>
        hasAnyContent([
          project.projectName,
          project.description,
          project.techStack,
          project.projectLink,
          project.year,
        ])
      ) || [];

    if (validProjects.length > 0) {
      yPosition += 10;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(16);
      doc.text("Projects", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      validProjects.forEach((project) => {
        yPosition += 8;
        doc.setFont("Playfair", "bold");
        doc.setFontSize(12);

        if (hasContent(project.projectName)) {
          doc.text(project.projectName, leftMargin, yPosition);
        }

        if (hasContent(project.year)) {
          doc.text(project.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        if (hasContent(project.description)) {
          yPosition += 6;
          doc.setFont("Playfair", "normal");
          const description = doc.splitTextToSize(
            project.description,
            pageWidth - 2 * leftMargin
          );
          doc.text(description, leftMargin, yPosition);
          yPosition += description.length * 5;
        }

        if (hasContent(project.techStack)) {
          yPosition += 6;
          doc.setFontSize(10);
          doc.text(`Technologies: ${project.techStack}`, leftMargin, yPosition);
        }

        if (hasContent(project.projectLink)) {
          doc.setFont("Playfair", "normal");

          yPosition += 5;
          doc.text(`Link: ${project.projectLink}`, leftMargin, yPosition);
        }
      });
    }

    // Skills Section
    const validSkills =
      formData.skills?.filter((skill) => hasContent(skill.skillName)) || [];

    if (validSkills.length > 0) {
      yPosition += 10;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(16);
      doc.text("Additional", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      yPosition += 10;
      doc.setFont("Playfair", "bold");
      doc.setFontSize(12);
      doc.text("Technical Skills:", leftMargin, yPosition);

      const skills = validSkills
        .map((skill) => skill.skillName.trim())
        .join(", ");

      doc.setFont("Playfair", "normal");
      doc.setFontSize(10);
      yPosition += 6;
      const wrappedSkills = doc.splitTextToSize(
        skills,
        pageWidth - 2 * leftMargin
      );
      doc.text(wrappedSkills, leftMargin, yPosition);
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
