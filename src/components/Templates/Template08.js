import oxam from "../../assets/fonts/poppins/Oxanium_SemiBold.ttf";
import jsPDF from "jspdf";
import Inter_reg from "../../assets/fonts/inter/InterTight_Regular.ttf";
import Inter_bol from "../../assets/fonts/inter/InterTight_Bold.ttf";

export const Template08 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts
    doc.addFont(Inter_reg, "Inter_reg", "normal");
    doc.addFont(Inter_bol, "Inter_bol", "normal");
    doc.addFont(oxam, "oxam", "normal");
    doc.setFont("oxam");

    // Layout constants
    const leftMargin = 15;
    const rightColumnStart = 70;
    let leftYPosition = 20;
    let rightYPosition = 20;
    const pageWidth = doc.internal.pageSize.width;

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

    // Helper function to add right column section header
    const addRightSectionHeader = (title) => {
      rightYPosition += 6;
      doc.setFont("Inter_bol");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), rightColumnStart, rightYPosition);
      rightYPosition += 10;
    };

    const details = formData.personalDetails?.[0] || {};

    // Left Column - Dark background for sidebar
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, rightColumnStart - 5, 297, "F");

    // Sidebar - Name and Contact (only if there's content)
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("oxam");
      doc.setFontSize(20);
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .toUpperCase();
      doc.text(fullName, 10, leftYPosition);
      leftYPosition += 10;
    }

    // Contact Details (only if there's content)
    const contactInfo = [
      details.phoneNumber,
      details.email,
      details.linkedin,
    ].filter(hasContent);

    if (contactInfo.length > 0) {
      doc.setFont("Inter_reg");
      doc.setFontSize(10);
      contactInfo.forEach((info) => {
        doc.text(info, 10, leftYPosition);
        leftYPosition += 6;
      });
    }

    // Skills in Sidebar (only if there's content)
    const validSkills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills.length > 0) {
      leftYPosition += 10;
      doc.setFont("Inter_bol");
      doc.text("SKILLS", 10, leftYPosition);
      leftYPosition += 6;

      doc.setFont("Inter_reg");
      validSkills.forEach((skill) => {
        doc.text(`• ${skill.skillName}`, 10, leftYPosition);
        leftYPosition += 5;
      });
    }

    // Experience in Right Column
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      doc.setTextColor(0, 0, 0);
      addRightSectionHeader("EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(exp.role)) {
            doc.text(exp.role, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          doc.setFont("Inter_reg");
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
            const wrappedDescription = doc.splitTextToSize(
              exp.description,
              pageWidth - rightColumnStart - 15
            );
            doc.setFontSize(10);
            doc.text(wrappedDescription, rightColumnStart, rightYPosition);
            rightYPosition += wrappedDescription.length * 5 + 5;
          }
        }
      });
    }

    // Certification in Right Column
    if (hasValidData(formData.certification, ["certiName", "year"])) {
      addRightSectionHeader("CERTIFICATIONS");

      formData.certification.forEach((cert) => {
        if (hasContent(cert.certiName) || hasContent(cert.year)) {
          if (hasContent(cert.certiName)) {
            doc.setFont("Inter_bol");
            doc.setFontSize(11);
            doc.text(cert.certiName, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }


          if (hasContent(cert.year)) {
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.text(
              cert.year,
              pageWidth - rightColumnStart + 40,
              rightYPosition - 6
            );

             rightYPosition += 2
             
       
          }
        }
      });
    }

    // Education in Right Column
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      addRightSectionHeader("EDUCATION");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.collegeName) || hasContent(edu.course)) {
          if (hasContent(edu.collegeName)) {
            doc.setFont("Inter_bol");
            doc.setFontSize(12);
            doc.text(edu.collegeName, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          doc.setFont("Inter_reg");
          doc.setFontSize(10);
          if (hasContent(edu.course)) {
            doc.text(edu.course, rightColumnStart, rightYPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - 15, rightYPosition, {
              align: "right",
            });
          }
          rightYPosition += 6;

          if (hasContent(edu.location)) {
            const wrappedLocation = doc.splitTextToSize(
              edu.location,
              pageWidth - rightColumnStart - 15
            );
            doc.text(wrappedLocation, rightColumnStart, rightYPosition);
            rightYPosition += wrappedLocation.length * 5 + 5;
          }
        }
      });
    }

    // Projects in Right Column
    if (hasValidData(formData.projectDetails, ["projectName"])) {
      addRightSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName)) {
          rightYPosition += 6;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          doc.text(pro.projectName, rightColumnStart, rightYPosition);
          rightYPosition += 6;

          doc.setFont("Inter_reg");
          doc.setFontSize(10);

          if (hasContent(pro.projectLink)) {
            doc.text(pro.projectLink, rightColumnStart, rightYPosition);
          }

          if (hasContent(pro.techStack)) {
            doc.text(
              `Techstack : ${pro.techStack}`,
              rightColumnStart,
              rightYPosition + 5
            );
          }

          if (hasContent(pro.year)) {
            doc.text(pro.year, pageWidth - 15, rightYPosition, {
              align: "right",
            });
          }
          rightYPosition += 6;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};