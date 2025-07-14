import jsPDF from "jspdf";
import EB_bol from "../../assets/fonts/lm/Brygada1918-SemiBold.ttf";
import EB_reg from "../../assets/fonts/lm/Brygada1918-Regular.ttf";
import EB_italic from "../../assets/fonts/lm/Brygada1918-Italic.ttf";

export const Template17 = ({ formData }) => {
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
    doc.addFont(EB_bol, "EB_bol", "normal");
    doc.addFont(EB_reg, "EB_reg", "normal");
    doc.addFont(EB_italic, "EB_italic", "normal");

    doc.setFont("EB_bol");
    doc.setFontSize(10);

    const leftMargin = 10;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Get personal details
    const details = formData.personalDetails?.[0] || {};

    // Header - Name (large, centered)
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setFontSize(28);
      doc.setFont("EB_bol", "normal");
      doc.text(
        `${details.firstName || ""} ${details.lastName || ""}`.trim(),
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 6;
    }

    const contactFields = [];

    if (hasContent(details.phoneNumber))
      contactFields.push({ text: details.phoneNumber });
    if (hasContent(details.email)) contactFields.push({ text: details.email });
    if (hasContent(details.linkedin))
      contactFields.push({ text: "LinkedIn", link: details.linkedin });
    if (hasContent(details.github))
      contactFields.push({ text: "GitHub", link: details.github });

    if (contactFields.length > 0) {
      doc.setFontSize(9);
      doc.setFont("EB_bol", "normal");

      // Full text to calculate centered x-position
      const fullText = contactFields.map((f) => f.text).join(" | ");
      const textWidth = doc.getTextWidth(fullText);
      let xCursor = (pageWidth - textWidth) / 2;

      for (let i = 0; i < contactFields.length; i++) {
        const field = contactFields[i];

        if (field.link) {
          // Clickable text (GitHub or LinkedIn)
          doc.textWithLink(field.text, xCursor, yPosition, { url: field.link });
        } else {
          // Regular text (Phone, Email)
          doc.text(field.text, xCursor, yPosition);
        }

        // Advance cursor
        xCursor += doc.getTextWidth(field.text);

        // Add separator if not last
        if (i !== contactFields.length - 1) {
          const sep = " | ";
          doc.text(sep, xCursor, yPosition);
          xCursor += doc.getTextWidth(sep);
        }
      }

      yPosition += 5;
    }

    // Helper function to add section headers with underlines
    const addSectionHeader = (title) => {
      doc.setFont("EB_reg", "normal");
      doc.setFontSize(11);
      doc.text(title, leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );
      yPosition += 9;
    };

    // Helper function to check if new page is needed
    const checkPageBreak = (neededSpace) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 25;
      }
    };

    // Description/About Section
    if (hasContent(details.about)) {
      checkPageBreak(30);
      yPosition += 8;
      addSectionHeader("DESCRIPTION");
      doc.setFont("EB_reg", "normal");
      doc.setFontSize(10);
      const description = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin
      );
      doc.text(description, leftMargin + 3, yPosition - 2);
      yPosition += description.length * 5;
    }

    // Education Section
    const validEducation =
      formData.educationDetails?.filter((edu) =>
        hasAnyContent([edu.collegeName, edu.course, edu.location, edu.year])
      ) || [];

    if (validEducation.length > 0) {
      checkPageBreak(40);
      addSectionHeader("EDUCATION");
      validEducation.forEach((edu) => {
        checkPageBreak(20);
        doc.setFont("EB_bol", "normal");
        doc.setFontSize(10);

        if (hasContent(edu.collegeName)) {
          doc.text(edu.collegeName, leftMargin + 3, yPosition);
        }

        doc.setFont("EB_italic", "normal");
        if (hasContent(edu.location)) {
          doc.setFont("EB_bol", "normal");
          doc.text(edu.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 4;
        doc.setFont("EB_italic", "normal");
        doc.setFontSize(10);

        if (hasContent(edu.course)) {
          doc.text(edu.course, leftMargin + 3, yPosition);
        }

        if (hasContent(edu.year)) {
          doc.text(edu.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 8;
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
      checkPageBreak(40);
      addSectionHeader("PROJECTS");
      validProjects.forEach((pro) => {
        checkPageBreak(20);
        doc.setFont("EB_bol", "normal");
        doc.setFontSize(10);
        if (hasContent(pro.projectName)) {
          doc.text(`${pro.projectName} | `, leftMargin + 3, yPosition);
        }

        // Print Tech Stack in Italic
        if (hasContent(pro.techStack)) {
          const nameWidth = doc.getTextWidth(`${pro.projectName} | `);
          doc.setFont("EB_italic", "normal");
          doc.text(`${pro.techStack}`, leftMargin + 3 + nameWidth, yPosition);
        }

        doc.setFont("EB_reg", "normal");
        if (hasContent(pro.year)) {
          doc.text(pro.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 4;
        doc.setFontSize(9);
        if (hasContent(pro.projectLink)) {
          doc.text(`Live:  ${pro.projectLink}`, leftMargin + 3, yPosition);
        }

        yPosition += 2;
        if (hasContent(pro.description)) {
          yPosition += 8;
          doc.setFontSize(9);

          // Split description into bullet points
          const bullets = pro.description
            .split(".")
            .filter((s) => s.trim().length > 0);

          bullets.forEach((bullet) => {
            checkPageBreak(8);
            const bulletText = doc.splitTextToSize(
              `• ${bullet.trim()}.`,
              pageWidth - 2 * leftMargin - 5
            );
            doc.text(bulletText, leftMargin + 5, yPosition - 5);
            yPosition += bulletText.length * 4;
          });
        }

        yPosition -= 3;
      });
    }

    yPosition += 4;
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
      checkPageBreak(40);
      addSectionHeader("EXPERIENCES");
      validExperiences.forEach((exp) => {
        checkPageBreak(20);
        doc.setFont("EB_bol", "normal");
        doc.setFontSize(10);

        if (hasContent(exp.companyName)) {
          doc.text(exp.companyName, leftMargin + 3, yPosition);
        }

        doc.setFont("EB_italic", "normal");
        if (hasContent(exp.location)) {
          doc.setFont("EB_bol", "normal");
          doc.text(exp.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 4;
        doc.setFont("EB_italic", "normal");
        doc.setFontSize(10);

        if (hasContent(exp.role)) {
          doc.text(exp.role, leftMargin + 3, yPosition);
        }

        if (hasContent(exp.year)) {
          doc.text(exp.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 2;
        if (hasContent(exp.description)) {
          yPosition += 8;
          doc.setFontSize(10);

          // Split description into bullet points
          const bullets = exp.description
            .split(".")
            .filter((s) => s.trim().length > 0);

          bullets.forEach((bullet) => {
            checkPageBreak(8);
            const bulletText = doc.splitTextToSize(
              `• ${bullet.trim()}.`,
              pageWidth - 2 * leftMargin - 5
            );
            doc.text(bulletText, leftMargin + 5, yPosition - 5);
            yPosition += bulletText.length * 4;
          });
        }
        yPosition += 1;
      });
    }

    // Technical Skills Section
    const validSkills =
      formData.skills?.filter((skill) => hasContent(skill.skillName)) || [];

    if (validSkills.length > 0) {
      checkPageBreak(20);
      addSectionHeader("TECHNICAL SKILLS");

      doc.setFont("EB_bol", "normal");
      doc.setFontSize(9);

      // Group skills by category
      const skillCategories = {
        Languages: [],
        "Frameworks & Runtime": [],
        "Libraries & Tools": [],
        Databases: [],
        "Hosting & Infrastructure": [],
      };

      validSkills.forEach((skill) => {
        if (skillCategories[skill.category]) {
          skillCategories[skill.category].push(skill.skillName.trim());
        }
      });

      Object.entries(skillCategories).forEach(([category, skills]) => {
        if (skills.length > 0) {
    
          const skillLine = skills.join(", ");
          const wrappedSkills = doc.splitTextToSize(
            skillLine,
            pageWidth - 2 * leftMargin - 5
          );
          doc.text(`${category}:  ${wrappedSkills}`, leftMargin + 3, yPosition);
          yPosition += wrappedSkills.length * 5;
        }
      });

      yPosition += 5;
    }

    // Certifications Section
    const certifications =
      formData.certification?.filter((cert) =>
        hasAnyContent([cert.certiName, cert.year])
      ) || [];

    if (certifications.length > 0) {
      addSectionHeader("CERTIFICATIONS & ACHIVEMENTS");
      certifications.forEach((cert) => {
        doc.setFont("EB_reg", "normal");
        doc.setFontSize(10);

        if (hasContent(cert.certiName)) {
          doc.text(cert.certiName, leftMargin + 3, yPosition);
        }

        if (hasContent(cert.year)) {
          doc.text(cert.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }
        yPosition += 5;
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
