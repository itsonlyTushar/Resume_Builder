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
  
    // gathring the data to make pdf
    const personalDetails = formData.personalDetails[0];
    const educationDetails = formData.educationDetails;
    const experienceDetails = formData.experienceDetails;
    const projectDetails = formData.projectDetails;
    const skills = formData.skills;
    const certification = formData.certification;

  
    pdf.addFont(PlayFair, "PlayFair", "normal");
    pdf.setFont("PlayFair");
    pdf.setFontSize(28);
  
    // personal details section.
    pdf.text(
      `${personalDetails.firstName} ${personalDetails.lastName}`,
      leftMargin,
      yPosition,
      { align: "center" }
    );
    pdf.setFontSize(9);
  
    pdf.text(`${personalDetails.phoneNumber}`, rightMargin, yPosition - 10, {
      align: "right",
    });
    pdf.text(`${personalDetails.email}`, rightMargin, yPosition - 5, {
      align: "right",
    });
  
    if (checkStr(personalDetails.linkedin)) {
      pdf.text(`${personalDetails.linkedin}`, rightMargin, yPosition, {
        align: "right",
      });
    }
    pdf.setFontSize(9);
  
    // about me section
    const summary = pdf.splitTextToSize(personalDetails.about, pageWidth - 14);
    pdf.text(summary, leftMargin - 26, yPosition + 10);
  
    // education section
    yPosition += 35;
    pdf.setFontSize(16);
    pdf.text("Education", leftMargin - 26, yPosition);
    educationDetails.forEach((edu, index) => {
      if (index !== 0) {
        yPosition += 10;
      }
      pdf.setFontSize(11);
      pdf.text(edu.collegeName, leftMargin + 5, yPosition);
      pdf.setFontSize(9);
      pdf.text(edu.year, pageWidth - 35, yPosition);
      yPosition += 10;
      pdf.setFontSize(9);
      pdf.text(`${edu.course} ~ ${edu.location}`, leftMargin + 5, yPosition - 4);
    });
  
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
        if (index !== 0) {
          yPosition += 20;
        }
        pdf.setFontSize(11);
  
        pdf.text(exp.companyName, leftMargin + 5, yPosition);
        
        pdf.setFontSize(9);
        pdf.text(exp.year, pageWidth - 35, yPosition);
        yPosition += 10;
        pdf.setFontSize(9);
        pdf.text(`${exp.role} ~ ${exp.location}`, leftMargin + 5, yPosition - 4);
        yPosition += 5;
        const description = pdf.splitTextToSize(exp.description, pageWidth - 40)
        pdf.text(description, leftMargin + 5, yPosition - 4);
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
        if (index !== 0) {
          yPosition += 10;
        }
        pdf.setFontSize(11);
        pdf.text(pro.projectName, leftMargin + 5, yPosition);
        pdf.setFontSize(9);
        pdf.text(pro.year, pageWidth - 35, yPosition);
        yPosition += 10;
        pdf.setFontSize(9);
        pdf.text(`${pro.techStack}`, leftMargin + 5, yPosition - 4);
        pdf.text(`${pro.projectLink}`, leftMargin + 5, yPosition + 2);
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
        if (index !== 0) {
          yPosition += 10;
        }
        pdf.setFontSize(11);
        pdf.text(cer.certiName, leftMargin + 5, yPosition);
        pdf.setFontSize(9);
        pdf.text(cer.year, pageWidth - 35, yPosition);
      });
    }


  
    // skills section
    yPosition += 20;
    pdf.setFontSize(14);
    pdf.text("Skills", leftMargin - 26, yPosition);
    skills.forEach((skill, index) => {
      if (index !== 0) {
        yPosition += 10;
      }
      pdf.setFontSize(11);
      pdf.text(skill.skillName, leftMargin + 5, yPosition);
    });
    
    return pdf;

  } catch(error) {
    toast.error('Error Generating the Resume try again...')
  }
};
