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
    
    // Define line heights for different font sizes
    const lineHeights = {
      9: 4,   // Small text: 4mm between lines
      10: 4.5, // Regular text: 4.5mm between lines
      11: 5,   // Section headers: 5mm between lines
      28: 10   // Name header: 10mm
    };

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

        // Handle potentially long college names
        if (hasContent(edu.collegeName)) {
          const maxWidth = hasContent(edu.location) 
            ? pageWidth - leftMargin * 2 - 50  // Leave space for location
            : pageWidth - leftMargin * 2 - 10;
          const collegeLines = doc.splitTextToSize(edu.collegeName, maxWidth);
          doc.text(collegeLines, leftMargin + 3, yPosition);
        }

        doc.setFont("EB_italic", "normal");
        if (hasContent(edu.location)) {
          doc.setFont("EB_bol", "normal");
          doc.text(edu.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += lineHeights[10];
        doc.setFont("EB_italic", "normal");
        doc.setFontSize(10);

        // Handle potentially long course names
        if (hasContent(edu.course)) {
          const maxWidth = hasContent(edu.year)
            ? pageWidth - leftMargin * 2 - 30  // Leave space for year
            : pageWidth - leftMargin * 2 - 10;
          const courseLines = doc.splitTextToSize(edu.course, maxWidth);
          doc.text(courseLines, leftMargin + 3, yPosition);
          yPosition += courseLines.length * lineHeights[10];
        } else {
          yPosition += lineHeights[10];
        }

        if (hasContent(edu.year)) {
          doc.text(edu.year, pageWidth - leftMargin, yPosition - lineHeights[10], {
            align: "right",
          });
        }

        yPosition += 3;
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
        
        // Calculate widths for project name and tech stack
        let currentY = yPosition;
        if (hasContent(pro.projectName)) {
          const projectText = `${pro.projectName} | `;
          doc.text(projectText, leftMargin + 3, currentY);
        }

        // Print Tech Stack in Italic on same line
        if (hasContent(pro.techStack)) {
          const nameWidth = doc.getTextWidth(`${pro.projectName || ""} | `);
          const availableWidth = pageWidth - leftMargin - 3 - nameWidth - (hasContent(pro.year) ? 30 : 10);
          doc.setFont("EB_italic", "normal");
          const techLines = doc.splitTextToSize(pro.techStack, availableWidth);
          doc.text(techLines, leftMargin + 3 + nameWidth, currentY);
          currentY += (techLines.length - 1) * lineHeights[10]; // Add extra space if tech stack wraps
        }

        doc.setFont("EB_reg", "normal");
        if (hasContent(pro.year)) {
          doc.text(pro.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition = currentY + lineHeights[10];
        
        // Handle project link with wrapping
        if (hasContent(pro.projectLink)) {
          doc.setFontSize(9);
          const linkLines = doc.splitTextToSize(
            `Live:  ${pro.projectLink}`, 
            pageWidth - 2 * leftMargin - 5
          );
          doc.text(linkLines, leftMargin + 3, yPosition);
          yPosition += linkLines.length * lineHeights[9] + 2;
        }

        // Handle project description with proper spacing
        if (hasContent(pro.description)) {
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
            doc.text(bulletText, leftMargin + 5, yPosition);
            yPosition += bulletText.length * lineHeights[9];
          });
        }

        yPosition += 3;
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

        // Handle long company names
        if (hasContent(exp.companyName)) {
          const maxWidth = hasContent(exp.location)
            ? pageWidth - leftMargin * 2 - 50
            : pageWidth - leftMargin * 2 - 10;
          const companyLines = doc.splitTextToSize(exp.companyName, maxWidth);
          doc.text(companyLines, leftMargin + 3, yPosition);
        }

        doc.setFont("EB_italic", "normal");
        if (hasContent(exp.location)) {
          doc.setFont("EB_bol", "normal");
          doc.text(exp.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += lineHeights[10];
        doc.setFont("EB_italic", "normal");
        doc.setFontSize(10);

        // Handle long role names
        if (hasContent(exp.role)) {
          const maxWidth = hasContent(exp.year)
            ? pageWidth - leftMargin * 2 - 30
            : pageWidth - leftMargin * 2 - 10;
          const roleLines = doc.splitTextToSize(exp.role, maxWidth);
          doc.text(roleLines, leftMargin + 3, yPosition);
          yPosition += roleLines.length * lineHeights[10];
        } else {
          yPosition += lineHeights[10];
        }

        if (hasContent(exp.year)) {
          doc.text(exp.year, pageWidth - leftMargin, yPosition - lineHeights[10], {
            align: "right",
          });
        }

        // Handle experience description with proper spacing
        if (hasContent(exp.description)) {
          yPosition += 2;
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
            doc.text(bulletText, leftMargin + 5, yPosition);
            yPosition += bulletText.length * lineHeights[10];
          });
        }
        
        yPosition += 3;
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
          checkPageBreak(10);
          const skillLine = skills.join(", ");
          const wrappedSkills = doc.splitTextToSize(
            `${category}:  ${skillLine}`,
            pageWidth - 2 * leftMargin - 5
          );
          doc.text(wrappedSkills, leftMargin + 3, yPosition);
          yPosition += wrappedSkills.length * lineHeights[9];
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
        checkPageBreak(10);
        doc.setFont("EB_reg", "normal");
        doc.setFontSize(10);

        // Handle long certification names
        if (hasContent(cert.certiName)) {
          const maxWidth = hasContent(cert.year)
            ? pageWidth - leftMargin * 2 - 30
            : pageWidth - leftMargin * 2 - 10;
          const certLines = doc.splitTextToSize(cert.certiName, maxWidth);
          doc.text(certLines, leftMargin + 3, yPosition);
          yPosition += certLines.length * lineHeights[10];
        } else {
          yPosition += lineHeights[10];
        }

        if (hasContent(cert.year)) {
          doc.text(cert.year, pageWidth - leftMargin, yPosition - lineHeights[10], {
            align: "right",
          });
        }
        
        yPosition += 2;
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
