import merium_bol from "../../assets/fonts/merrium/Merriweather_Bold.ttf";
import merium_reg from "../../assets/fonts/merrium/Merriweather_Regular.ttf";
import jsPDF from "jspdf";
import { drawLeftRight, splitBullets, toHref, wrapItems } from "./templateHelpers";

export const Template06 = ({ formData }) => {
  try {
    // Initialize PDF document with A4 portrait format
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Helper functions for content validation
    // Checks if a string exists and has meaningful content
    const hasContent = (str) => str && str.trim().length > 0;

    // Checks if any field in an array has meaningful content
    const hasAnyContent = (fields) => fields.some((field) => hasContent(field));

    // Basic layout parameters
    const leftMargin = 20;
    let yPosition = 12;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const rightX = pageWidth - leftMargin;
    const contentWidth = rightX - leftMargin;
    const bottomMargin = 20;

    const checkAddPage = (extraSpace = 0) => {
      if (yPosition + extraSpace > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Add custom fonts to the document
    doc.addFont(merium_reg, "merium_reg", "normal");
    doc.addFont(merium_bol, "merium_bol", "normal");

    // Get personal details with safe fallback
    const details = formData.personalDetails?.[0] || {};

    // Name Header - Only display if there's a first or last name
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setFont("merium_reg");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `${details.firstName || ""} ${details.lastName || ""}`
          .trim()
          .toUpperCase(),
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 5;
    }

    // Contact Information - Only display if any contact information exists
    const contactFields = [
      details.email,
      details.phoneNumber,
      details.linkedin,
    ].filter(hasContent);

    if (contactFields.length > 0) {
      doc.setFont("merium_reg");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      wrapItems(doc, contactFields, " • ", contentWidth).forEach((line, i) => {
        if (i > 0) yPosition += 4.5;
        doc.text(line, pageWidth / 2, yPosition, { align: "center" });
      });
    }

    // Summary Section - Only display if about text exists
    if (hasContent(details.about)) {
      yPosition += 20;
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("SUMMARY", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      yPosition += 5;
      doc.setFont("merium_reg");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const summary = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin
      );
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 5;
    }

    // Experience Section - Only display if valid experiences exist
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
      yPosition += 12;
      checkAddPage(20);
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("EXPERIENCE", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      validExperiences.forEach((exp) => {
        checkAddPage(20);
        yPosition += 5;

        // Role on the left, location and date on the right
        const roleLines = drawLeftRight(doc, {
          left: hasContent(exp.role) ? exp.role.trim() : "",
          right: [exp.location, exp.year].filter(hasContent).join(" • "),
          x: leftMargin,
          rightX,
          y: yPosition,
          lineHeight: 5,
          setLeftFont: () => {
            doc.setFont("merium_bol");
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
          },
          setRightFont: () => {
            doc.setFont("merium_reg", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
          },
        });
        yPosition += (roleLines - 1) * 5;

        // Company Name - Only display if it exists
        if (hasContent(exp.companyName)) {
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          doc.splitTextToSize(exp.companyName, contentWidth).forEach((line) => {
            yPosition += 5;
            doc.text(line, leftMargin, yPosition);
          });
        }

        // Description with bullet points - Only display if description exists
        if (hasContent(exp.description)) {
          yPosition += 6;
          doc.setFont("merium_reg");
          doc.setTextColor(60, 60, 60);
          const descriptions = splitBullets(exp.description);

          descriptions.forEach((desc) => {
            const wrappedText = doc.splitTextToSize(
              `• ${desc.trim()}`,
              pageWidth - 2 * leftMargin - 5
            );
            checkAddPage(wrappedText.length * 5);
            doc.text(wrappedText, leftMargin + 5, yPosition);
            yPosition += wrappedText.length * 5;
          });
        }
      });
    }

    // Projects Section - Only display if valid projects exist
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
      yPosition += 12;
      checkAddPage(20);
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("PROJECTS", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      validProjects.forEach((project) => {
        checkAddPage(20);
        yPosition += 5;

        // Project Name and Year - Only display if they exist
        const nameLines = drawLeftRight(doc, {
          left: hasContent(project.projectName) ? project.projectName.trim() : "",
          right: hasContent(project.year) ? project.year.trim() : "",
          x: leftMargin,
          rightX,
          y: yPosition,
          lineHeight: 5,
          setLeftFont: () => {
            doc.setFont("merium_bol");
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
          },
          setRightFont: () => {
            doc.setFont("merium_reg");
            doc.setFontSize(10);
          },
        });
        yPosition += (nameLines - 1) * 5;

        // Project Link - Only display if it exists
        if (hasContent(project.projectLink)) {
          const clickText = "~ Link";
          yPosition += 5;
          doc.setFontSize(8);
          doc.setFont("merium_bol");
          doc.text(clickText, leftMargin, yPosition);
          doc.link(leftMargin, yPosition - 3, doc.getTextWidth(clickText), 5, {
            url: toHref(project.projectLink.trim()),
          });
        }

        // Project Description - Only display if it exists
        if (hasContent(project.description)) {
          yPosition += 5;
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          const desc = doc.splitTextToSize(project.description, pageWidth - 2 * leftMargin - 5);
          checkAddPage(desc.length * 5);
          doc.text(desc, leftMargin + 5, yPosition);
          yPosition += desc.length * 5;
        }

        // Tech Stack - Only display if it exists
        if (hasContent(project.techStack)) {
          yPosition += 5;
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          const techStack = doc.splitTextToSize(
            `Tools & Technologies: ${project.techStack}`,
            pageWidth - 2 * leftMargin
          );
          doc.text(techStack, leftMargin, yPosition);
          yPosition += techStack.length * 5;
        }
      });
    }

    // Education Section - Only display if valid education entries exist
    const validEducation =
      formData.educationDetails?.filter((edu) =>
        hasAnyContent([edu.course, edu.collegeName, edu.location, edu.year])
      ) || [];

    if (validEducation.length > 0) {
      yPosition += 12;
      checkAddPage(20);
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("EDUCATION", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      validEducation.forEach((edu) => {
        checkAddPage(15);
        yPosition += 5;

        // Degree/course on the left, year on the right
        const courseLines = drawLeftRight(doc, {
          left: hasContent(edu.course) ? edu.course.trim() : "",
          right: hasContent(edu.year) ? edu.year.trim() : "",
          x: leftMargin,
          rightX,
          y: yPosition,
          lineHeight: 5,
          setLeftFont: () => {
            doc.setFont("merium_bol");
            doc.setFontSize(11);
          },
          setRightFont: () => {
            doc.setFont("merium_reg");
            doc.setFontSize(10);
          },
        });
        yPosition += (courseLines - 1) * 5;

        // College and Location - Only display if either exists
        if (hasContent(edu.collegeName) || hasContent(edu.location)) {
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          const eduLocation = [edu.collegeName, edu.location]
            .filter(hasContent)
            .join(", ");
          doc.splitTextToSize(eduLocation, contentWidth).forEach((line) => {
            yPosition += 5;
            doc.text(line, leftMargin, yPosition);
          });
          yPosition += 4;
        }
      });
    }

    // Certifications
    const certifications =
      formData.certification?.filter(
        (cert) => hasContent(cert.year) || hasContent(cert.certiName)
      ) || [];

    if (certifications.length > 0) {
      yPosition += 7;
      checkAddPage(20);
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.text("Certifications", leftMargin, yPosition);
      doc.line(
        leftMargin,
        yPosition + 2,
        pageWidth - leftMargin,
        yPosition + 2
      );

      certifications.forEach((cert) => {
        checkAddPage(15);
        yPosition += 8;
        const setCertFont = () => {
          doc.setFont("merium_reg");
          doc.setFontSize(10);
        };
        const certLines = drawLeftRight(doc, {
          left: hasContent(cert.certiName) ? cert.certiName.trim() : "",
          right: hasContent(cert.year) ? cert.year.trim() : "",
          x: leftMargin,
          rightX,
          y: yPosition,
          lineHeight: 5,
          setLeftFont: setCertFont,
          setRightFont: setCertFont,
        });
        yPosition += (certLines - 1) * 5;
      });
    }

    // Skills Section - Only display if valid skills exist
    const validSkills =
      formData.skills?.filter((skill) => hasContent(skill.skillName)) || [];

    if (validSkills.length > 0) {
      yPosition += 12;
      checkAddPage(20);
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("SKILLS", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      const skillList = validSkills
        .map((skill) => skill.skillName.trim())
        .join(", ");

      yPosition += 5;
      doc.setFont("merium_reg");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);

      const wrappedSkills = doc.splitTextToSize(
        skillList,
        pageWidth - 2 * leftMargin
      );
      checkAddPage(wrappedSkills.length * 5);
      doc.text(wrappedSkills, leftMargin, yPosition);
      yPosition += wrappedSkills.length * 5;
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
