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
      9: 3.5, // Small text: 3.5mm between lines
      10: 4.5, // Regular text: 4.5mm between lines
      11: 5, // Section headers: 5mm between lines
      28: 10, // Name header: 10mm
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
        { align: "center" },
      );
      yPosition += 6;
    }

    const contactFields = [];

    if (hasContent(details.phoneNumber))
      contactFields.push({ text: details.phoneNumber });
    if (hasContent(details.email))
      contactFields.push({
        text: details.email,
        link: `mailto:${details.email}`,
      });
    if (hasContent(details.linkedin))
      contactFields.push({ text: "LinkedIn", link: details.linkedin });
    if (hasContent(details.github))
      contactFields.push({ text: "GitHub", link: details.github });
    if (hasContent(details.portfolio))
      contactFields.push({ text: "Portfolio", link: details.portfolio });

    if (contactFields.length > 0) {
      doc.setFontSize(9);
      doc.setFont("EB_bol", "normal");

      // Full text to calculate centered x-position
      const fullText = contactFields.map((f) => f.text).join(" | ");
      const textWidth = doc.getTextWidth(fullText);
      let xCursor = (pageWidth - textWidth) / 2;

      for (let i = 0; i < contactFields.length; i++) {
        const field = contactFields[i];
        const w = doc.getTextWidth(field.text);

        if (field.link) {
          // Clickable label — annotation carries the full URL for ATS
          doc.textWithLink(field.text, xCursor, yPosition, { url: field.link });
          // Underline so it's visually obvious as a link
          doc.line(xCursor, yPosition + 0.8, xCursor + w, yPosition + 0.8);
        } else {
          doc.text(field.text, xCursor, yPosition);
        }

        xCursor += w;

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
        yPosition + 2,
      );
      yPosition += 7;
    };

    // Helper function to check if new page is needed
    const checkPageBreak = (neededSpace) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 25;
      }
    };

    // ── Section renderers ──────────────────────────────────────────────────
    // Each function closes over `yPosition`, `doc`, helpers, and form data.

    const renderDescription = () => {
      if (!hasContent(details.about)) return;
      checkPageBreak(30);
      yPosition += 5;
      addSectionHeader("SUMMARY");
      doc.setFont("EB_reg", "normal");
      doc.setFontSize(10);
      const description = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin,
      );
      doc.text(description, leftMargin + 3, yPosition + 1);
      yPosition += description.length * 4.5;
    };

    const renderEducation = () => {
      const validEducation =
        formData.educationDetails?.filter((edu) =>
          hasAnyContent([edu.collegeName, edu.course, edu.location, edu.year]),
        ) || [];
      if (validEducation.length === 0) return;

      checkPageBreak(40);
      addSectionHeader("EDUCATION");
      validEducation.forEach((edu) => {
        checkPageBreak(20);
        doc.setFont("EB_bol", "normal");
        doc.setFontSize(10);

        if (hasContent(edu.collegeName)) {
          const maxWidth = hasContent(edu.location)
            ? pageWidth - leftMargin * 2 - 50
            : pageWidth - leftMargin * 2 - 10;
          const collegeLines = doc.splitTextToSize(edu.collegeName, maxWidth);
          doc.text(collegeLines, leftMargin + 3, yPosition);
        }

        if (hasContent(edu.location)) {
          doc.setFont("EB_bol", "normal");
          doc.text(edu.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += lineHeights[10];
        doc.setFont("EB_italic", "normal");
        doc.setFontSize(10);

        if (hasContent(edu.course)) {
          const maxWidth = hasContent(edu.year)
            ? pageWidth - leftMargin * 2 - 30
            : pageWidth - leftMargin * 2 - 10;
          const courseLines = doc.splitTextToSize(edu.course, maxWidth);
          doc.text(courseLines, leftMargin + 3, yPosition);
          yPosition += courseLines.length * lineHeights[10];
        } else {
          yPosition += lineHeights[10];
        }

        if (hasContent(edu.year)) {
          doc.text(
            edu.year,
            pageWidth - leftMargin,
            yPosition - lineHeights[10],
            {
              align: "right",
            },
          );
        }

        yPosition += 2;
      });
    };

    const renderProjects = () => {
      const validProjects =
        formData.projectDetails?.filter((project) =>
          hasAnyContent([
            project.projectName,
            project.description,
            project.techStack,
            project.projectLink,
            project.year,
          ]),
        ) || [];
      if (validProjects.length === 0) return;

      checkPageBreak(40);
      addSectionHeader("PROJECTS");
      validProjects.forEach((pro) => {
        checkPageBreak(20);
        doc.setFont("EB_bol", "normal");
        doc.setFontSize(10);

        let currentY = yPosition;
        if (hasContent(pro.projectName)) {
          doc.text(`${pro.projectName} | `, leftMargin + 3, currentY);
        }

        if (hasContent(pro.techStack)) {
          const nameWidth = doc.getTextWidth(`${pro.projectName || ""} | `);
          const availableWidth =
            pageWidth -
            leftMargin -
            3 -
            nameWidth -
            (hasContent(pro.year) ? 30 : 10);
          doc.setFont("EB_italic", "normal");
          const techLines = doc.splitTextToSize(pro.techStack, availableWidth);
          doc.text(techLines, leftMargin + 3 + nameWidth, currentY);
          currentY += (techLines.length - 1) * lineHeights[10];
        }

        doc.setFont("EB_reg", "normal");
        if (hasContent(pro.year)) {
          doc.text(pro.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition = currentY + lineHeights[10];

        if (hasContent(pro.projectLink)) {
          doc.setFontSize(9);
          const label = `Live:  ${pro.projectLink}`;
          const linkLines = doc.splitTextToSize(
            label,
            pageWidth - 2 * leftMargin - 5,
          );
          // Render each wrapped line; only the first line carries the clickable annotation
          linkLines.forEach((line, i) => {
            if (i === 0) {
              doc.textWithLink(line, leftMargin + 3, yPosition, {
                url: pro.projectLink,
              });
              doc.line(
                leftMargin + 3,
                yPosition + 0.8,
                leftMargin + 3 + doc.getTextWidth(line),
                yPosition + 0.8,
              );
            } else {
              doc.text(line, leftMargin + 3, yPosition);
            }
            yPosition += lineHeights[9];
          });
          yPosition += 1;
        }

        if (hasContent(pro.description)) {
          doc.setFontSize(9);
          const bullets = pro.description
            .split(".")
            .filter((s) => s.trim().length > 0);
          bullets.forEach((bullet) => {
            checkPageBreak(8);
            const bulletText = doc.splitTextToSize(
              `• ${bullet.trim()}.`,
              pageWidth - 2 * leftMargin - 5,
            );
            doc.text(bulletText, leftMargin + 5, yPosition);
            yPosition += bulletText.length * lineHeights[9];
          });
        }

        yPosition += 2;
      });
    };

    const renderExperience = () => {
      const validExperiences =
        formData.experienceDetails?.filter((exp) =>
          hasAnyContent([
            exp.role,
            exp.companyName,
            exp.location,
            exp.year,
            exp.description,
          ]),
        ) || [];
      if (validExperiences.length === 0) return;

      yPosition += 4;
      checkPageBreak(40);
      addSectionHeader("EXPERIENCES");
      validExperiences.forEach((exp) => {
        checkPageBreak(20);
        doc.setFont("EB_bol", "normal");
        doc.setFontSize(10);

        if (hasContent(exp.companyName)) {
          const maxWidth = hasContent(exp.location)
            ? pageWidth - leftMargin * 2 - 50
            : pageWidth - leftMargin * 2 - 10;
          const companyLines = doc.splitTextToSize(exp.companyName, maxWidth);
          doc.text(companyLines, leftMargin + 3, yPosition);
        }

        if (hasContent(exp.location)) {
          doc.setFont("EB_bol", "normal");
          doc.text(exp.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += lineHeights[10];
        doc.setFont("EB_italic", "normal");
        doc.setFontSize(10);

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
          doc.text(
            exp.year,
            pageWidth - leftMargin,
            yPosition - lineHeights[10],
            {
              align: "right",
            },
          );
        }

        if (hasContent(exp.description)) {
          yPosition += 2;
          doc.setFontSize(10);
          const bullets = exp.description
            .split(".")
            .filter((s) => s.trim().length > 0);
          bullets.forEach((bullet) => {
            checkPageBreak(8);
            const bulletText = doc.splitTextToSize(
              `• ${bullet.trim()}.`,
              pageWidth - 2 * leftMargin - 5,
            );
            doc.text(bulletText, leftMargin + 5, yPosition);
            yPosition += bulletText.length * lineHeights[10];
          });
        }

        yPosition += 3;
      });
    };

    const renderSkills = () => {
      const validSkills =
        formData.skills?.filter((skill) => hasContent(skill.skillName)) || [];
      if (validSkills.length === 0) return;

      checkPageBreak(20);
      addSectionHeader("TECHNICAL SKILLS");
      doc.setFont("EB_bol", "normal");
      doc.setFontSize(9);

      const skillCategories = {
        Languages: [],
        "Frameworks & Runtime": [],
        "Libraries & Tools": [],
        "UI & Design": [],
        Databases: [],
        "Cloud Platforms": [],
        "Hosting & Infrastructure": [],
        "DevOps & CI/CD": [],
        "Testing & QA": [],
        "Mobile Development": [],
        "Data Science & ML": [],
        Security: [],
        "Networking & Systems": [],
        "Operating Systems": [],
      };

      validSkills.forEach((skill) => {
        if (skillCategories[skill.category]) {
          skillCategories[skill.category].push(skill.skillName.trim());
        }
      });

      Object.entries(skillCategories).forEach(([category, skills]) => {
        if (skills.length > 0) {
          checkPageBreak(10);
          const wrappedSkills = doc.splitTextToSize(
            `${category}:  ${skills.join(", ")}`,
            pageWidth - 2 * leftMargin - 5,
          );
          doc.text(wrappedSkills, leftMargin + 3, yPosition);
          yPosition += wrappedSkills.length * lineHeights[9];
        }
      });

      yPosition += 3;
    };

    const renderCertifications = () => {
      const certifications =
        formData.certification?.filter((cert) =>
          hasAnyContent([cert.certiName, cert.year]),
        ) || [];
      if (certifications.length === 0) return;

      addSectionHeader("CERTIFICATIONS & ACHIVEMENTS");
      certifications.forEach((cert) => {
        checkPageBreak(10);
        doc.setFont("EB_reg", "normal");
        doc.setFontSize(10);

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
          doc.text(
            cert.year,
            pageWidth - leftMargin,
            yPosition - lineHeights[10],
            {
              align: "right",
            },
          );
        }

        yPosition += 2;
      });
    };

    // ── Render sections in user-defined order ──────────────────────────────
    const sectionRenderers = {
      description: renderDescription,
      education: renderEducation,
      projects: renderProjects,
      experience: renderExperience,
      skills: renderSkills,
    };

    const sectionOrder = formData.sectionOrder || [
      "description",
      "education",
      "projects",
      "experience",
      "skills",
    ];

    sectionOrder.forEach((sectionId) => {
      const renderer = sectionRenderers[sectionId];
      if (renderer) renderer();
    });

    // Certifications always appear last (not user-reorderable)
    renderCertifications();

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
