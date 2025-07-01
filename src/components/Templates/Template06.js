import merium_bol from "../../assets/fonts/merrium/Merriweather_Bold.ttf";
import merium_reg from "../../assets/fonts/merrium/Merriweather_Regular.ttf";
import jsPDF from "jspdf";

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
      const contactInfo = contactFields.join(" • ");
      doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
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
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("EXPERIENCE", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      validExperiences.forEach((exp) => {
        yPosition += 5;

        // Role and Company - Only display if role exists
        if (hasContent(exp.role)) {
          doc.setFont("merium_bol");
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(exp.role, leftMargin, yPosition);
        }

        // Location and Date - Only display if either exists
        if (hasContent(exp.location) || hasContent(exp.year)) {
          const dateLocation = [exp.location, exp.year]
            .filter(hasContent)
            .join(" • ");
          doc.setFont("merium_reg", "normal");
          doc.setFontSize(10);
          doc.text(dateLocation, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        // Company Name - Only display if it exists
        if (hasContent(exp.companyName)) {
          yPosition += 5;
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          doc.text(exp.companyName, leftMargin, yPosition);
        }

        // Description with bullet points - Only display if description exists
        if (hasContent(exp.description)) {
          yPosition += 6;
          doc.setFont("merium_reg");
          doc.setTextColor(60, 60, 60);
          const descriptions = exp.description
            .split("•")
            .filter((desc) => hasContent(desc));

          descriptions.forEach((desc) => {
            const wrappedText = doc.splitTextToSize(
              `• ${desc.trim()}`,
              pageWidth - 2 * leftMargin - 5
            );
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
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("PROJECTS", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      validProjects.forEach((project) => {
        yPosition += 5;

        // Project Name and Year - Only display if they exist
        if (hasContent(project.projectName)) {
          doc.setFont("merium_bol");
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(11);
          doc.text(project.projectName, leftMargin, yPosition);
        }

        if (hasContent(project.year)) {
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          doc.text(project.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        // Project Link - Only display if it exists
        if (hasContent(project.projectLink)) {
          const clickText = "~ Link";
          yPosition += 5;
          doc.setFontSize(8);
          doc.setFont("merium_bol");
          doc.text(clickText, leftMargin, yPosition);
          doc.link(leftMargin, yPosition - 3, doc.getTextWidth(clickText), 5, {
            url: project.projectLink,
          });
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
      doc.setFont("merium_bol");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("EDUCATION", leftMargin, yPosition);

      // Horizontal line
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);

      validEducation.forEach((edu) => {
        yPosition += 5;

        // Degree and Course - Only display if course exists
        if (hasContent(edu.course)) {
          doc.setFont("merium_bol");
          doc.setFontSize(11);
          doc.text(edu.course, leftMargin, yPosition);
        }

        // Year - Only display if it exists
        if (hasContent(edu.year)) {
          doc.setFont("merium_reg");
          doc.setFontSize(10);
          doc.text(edu.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        // College and Location - Only display if either exists
        if (hasContent(edu.collegeName) || hasContent(edu.location)) {
          yPosition += 5;
          doc.setFont("merium_reg");
          const eduLocation = [edu.collegeName, edu.location]
            .filter(hasContent)
            .join(", ");
          doc.text(eduLocation, leftMargin, yPosition);
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
        yPosition += 8;
        doc.setFont("merium_reg");
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
    }

    // Skills Section - Only display if valid skills exist
    const validSkills =
      formData.skills?.filter((skill) => hasContent(skill.skillName)) || [];

    if (validSkills.length > 0) {
      yPosition += 12;
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
      doc.text(wrappedSkills, leftMargin, yPosition);
      yPosition += wrappedSkills.length * 5;
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
