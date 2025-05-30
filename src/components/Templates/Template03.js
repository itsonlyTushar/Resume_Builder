import jsPDF from "jspdf";
import noto_reg from "../../assets/fonts/noto/NotoSans-Regular.ttf";
import noto_bol from "../../assets/fonts/noto/NotoSans-Bold.ttf";
import noto_semi from "../../assets/fonts/noto/NotoSans-SemiBold.ttf";
import toast from "react-hot-toast";
import { checkEach, checkStr } from "../../utils/helpers";

export const Template03 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    let leftMargin = 35;
    let yPosition = 20;
    let xPosition = 60;
    const pageWidth = pdf.internal.pageSize.width * 2;
    const pageWi = pdf.internal.pageSize.width;
    let rightMargin = pageWi / 16;

    // icons
    const mailIcon = `data:image/png;base64,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`;
    const phoneIcon = `data:image/png;base64,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`;
    const linkedinIcon = `data:image/png;base64,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`;
    const linkIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAIABJREFUeF7t3UuoZelVB/CV2GBsA0kmJjHBV8QMYkTUQDJwoCNHCpFu1E7HiEaNIEommZmgIBmpA1+g4iPd0XQrzsSRkwjxNVHwGclAGm0QFMSAg35Y59Sju6pu1T1nn/Xt/a29fgUZ5Z5vr++31un1r3PrVr0m/CJAgAABAgTaCbym3Y1dmAABAgQIEAgBwBAQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAECBAgQaCggADRsuisTIECAAAEBwAwQIECAAIGGAgJAw6a7MgECBAgQEADMAAEC2QLPRMRj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`;

    // gathring the data to make pdf
    const personalDetails = formData.personalDetails[0];
    const educationDetails = formData.educationDetails;
    const experienceDetails = formData.experienceDetails;
    const projectDetails = formData.projectDetails;
    const skills = formData.skills;
    const certification = formData.certification;

    pdf.addFont(noto_reg, "noto_reg", "normal");
    pdf.addFont(noto_bol, "noto_bol", "normal");
    pdf.addFont(noto_semi, "noto_semi", "normal");
    pdf.setFont("noto_semi");

    if (
      checkStr(personalDetails.firstName) ||
      checkStr(personalDetails.lastName) ||
      checkStr(personalDetails.about) ||
      checkStr(personalDetails.linkedin) ||
      checkStr(personalDetails.email) ||
      checkStr(personalDetails.phoneNumber)
    ) {
      // personal information
      pdf.setFontSize(28);
      pdf.setTextColor(46, 49, 53);
      pdf.text(
        `${personalDetails.firstName} ${personalDetails.lastName}`,
        leftMargin - 25,
        yPosition
      );

      // about me

      pdf.setFont("noto_reg");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const description = pdf.splitTextToSize(
        personalDetails.about,
        pageWidth / 2.2
      );
      pdf.text(description, leftMargin - 24, yPosition + 6, { align: "left" });

      // line with icon section and contact details
      yPosition += 30;
      pdf.line(0, yPosition, 210, yPosition);

      pdf.setTextColor(46, 49, 53);
      pdf.setFont("noto_bol");
      pdf.addImage(mailIcon, leftMargin - 20, yPosition + 4, 4, 4);
      pdf.text(personalDetails.email, leftMargin - 14, yPosition + 7);

      if (checkStr(personalDetails.linkedin)) {
        pdf.addImage(linkedinIcon, leftMargin + 65, yPosition + 4, 4, 4);
        pdf.textWithLink("Linkedin", leftMargin + 72, yPosition + 7, {
          url: `${personalDetails.linkedin}`,
        });
      }

      pdf.addImage(phoneIcon, leftMargin + 120, yPosition + 4, 4, 4);
      pdf.text(personalDetails.phoneNumber, leftMargin + 125, yPosition + 7);
      yPosition += 12;
      pdf.line(0, yPosition, 210, yPosition);
    }

    // Work experince section
    if (
      checkEach(experienceDetails, "companyName") ||
      checkEach(experienceDetails, "year") ||
      checkEach(experienceDetails, "role") ||
      checkEach(experienceDetails, "location") ||
      checkEach(experienceDetails, "description")
    ) {
      yPosition += 9;
      pdf.setFont("noto_bol");
      pdf.setFontSize(16);
      pdf.text("WORK EXPERIENCE", rightMargin, yPosition);

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      experienceDetails.forEach((exp, index) => {
        yPosition += 9;
        if (index !== 0) {
          yPosition += 45;
        }
        pdf.setFont("noto_bol");
        pdf.text(exp.role, rightMargin, yPosition);
        pdf.setFontSize(9);
        yPosition += 5;
        pdf.setFont("noto_reg");
        pdf.setFontSize(11);
        pdf.text(exp.companyName, rightMargin, yPosition);
        pdf.setFontSize(11);
        pdf.setTextColor(77, 81, 96);
        pdf.setFontSize(7);
        pdf.text(exp.year, rightMargin, yPosition + 4);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);

        // jd
        yPosition += 10;
        const JD = pdf.splitTextToSize(exp.description, 80);
        pdf.text(JD, rightMargin, yPosition, { align: "left" });
      });
    }
    yPosition += 10;
    // projects section
    if (
      checkEach(projectDetails, "projectName") ||
      checkEach(projectDetails, "techStack") ||
      checkEach(projectDetails, "year") ||
      checkEach(projectDetails, "projectLink")
    ) {
      yPosition += 20;
      pdf.setTextColor(46, 49, 53);
      yPosition += 20;
      pdf.setFont("noto_bol");
      pdf.setFontSize(16);
      pdf.text("PROJECTS", rightMargin, yPosition);

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      projectDetails.forEach((pro) => {
        yPosition += 14;

        pdf.setFont("noto_bol");
        pdf.text(pro.projectName, rightMargin, yPosition - 5);
        pdf.setFontSize(9);

        const tech = pdf.splitTextToSize(pro.techStack, 80);
        pdf.text(tech, rightMargin, yPosition, { align: "left" });

        yPosition += 5;
        pdf.setFont("noto_reg");
        pdf.setFontSize(9);
        yPosition += 5;
        pdf.addImage(linkIcon, rightMargin + 14, yPosition - 3, 3, 3);
        pdf.textWithLink("Live Link", rightMargin, yPosition, {
          url: `${pro.projectLink}`,
        });
        pdf.setFontSize(11);
        pdf.setTextColor(77, 81, 96);
        pdf.setFontSize(7);
        pdf.text(pro.year, rightMargin, yPosition + 5);
        yPosition += 3;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
      });
    }

    // skills section
    if(checkEach(skills, 'skillName')){
    pdf.setFont("noto_bol");
    pdf.setFontSize(16);
    pdf.setTextColor(46, 49, 53);
    pdf.text("SKILLS", leftMargin + 75, (xPosition += 11));
    pdf.setFont("noto_reg");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    skills.forEach((skill) => {
      pdf.text(skill.skillName, leftMargin + 75, (xPosition += 10));
    });
    }

    // certification section

    if (
      checkEach(certification, "certiName") ||
      checkEach(certification, "year")
    ) {
      yPosition += 5;
      pdf.setFont("noto_bol");
      pdf.setFontSize(16);
      pdf.setTextColor(46, 49, 53);
      pdf.text("CERTIFICATIONS / COURSES", leftMargin + 75, (xPosition += 11));
      pdf.setFont("noto_reg");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      yPosition += 5;
      certification.forEach((certi) => {
        pdf.setFont("noto_bol");
        pdf.text(certi.certiName, leftMargin + 75, (xPosition += 10));
        pdf.setFont("noto_reg");
        pdf.setTextColor(77, 81, 96);
        pdf.text(certi.year, leftMargin + 75, (xPosition += 5));
        pdf.setTextColor(0, 0, 0);
      });
    }

    if(checkEach(educationDetails, 'course') || checkEach(educationDetails, 'collegeName') || checkEach(educationDetails, 'location')  ) {
    // left side - education section
    yPosition += 5;
    pdf.setFont("noto_bol");
    pdf.setFontSize(16);
    pdf.setTextColor(46, 49, 53);
    pdf.text("EDUCATION", leftMargin + 75, (xPosition += 11));

    educationDetails.forEach((edu) => {
      pdf.setFont("noto_bol");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(edu.course, leftMargin + 75, (xPosition += 15));
      pdf.setFont("noto_reg");
      pdf.setFontSize(9);
      pdf.text(
        `${edu.collegeName} - ${edu.location}`,
        leftMargin + 75,
        (xPosition += 5)
      );
      pdf.setFontSize(10);
      pdf.setTextColor(46, 49, 53);
    });
    }

    return pdf;
  } catch (error) {
    toast.error("Error Generating the Resume try again...");
  }
};
