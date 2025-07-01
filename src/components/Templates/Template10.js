import jsPDF from "jspdf";
import merium_bol from "../../assets/fonts/merrium/Merriweather_Bold.ttf";
import merium_reg from "../../assets/fonts/merrium/Merriweather_Regular.ttf";

export const Template10 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts
    doc.addFont(merium_reg, "merium_reg", "normal");
    doc.addFont(merium_bol, "merium_bol", "normal");
    doc.setFont("merium_reg");

    // Layout constants that define our two-column structure
    const leftColumnWidth = 70;
    const rightColumnStart = leftColumnWidth + 10;
    let leftYPosition = 20;
    let rightYPosition = 20;
    const pageWidth = doc.internal.pageSize.width;

    // Helper function to check if a string has meaningful content
    // This ensures we only display fields that have actual text
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to check if a section has valid data
    // This prevents empty sections from being displayed
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

    // Helper function to add right column section headers
    // Ensures consistent formatting for all right column sections
    const addRightSectionHeader = (title) => {
      rightYPosition += 6;
      doc.setFont("merium_bol");
      doc.setFontSize(14);
      doc.text(title, rightColumnStart, rightYPosition);
      rightYPosition += 10;
    };

    const details = formData.personalDetails?.[0] || {};

    // Left Column Background - This creates the distinctive dark blue sidebar
    doc.setFillColor(9, 18, 44);
    doc.rect(0, 0, leftColumnWidth, 297, "F");

    // Name Section - Only display if there's actual content
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("merium_bol");
      doc.setFontSize(20);
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .trim();
      doc.text(fullName, 10, leftYPosition);
      leftYPosition += 10;
    }

    // Contact Information - Only display non-empty contact details
    const contactInfo = [
      details.phoneNumber,
      details.email,
      details.linkedin,
    ].filter(hasContent);

    if (contactInfo.length > 0) {
      doc.setFontSize(10);
      doc.setFont("merium_reg");
      contactInfo.forEach((info) => {
        doc.text(info, 10, leftYPosition);
        leftYPosition += 6;
      });
    }

    // Skills Section - Only display if valid skills exist
    const validSkills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills.length > 0) {
      leftYPosition += 10;
      doc.setFont("merium_bol");
      doc.text("Skills", 10, leftYPosition);
      leftYPosition += 6;

      doc.setFont("merium_reg");
      validSkills.forEach((skill) => {
        doc.text(`• ${skill.skillName}`, 10, leftYPosition);
        leftYPosition += 5;
      });
    }

    // Right Column Content - Switch to dark blue text
    doc.setTextColor(9, 18, 44);

    // Experience Section - Only display if valid experience exists
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      addRightSectionHeader("Experience");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          doc.setFont("merium_bol");
          doc.setFontSize(11);
          if (hasContent(exp.role)) {
            doc.text(exp.role, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          doc.setFont("merium_reg");
          doc.setFontSize(10);
          if (hasContent(exp.companyName)) {
            doc.text(exp.companyName, rightColumnStart, rightYPosition);
          }
          if (hasContent(exp.year)) {
            doc.text(exp.year, pageWidth - 15, rightYPosition, {
              align: "right",
            });
          }
          rightYPosition += 6;

          if (hasContent(exp.description)) {
            const desc = doc.splitTextToSize(
              exp.description,
              pageWidth - rightColumnStart - 15
            );
            doc.text(desc, rightColumnStart, rightYPosition);
            rightYPosition += desc.length * 5 + 5;
          }
        }
      });
    }

    // Certification in Right Column
    if (hasValidData(formData.certification, ["certiName", "year"])) {
      addRightSectionHeader("Certifications");

      formData.certification.forEach((cert) => {
        if (hasContent(cert.certiName) || hasContent(cert.year)) {
          if (hasContent(cert.certiName)) {
            doc.setFont("merium_bol");
            doc.setFontSize(11);
            doc.text(cert.certiName, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          if (hasContent(cert.year)) {
            doc.setFont("merium_reg");
            doc.setFontSize(10);
            doc.text(
              cert.year,
              pageWidth - rightColumnStart + 40,
              rightYPosition - 6
            );

            rightYPosition += 2;
          }
        }
      });
    }

    // Education Section - Only display if valid education exists
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      addRightSectionHeader("Education");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.course) || hasContent(edu.collegeName)) {
          doc.setFont("merium_bol");
          doc.setFontSize(12);
          if (hasContent(edu.course)) {
            doc.text(edu.course, rightColumnStart, rightYPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - 15, rightYPosition, {
              align: "right",
            });
          }
          rightYPosition += 6;

          doc.setFont("merium_reg");
          doc.setFontSize(10);
          const eduLocation = [edu.collegeName, edu.location]
            .filter(hasContent)
            .join(", ");
          if (eduLocation) {
            doc.text(eduLocation, rightColumnStart, rightYPosition);
          }
          rightYPosition += 8;
        }
      });
    }

    // Projects Section - Only display if valid projects exist
    if (hasValidData(formData.projectDetails, ["projectName"])) {
      addRightSectionHeader("Projects");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName)) {
          doc.setFont("merium_bol");
          doc.setFontSize(12);
          doc.text(pro.projectName, rightColumnStart, rightYPosition);
          if (hasContent(pro.year)) {
            doc.text(pro.year, pageWidth - 15, rightYPosition, {
              align: "right",
            });
          }
          rightYPosition += 6;

          doc.setFont("merium_reg");
          doc.setFontSize(9);

          if (hasContent(pro.projectLink)) {
            doc.text(pro.projectLink, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          if (hasContent(pro.techStack)) {
            doc.setFontSize(10);
            doc.text(
              `Tech Used: ${pro.techStack}`,
              rightColumnStart,
              rightYPosition
            );
          }

          rightYPosition += 8;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
