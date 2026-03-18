import jsPDF from "jspdf";
import toast from "react-hot-toast";
import montserrat_reg from "../../assets/fonts/montserrat/Montserrat-Regular.ttf";
import montserrat_bold from "../../assets/fonts/montserrat/Montserrat-Bold.ttf";
import { checkEach, checkStr } from "../../utils/helpers";

export const Template12 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yLeft = 45;
    let yRight = 55;

    const personal = formData.personalDetails[0];
    const skills = formData.skills;
    const education = formData.educationDetails;
    const experience = formData.experienceDetails;
    const projects = formData.projectDetails;
    const certs = formData.certification;

    pdf.addFont(montserrat_reg, "montserrat_reg", "normal");
    pdf.addFont(montserrat_bold, "montserrat_bold", "bold");

    // Header
    pdf.setFillColor(44, 62, 80); // dark blue-gray
    pdf.rect(0, 0, pageWidth, 40, "F");
    pdf.setFont("montserrat_bold");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text(`${personal.firstName} ${personal.lastName}`, 20, 22);
    pdf.setFontSize(10);
    pdf.text(`${personal.email} | ${personal.phoneNumber}`, 20, 30);
    if (checkStr(personal.linkedin)) {
      pdf.text(`LinkedIn: ${personal.linkedin}`, 20, 36);
    }

    const pageHeight = pdf.internal.pageSize.getHeight();
    const bottomMargin = 20;

    const drawSidebar = () => {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, 60, pageHeight, "F");
    };

    const checkRightPage = (extraSpace = 0) => {
      if (yRight + extraSpace > pageHeight - bottomMargin) {
        pdf.addPage();
        drawSidebar();
        yRight = 15;
        yLeft = 15;
      }
    };

    const checkLeftPage = (extraSpace = 0) => {
      if (yLeft + extraSpace > pageHeight - bottomMargin) {
        pdf.addPage();
        drawSidebar();
        yLeft = 15;
        yRight = 15;
      }
    };

    // Sidebar Background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 40, 60, 260, "F");

    // Sidebar - Skills
    pdf.setFont("montserrat_bold");
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(12);
    pdf.text("Skills", 10, yLeft);
    yLeft += 8;
    pdf.setFont("montserrat_reg");
    pdf.setFontSize(9);
    const skillStr = skills.filter(s => s.skillName).map(s => s.skillName).join(" • ");
    const skillLines = pdf.splitTextToSize(skillStr, 45);
    skillLines.forEach((line) => {
      checkLeftPage(5);
      pdf.text(line, 10, yLeft);
      yLeft += 5;
    });
    // Sidebar - Certifications
    if (checkEach(certs, "certiName")) {
      yLeft += 8;
      pdf.setFont("montserrat_bold");
      pdf.setFontSize(10);
      pdf.text("Certifications", 10, yLeft);
      yLeft += 6;
      pdf.setFont("montserrat_reg");
      pdf.setFontSize(9);
      certs.forEach((c) => {
        checkLeftPage(12);
        // Split certification name to fit sidebar width (max 45mm)
        const certLines = pdf.splitTextToSize(`• ${c.certiName}`, 45);
        certLines.forEach((line) => {
          checkLeftPage(5);
          pdf.text(line, 10, yLeft);
          yLeft += 5;
        });
        if (c.year) {
          pdf.setFontSize(7);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`${c.year}`, 12, yLeft);
          pdf.setFontSize(9);
          pdf.setTextColor(44, 62, 80);
          yLeft += 4;
        }
      });
    }

    // Right Column Content
    let rightX = 70;

    // Section: Profile
    pdf.setFont("montserrat_bold");
    pdf.setFontSize(12);
    pdf.text("Profile", rightX, yRight);
    yRight += 6;
    pdf.setFont("montserrat_reg");
    pdf.setFontSize(9);
    const aboutLines = pdf.splitTextToSize(personal.about, 130);
    pdf.text(aboutLines, rightX, yRight);
    yRight += aboutLines.length * 5;

    // Divider
    pdf.setDrawColor(220);
    pdf.line(rightX, yRight + 2, 200, yRight + 2);
    yRight += 8;

    // Section: Education
    if (checkEach(education, "collegeName")) {
      pdf.setFont("montserrat_bold");
      pdf.setFontSize(12);
      pdf.text("Education", rightX, yRight);
      yRight += 6;
      education.forEach((edu) => {
        checkRightPage(18);
        pdf.setFont("montserrat_bold");
        pdf.setFontSize(10);
        pdf.text(`${edu.course} - ${edu.collegeName}`, rightX, yRight);
        yRight += 5;
        pdf.setFont("montserrat_reg");
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`${edu.location} | ${edu.year}`, rightX, yRight);
        yRight += 8;
        pdf.setTextColor(44, 62, 80);
      });
      pdf.line(rightX, yRight, 200, yRight);
      yRight += 8;
    }

    // Section: Experience
    if (checkEach(experience, "companyName")) {
      pdf.setFont("montserrat_bold");
      pdf.setFontSize(12);
      pdf.text("Experience", rightX, yRight);
      yRight += 6;
      experience.forEach((exp) => {
        checkRightPage(25);
        pdf.setFont("montserrat_bold");
        pdf.setFontSize(10);
        pdf.text(`${exp.role} - ${exp.companyName}`, rightX, yRight);
        yRight += 5;
        pdf.setFont("montserrat_reg");
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`${exp.location} | ${exp.year}`, rightX, yRight);
        yRight += 5;
        pdf.setFontSize(9);
        pdf.setTextColor(44, 62, 80);
        if (exp.description) {
          const bullets = exp.description.split("•").filter(s => s.trim().length > 0);
          bullets.forEach((bullet) => {
            const bulletLines = pdf.splitTextToSize(`• ${bullet.trim()}`, 125);
            bulletLines.forEach((line) => {
              checkRightPage(5);
              pdf.text(line, rightX, yRight);
              yRight += 5;
            });
          });
        }
      });
      pdf.line(rightX, yRight, 200, yRight);
      yRight += 8;
    }

    // Section: Projects
    if (checkEach(projects, "projectName")) {
      pdf.setFont("montserrat_bold");
      pdf.setFontSize(12);
      pdf.text("Projects", rightX, yRight);
      yRight += 6;
      projects.forEach((pro) => {
        checkRightPage(20);
        pdf.setFont("montserrat_bold");
        pdf.setFontSize(10);
        pdf.text(`${pro.projectName} (${pro.techStack})`, rightX, yRight);
        yRight += 5;

        if (pro.description) {
          pdf.setFont("montserrat_reg");
          pdf.setFontSize(9);
          pdf.setTextColor(44, 62, 80);
          const descLines = pdf.splitTextToSize(pro.description, 130);
          descLines.forEach((line) => {
            checkRightPage(5);
            pdf.text(line, rightX, yRight);
            yRight += 5;
          });
        }

        if (pro.projectLink) {
          checkRightPage(6);
          pdf.setFontSize(8);
          pdf.setTextColor(0, 102, 204);
          pdf.textWithLink(`${pro.projectLink}`, rightX, yRight, {
            url: pro.projectLink,
          });
          yRight += 6;
          pdf.setTextColor(44, 62, 80);
        }
        if (pro.year) {
          pdf.setFontSize(8);
          pdf.setTextColor(120, 120, 120);
          pdf.text(`${pro.year}`, rightX, yRight);
          yRight += 4;
          pdf.setTextColor(44, 62, 80);
        }
        yRight += 2;
      });
    }

    return pdf;
  } catch (err) {
    toast.error("Failed to generate Resume. Please try again.");
  }
};
