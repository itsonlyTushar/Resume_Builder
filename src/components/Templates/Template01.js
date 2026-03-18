import jsPDF from "jspdf";
import PlayFair from "../../assets/fonts/playfair/PlayfairDisplay-VariableFont_wght.ttf";
import toast from "react-hot-toast";
import { checkEach, checkStr } from "../../utils/helpers";

export const Template01 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    let leftMargin = 35;
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.width;
    let rightMargin = pageWidth - 10;
    const bottomMargin = 20;
    const pageHeight = pdf.internal.pageSize.height;

    const checkAddPage = (extraSpace = 0) => {
      if (yPosition + extraSpace > pageHeight - bottomMargin) {
        pdf.addPage();
        yPosition = 20; // or your top margin
      }
    };

    // gathring the data to make pdf
    const personalDetails = formData.personalDetails[0];
    const educationDetails = formData.educationDetails;
    const experienceDetails = formData.experienceDetails;
    const projectDetails = formData.projectDetails;
    const skills = formData.skills;
    const certification = formData.certification;

    pdf.addFont(PlayFair, "PlayFair", "normal");
    pdf.setFont("PlayFair");
    
    // personal details section.
    if (checkStr(personalDetails.firstName) || checkStr(personalDetails.lastName)) {
      pdf.setFontSize(28);
      const fullName = `${personalDetails.firstName || ""} ${personalDetails.lastName || ""}`.trim();
      pdf.text(fullName, leftMargin + 6, yPosition, { align: "center" });
    }
    
    pdf.setFontSize(9);
    if (checkStr(personalDetails.phoneNumber)) {
      pdf.text(personalDetails.phoneNumber, rightMargin, yPosition - 10, {
        align: "right",
      });
    }
    if (checkStr(personalDetails.email)) {
      pdf.text(personalDetails.email, rightMargin, yPosition - 5, {
        align: "right",
      });
    }

    if (checkStr(personalDetails.linkedin)) {
      pdf.text(`${personalDetails.linkedin}`, rightMargin, yPosition, {
        align: "right",
      });
    }
    pdf.setFontSize(9);

    // about me section
    if (checkStr(personalDetails.about)) {
      const summary = pdf.splitTextToSize(personalDetails.about, pageWidth - 14);
      pdf.text(summary, leftMargin - 26, yPosition + 10);
      yPosition += 10 + summary.length * 4;
    }

    // education section

    if (
      checkEach(educationDetails, "collegeName") ||
      checkEach(educationDetails, "course") ||
      checkEach(educationDetails, "location") ||
      checkEach(educationDetails, "year")
    ) {
      yPosition += 35;
      pdf.setFontSize(16);
      pdf.text("Education", leftMargin - 26, yPosition);
      educationDetails.forEach((edu, index) => {
        if (!checkStr(edu.collegeName) && !checkStr(edu.course) && !checkStr(edu.location) && !checkStr(edu.year)) return;
        checkAddPage(15);
        if (index !== 0) {
          yPosition += 10;
        }
        pdf.setFontSize(11);
        if (checkStr(edu.collegeName)) {
          pdf.text(edu.collegeName, leftMargin + 5, yPosition);
        }
        if (checkStr(edu.year)) {
          pdf.setFontSize(9);
          pdf.text(edu.year, pageWidth - 35, yPosition);
        }
        yPosition += 10;
        pdf.setFontSize(9);
        const courseInfo = [];
        if (checkStr(edu.course)) courseInfo.push(edu.course);
        if (checkStr(edu.location)) courseInfo.push(edu.location);
        if (courseInfo.length > 0) {
          pdf.text(courseInfo.join(" ~ "), leftMargin + 5, yPosition - 4);
        }
      });
    }

    // experience section
    if (
      checkEach(experienceDetails, "companyName") ||
      checkEach(experienceDetails, "role") ||
      checkEach(experienceDetails, "description") ||
      checkEach(experienceDetails, "year") ||
      checkEach(experienceDetails, "location")
    ) {
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Experience", leftMargin - 26, yPosition);
      experienceDetails.forEach((exp, index) => {
        if (!checkStr(exp.companyName) && !checkStr(exp.role) && !checkStr(exp.description) && !checkStr(exp.year) && !checkStr(exp.location)) return;
        checkAddPage(25);
        if (index !== 0) {
          yPosition += 20;
        }
        pdf.setFontSize(11);
        if (checkStr(exp.companyName)) {
          pdf.text(exp.companyName, leftMargin + 5, yPosition);
        }
        if (checkStr(exp.year)) {
          pdf.setFontSize(9);
          pdf.text(exp.year, pageWidth - 35, yPosition);
        }
        yPosition += 10;
        pdf.setFontSize(9);
        const roleInfo = [];
        if (checkStr(exp.role)) roleInfo.push(exp.role);
        if (checkStr(exp.location)) roleInfo.push(exp.location);
        if (roleInfo.length > 0) {
          pdf.text(roleInfo.join(" ~ "), leftMargin + 5, yPosition - 4);
        }
        if (checkStr(exp.description)) {
          yPosition += 5;
          const bullets = exp.description.split("•").filter(s => s.trim().length > 0);
          bullets.forEach((bullet) => {
            const bulletText = pdf.splitTextToSize(`• ${bullet.trim()}`, pageWidth - 45);
            checkAddPage(bulletText.length * 4);
            pdf.text(bulletText, leftMargin + 5, yPosition - 4);
            yPosition += bulletText.length * 4;
          });
        }
        yPosition += 2;
      });
    }

    // project section
    if (
      checkEach(projectDetails, "projectName") ||
      checkEach(projectDetails, "techStack") ||
      checkEach(projectDetails, "year") ||
      checkEach(projectDetails, "projectLink")
    ) {
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Projects", leftMargin - 26, yPosition);
      projectDetails.forEach((pro, index) => {
        if (!checkStr(pro.projectName) && !checkStr(pro.techStack) && !checkStr(pro.year) && !checkStr(pro.projectLink)) return;
        checkAddPage(15);
        if (index !== 0) {
          yPosition += 10;
        }
        pdf.setFontSize(11);
        if (checkStr(pro.projectName)) {
          pdf.text(pro.projectName, leftMargin + 5, yPosition);
        }
        if (checkStr(pro.year)) {
          pdf.setFontSize(9);
          pdf.text(pro.year, pageWidth - 35, yPosition);
        }
        yPosition += 10;
        pdf.setFontSize(9);
        if (checkStr(pro.techStack)) {
          pdf.text(pro.techStack, leftMargin + 5, yPosition - 4);
          yPosition += 2;
        }
        if (checkStr(pro.description)) {
          yPosition += 2;
          const desc = pdf.splitTextToSize(pro.description, pageWidth - 40);
          checkAddPage(desc.length * 4);
          pdf.text(desc, leftMargin + 5, yPosition);
          yPosition += desc.length * 4;
        }
        if (checkStr(pro.projectLink)) {
          yPosition += 2;
          pdf.setTextColor(0, 102, 204);
          pdf.textWithLink(pro.projectLink, leftMargin + 5, yPosition, { url: pro.projectLink });
          pdf.setTextColor(0, 0, 0);
          yPosition += 4;
        }
      });
    }

    // certification section
    if (
      checkEach(certification, "certiName") ||
      checkEach(certification, "year")
    ) {
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Certificates", leftMargin - 26, yPosition);
      certification.forEach((cer, index) => {
        if (!checkStr(cer.certiName) && !checkStr(cer.year)) return;
        checkAddPage(15);
        if (index !== 0) {
          yPosition += 10;
        }
        pdf.setFontSize(11);
        if (checkStr(cer.certiName)) {
          pdf.text(cer.certiName, leftMargin + 5, yPosition);
        }
        if (checkStr(cer.year)) {
          pdf.setFontSize(9);
          pdf.text(cer.year, pageWidth - 35, yPosition);
        }
      });
    }

    if (checkEach(skills, "skillName")) {
      // skills section
      yPosition += 20;
      checkAddPage(15);
      pdf.setFontSize(14);
      pdf.text("Skills", leftMargin - 26, yPosition);
      yPosition += 6;
      pdf.setFontSize(9);
      const skillsList = skills.filter(s => checkStr(s.skillName)).map(s => s.skillName).join(" • ");
      const skillsWrapped = pdf.splitTextToSize(skillsList, pageWidth - 14);
      checkAddPage(skillsWrapped.length * 4);
      pdf.text(skillsWrapped, leftMargin - 26, yPosition);
      yPosition += skillsWrapped.length * 4;
    }

    return pdf;
  } catch (error) {
    toast.error("Error Generating the Resume try again...");
  }
};
