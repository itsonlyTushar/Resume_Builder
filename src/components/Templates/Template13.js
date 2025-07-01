import jsPDF from "jspdf";
import toast from "react-hot-toast";
import roboto_reg from "../../assets/fonts/roboto/Roboto_Regular.ttf";
import roboto_bol from "../../assets/fonts/roboto/Roboto_Medium.ttf";
import { checkEach, checkStr } from "../../utils/helpers";

export const Template13 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    let yPosition = 25;

    // Helper to check for page overflow and add new page if needed
    const checkPageOverflow = (neededSpace = 12) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        pdf.addPage();
        yPosition = 25;
      }
    };

    // Gathering the data to make pdf
    const personalDetails = formData.personalDetails[0];
    const educationDetails = formData.educationDetails;
    const experienceDetails = formData.experienceDetails;
    const projectDetails = formData.projectDetails;
    const skills = formData.skills;
    const certification = formData.certification;

    pdf.addFont(roboto_reg, "roboto_reg", "normal");
    pdf.addFont(roboto_bol, "roboto_bol", "normal");

    // Header Section with Name and Contact
    pdf.setFont("roboto_bol");
    pdf.setFontSize(24); // Lowered from 28
    pdf.setTextColor(44, 62, 80);
    const fullName = `${personalDetails.firstName} ${personalDetails.lastName}`;
    const nameWidth = pdf.getTextWidth(fullName);
    pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);

    // Contact Information
    yPosition += 10;
    pdf.setFont("roboto_reg");
    pdf.setFontSize(9); // Lowered from 10
    pdf.setTextColor(74, 84, 102);

    const contactInfo = [];
    if (checkStr(personalDetails.email)) contactInfo.push(personalDetails.email);
    if (checkStr(personalDetails.phoneNumber)) contactInfo.push(personalDetails.phoneNumber);
    if (checkStr(personalDetails.linkedin)) contactInfo.push("LinkedIn Profile");

    const contactText = contactInfo.join(" • ");
    const contactWidth = pdf.getTextWidth(contactText);
    pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);

    // Decorative line under header
    yPosition += 7;
    pdf.setDrawColor(52, 152, 219);
    pdf.setLineWidth(1);
    pdf.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);

    // Helper function to create section headers
    const createSectionHeader = (title, y) => {
      checkPageOverflow(12);
      pdf.setFont("roboto_bol");
      pdf.setFontSize(12); // Lowered from 14
      pdf.setTextColor(44, 62, 80);
      pdf.text(title.toUpperCase(), leftMargin, y);

      const titleWidth = pdf.getTextWidth(title.toUpperCase());
      pdf.setDrawColor(52, 152, 219);
      pdf.setLineWidth(0.5);
      pdf.line(leftMargin, y + 2, leftMargin + titleWidth + 5, y + 2);

      return y + 8;
    };

    // Professional Summary/About Section
    if (checkStr(personalDetails.about)) {
      yPosition += 12;
      yPosition = createSectionHeader("Professional Summary", yPosition);

      pdf.setFont("roboto_reg");
      pdf.setFontSize(8); // Lowered from 10
      pdf.setTextColor(55, 65, 81);
      const aboutText = pdf.splitTextToSize(personalDetails.about, contentWidth);
      checkPageOverflow(aboutText.length * 3.5 + 8);
      pdf.text(aboutText, leftMargin, yPosition);
      yPosition += (aboutText.length * 3.5) + 6;
    }

    // Experience Section
    if (
      checkEach(experienceDetails, "companyName") ||
      checkEach(experienceDetails, "role") ||
      checkEach(experienceDetails, "location") ||
      checkEach(experienceDetails, "year") ||
      checkEach(experienceDetails, "description")
    ) {
      yPosition += 7;
      yPosition = createSectionHeader("Professional Experience", yPosition);

      experienceDetails.forEach((exp, index) => {
        if (index > 0) yPosition += 6;
        checkPageOverflow(16);

        // Company and Role
        pdf.setFont("roboto_bol");
        pdf.setFontSize(9); // Lowered from 11
        pdf.setTextColor(44, 62, 80);
        pdf.text(`${exp.role}`, leftMargin, yPosition);

        // Company name and location
        pdf.setFont("roboto_bol");
        pdf.setFontSize(8); // Lowered from 10
        pdf.setTextColor(52, 152, 219);
        pdf.text(`${exp.companyName}, ${exp.location}`, leftMargin, yPosition + 4);

        // Duration - right aligned
        pdf.setFont("roboto_reg");
        pdf.setFontSize(7); // Lowered from 9
        pdf.setTextColor(107, 114, 128);
        const durationWidth = pdf.getTextWidth(exp.year);
        pdf.text(exp.year, pageWidth - rightMargin - durationWidth, yPosition + 4);

        yPosition += 10;

        // Job description
        if (checkStr(exp.description)) {
          pdf.setFont("roboto_reg");
          pdf.setFontSize(7); // Lowered from 9
          pdf.setTextColor(55, 65, 81);
          const description = pdf.splitTextToSize(exp.description, contentWidth - 10);

          checkPageOverflow(description.length * 3 + 3);
          pdf.text("•", leftMargin + 5, yPosition);
          pdf.text(description, leftMargin + 10, yPosition);
          yPosition += (description.length * 3) + 2;
        }
      });
    }

    // Education Section
    if (
      checkEach(educationDetails, "collegeName") ||
      checkEach(educationDetails, "location") ||
      checkEach(educationDetails, "year") ||
      checkEach(educationDetails, "course")
    ) {
      yPosition += 7;
      yPosition = createSectionHeader("Education", yPosition);

      educationDetails.forEach((edu, index) => {
        if (index > 0) yPosition += 5;
        checkPageOverflow(13);

        // Course/Degree
        pdf.setFont("roboto_bol");
        pdf.setFontSize(9); // Lowered from 11
        pdf.setTextColor(44, 62, 80);
        pdf.text(edu.course, leftMargin, yPosition);

        // Institution and location
        pdf.setFont("roboto_reg");
        pdf.setFontSize(8); // Lowered from 10
        pdf.setTextColor(52, 152, 219);
        pdf.text(`${edu.collegeName}, ${edu.location}`, leftMargin, yPosition + 4);

        // Year - right aligned
        pdf.setFont("roboto_reg");
        pdf.setFontSize(7); // Lowered from 9
        pdf.setTextColor(107, 114, 128);
        const yearWidth = pdf.getTextWidth(edu.year);
        pdf.text(edu.year, pageWidth - rightMargin - yearWidth, yPosition + 4);

        yPosition += 10;
      });
    }

    // Projects Section
    if (
      checkEach(projectDetails, "projectName") ||
      checkEach(projectDetails, "projectLink") ||
      checkEach(projectDetails, "techStack") ||
      checkEach(projectDetails, "year")
    ) {
      yPosition += 7;
      yPosition = createSectionHeader("Key Projects", yPosition);

      projectDetails.forEach((project, index) => {
        if (index > 0) yPosition += 5;
        checkPageOverflow(13);

        // Project name
        pdf.setFont("roboto_bol");
        pdf.setFontSize(9); // Lowered from 11
        pdf.setTextColor(44, 62, 80);
        pdf.text(project.projectName, leftMargin, yPosition);

        // Year - right aligned
        pdf.setFont("roboto_reg");
        pdf.setFontSize(7); // Lowered from 9
        pdf.setTextColor(107, 114, 128);
        const projectYearWidth = pdf.getTextWidth(project.year);
        pdf.text(project.year, pageWidth - rightMargin - projectYearWidth, yPosition);

        yPosition += 4;

        // Tech stack
        if (checkStr(project.techStack)) {
          pdf.setFont("roboto_reg");
          pdf.setFontSize(7); // Lowered from 9
          pdf.setTextColor(52, 152, 219);
          pdf.text(`Technologies: ${project.techStack}`, leftMargin, yPosition);
          yPosition += 3;
        }

        // Project link
        if (checkStr(project.projectLink)) {
          pdf.setFont("roboto_reg");
          pdf.setFontSize(7); // Lowered from 9
          pdf.setTextColor(74, 84, 102);
          pdf.textWithLink(`View Project: ${project.projectLink}`, leftMargin, yPosition, {
            url: project.projectLink,
          });
          yPosition += 6;
        }
      });
    }

    // Skills and Certifications in two columns
    const hasSkills = checkEach(skills, "skillName");
    const hasCertifications = checkEach(certification, "certiName") || checkEach(certification, "year");

    if (hasSkills || hasCertifications) {
      yPosition += 7;

      // Skills Section (Left Column)
      if (hasSkills) {
        const skillsY = createSectionHeader("Technical Skills", yPosition);

        pdf.setFont("roboto_reg");
        pdf.setFontSize(7); // Lowered from 9
        pdf.setTextColor(55, 65, 81);

        const skillsList = skills.map((skill) => skill.skillName).join(" • ");
        const skillsText = pdf.splitTextToSize(skillsList, contentWidth / 2 - 10);
        checkPageOverflow(skillsText.length * 2.5 + 10);
        pdf.text(skillsText, leftMargin, skillsY);

        const skillsHeight = skillsText.length * 2.5;

        // Certifications Section (Right Column)
        if (hasCertifications) {
          pdf.setFont("roboto_bol");
          pdf.setFontSize(12); // Lowered from 14
          pdf.setTextColor(44, 62, 80);
          const certTitle = "CERTIFICATIONS";
          pdf.text(certTitle, leftMargin + contentWidth / 2 + 10, yPosition);

          const certTitleWidth = pdf.getTextWidth(certTitle);
          pdf.setDrawColor(52, 152, 219);
          pdf.setLineWidth(0.5);
          pdf.line(
            leftMargin + contentWidth / 2 + 10,
            yPosition + 2,
            leftMargin + contentWidth / 2 + 10 + certTitleWidth + 5,
            yPosition + 2
          );

          let certY = yPosition + 8;
          pdf.setFont("roboto_reg");
          pdf.setFontSize(7); // Lowered from 9
          pdf.setTextColor(55, 65, 81);

          certification.forEach((cert) => {
            if (checkStr(cert.certiName)) {
              checkPageOverflow(3);
              pdf.text(`• ${cert.certiName}`, leftMargin + contentWidth / 2 + 10, certY);
              if (checkStr(cert.year)) {
                pdf.setTextColor(107, 114, 128);
                pdf.text(
                  `(${cert.year})`,
                  leftMargin + contentWidth / 2 + 15 + pdf.getTextWidth(cert.certiName),
                  certY
                );
                pdf.setTextColor(55, 65, 81);
              }
              certY += 3;
            }
          });
        }

        yPosition += Math.max(skillsHeight + 12, hasCertifications ? certification.length * 3 + 18 : 0);
      } else if (hasCertifications) {
        // Only certifications, full width
        yPosition = createSectionHeader("Certifications", yPosition);

        pdf.setFont("roboto_reg");
        pdf.setFontSize(7); // Lowered from 9
        pdf.setTextColor(55, 65, 81);

        certification.forEach((cert) => {
          if (checkStr(cert.certiName)) {
            checkPageOverflow(3);
            pdf.text(`• ${cert.certiName}`, leftMargin, yPosition);
            if (checkStr(cert.year)) {
              pdf.setTextColor(107, 114, 128);
              pdf.text(`(${cert.year})`, leftMargin + 5 + pdf.getTextWidth(cert.certiName), yPosition);
              pdf.setTextColor(55, 65, 81);
            }
            yPosition += 3;
          }
        });

        yPosition += 6;
      }
    }


    return pdf;
  } catch (error) {
    toast.error("Error generating the resume. Please try again...");
    console.error("Resume generation error:", error);
  }
};