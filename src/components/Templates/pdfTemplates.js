import jsPDF from "jspdf";
import Playflair from "../../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf";
import Inter_reg from "../../assets/fonts/inter/InterTight_Regular.ttf";
import Inter_bol from "../../assets/fonts/inter/InterTight_Bold.ttf";
import merium_bol from "../../assets/fonts/merrium/Merriweather_Bold.ttf";
import merium_reg from "../../assets/fonts/merrium/Merriweather_Regular.ttf";
import roboto_reg from "../../assets/fonts/roboto/Roboto_Regular.ttf";
import roboto_bol from "../../assets/fonts/roboto/Roboto_Medium.ttf";
import oxam from "../../assets/fonts/poppins/Oxanium_SemiBold.ttf";
import Poppins_reg from "../../assets/fonts/poppins/Poppins_Regular.ttf";
import Poppins_bol from "../../assets/fonts/poppins/Poppins_SemiBold.ttf";
import Arvo_reg from "../../assets/fonts/arvo/Arvo_Regular.ttf"
import Arvo_bol from "../../assets/fonts/arvo/Arvo_Bold.ttf"


export const Template101 = ({ formData }) => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
    
      try {
        // Helper function to check if content exists and is not empty
        const hasContent = (str) => str && str.trim().length > 0;
    
        // Helper function to validate if any field in an array of fields has content
        const hasAnyContent = (fields) => fields.some(field => hasContent(field));
    
        // Reset the document and set initial styles
        doc.addFont(Playflair, "Playfair", "normal");
        doc.setFont("Playfair");
        doc.setFontSize(12);
    
        const leftMargin = 20;
        let yPosition = 15;
        const pageWidth = doc.internal.pageSize.width;
    
        // Get personal details
        const details = formData.personalDetails?.[0] || {};
    
        // Header - Name (only display if either first or last name exists)
        if (hasContent(details.firstName) || hasContent(details.lastName)) {
          doc.setFontSize(28);
          doc.setFont("Playfair", "bold");
          doc.text(
            `${details.firstName || ""} ${details.lastName || ""}`.trim(),
            pageWidth / 2,
            yPosition,
            { align: "center" }
          );
          yPosition += 10;
        }
    
        // Contact Information (only display if any contact info exists)
        const contactFields = [
          details.address,
          details.phoneNumber,
          details.email,
          details.linkedin
        ].filter(hasContent);
    
        if (contactFields.length > 0) {
          doc.setFontSize(10);
          doc.setFont("Playfair", "normal");
          const contactInfo = contactFields.join(" • ");
          doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
          yPosition += 5;
        }
    
        // About Section
        if (hasContent(details.about)) {
          yPosition += 10;
          doc.setFont("Playfair", "bold");
          doc.setFontSize(16);
          doc.text("About Me", leftMargin, yPosition);
          doc.line(
            leftMargin,
            yPosition + 2,
            pageWidth - leftMargin,
            yPosition + 2
          );
    
          yPosition += 8;
          doc.setFont("Playfair", "normal");
          doc.setFontSize(12);
          const description = doc.splitTextToSize(
            details.about,
            pageWidth - 2 * leftMargin
          );
          doc.text(description, leftMargin, yPosition);
          yPosition += description.length * 5;
        }
    
        // Education Section
        const validEducation = formData.educationDetails?.filter(edu => 
          hasAnyContent([edu.collegeName, edu.course, edu.location, edu.year])
        ) || [];
    
        if (validEducation.length > 0) {
          yPosition += 10;
          doc.setFont("Playfair", "bold");
          doc.setFontSize(16);
          doc.text("Education", leftMargin, yPosition);
          doc.line(
            leftMargin,
            yPosition + 2,
            pageWidth - leftMargin,
            yPosition + 2
          );
    
          validEducation.forEach((edu) => {
            yPosition += 8;
            doc.setFont("Playfair", "bold");
            doc.setFontSize(12);
            
            if (hasContent(edu.collegeName)) {
              doc.text(edu.collegeName, leftMargin, yPosition);
            }
            
            if (hasContent(edu.location)) {
              doc.setFont("Playfair", "normal");
              doc.text(edu.location, pageWidth - leftMargin, yPosition, {
                align: "right",
              });
            }
    
            if (hasContent(edu.course) || hasContent(edu.year)) {
              yPosition += 6;
              if (hasContent(edu.course)) {
                doc.text(edu.course, leftMargin, yPosition);
              }
              if (hasContent(edu.year)) {
                doc.text(edu.year, pageWidth - leftMargin, yPosition, {
                  align: "right",
                });
              }
            }
          });
        }
    
        // Experience Section
        const validExperiences = formData.experienceDetails?.filter(exp => 
          hasAnyContent([exp.role, exp.companyName, exp.location, exp.year, exp.description])
        ) || [];
    
        if (validExperiences.length > 0) {
          yPosition += 10;
          doc.setFont("Playfair", "bold");
          doc.setFontSize(16);
          doc.text("Experience", leftMargin, yPosition);
          doc.line(
            leftMargin,
            yPosition + 2,
            pageWidth - leftMargin,
            yPosition + 2
          );
    
          validExperiences.forEach((exp) => {
            yPosition += 12;
            doc.setFont("Playfair", "bold");
            doc.setFontSize(12);
            
            if (hasContent(exp.role)) {
              doc.text(exp.role, leftMargin, yPosition);
            }
            
            if (hasContent(exp.location)) {
              doc.text(exp.location, pageWidth - leftMargin, yPosition, {
                align: "right",
              });
            }
    
            if (hasContent(exp.companyName) || hasContent(exp.year)) {
              yPosition += 6;
              doc.setFont("Playfair", "normal");
              if (hasContent(exp.companyName)) {
                doc.text(exp.companyName, leftMargin, yPosition);
              }
              if (hasContent(exp.year)) {
                doc.text(exp.year, pageWidth - leftMargin, yPosition, {
                  align: "right",
                });
              }
            }
    
            if (hasContent(exp.description)) {
              yPosition += 6;
              const description = doc.splitTextToSize(
                exp.description,
                pageWidth - 2 * leftMargin
              );
              doc.text(description, leftMargin, yPosition);
              yPosition += description.length * 5;
            }
          });
        }
    
        // Projects Section
        const validProjects = formData.projectDetails?.filter(project => 
          hasAnyContent([project.projectName, project.description, project.techStack, project.projectLink, project.year])
        ) || [];
    
        if (validProjects.length > 0) {
          yPosition += 10;
          doc.setFont("Playfair", "bold");
          doc.setFontSize(16);
          doc.text("University Projects", leftMargin, yPosition);
          doc.line(
            leftMargin,
            yPosition + 2,
            pageWidth - leftMargin,
            yPosition + 2
          );
    
          validProjects.forEach((project) => {
            yPosition += 12;
            doc.setFont("Playfair", "bold");
            doc.setFontSize(12);
            
            if (hasContent(project.projectName)) {
              doc.text(project.projectName, leftMargin, yPosition);
            }
            
            if (hasContent(project.year)) {
              doc.text(project.year, pageWidth - leftMargin, yPosition, {
                align: "right",
              });
            }
    
            if (hasContent(project.description)) {
              yPosition += 6;
              doc.setFont("Playfair", "normal");
              const description = doc.splitTextToSize(
                project.description,
                pageWidth - 2 * leftMargin
              );
              doc.text(description, leftMargin, yPosition);
              yPosition += description.length * 5;
            }
    
            if (hasContent(project.techStack)) {
              yPosition += 6;
              doc.setFontSize(10);
              doc.text(`Technologies: ${project.techStack}`, leftMargin, yPosition);
            }
    
            if (hasContent(project.projectLink)) {
              doc.setFont("Playfair", "normal");
      
              yPosition += 5;
              doc.text(`Link: ${project.projectLink}`, leftMargin, yPosition);
            }
          });
        }
    
        // Skills Section
        const validSkills = formData.skills?.filter(skill => hasContent(skill.skillName)) || [];
    
        if (validSkills.length > 0) {
          yPosition += 10;
          doc.setFont("Playfair", "bold");
          doc.setFontSize(16);
          doc.text("Additional", leftMargin, yPosition);
          doc.line(
            leftMargin,
            yPosition + 2,
            pageWidth - leftMargin,
            yPosition + 2
          );
          
          yPosition += 10;
          doc.setFont("Playfair", "bold");
          doc.setFontSize(12);
          doc.text("Technical Skills:", leftMargin, yPosition);
          
          const skills = validSkills
            .map((skill) => skill.skillName.trim())
            .join(", ");
          
          doc.setFont("Playfair", "normal");
          doc.setFontSize(10);
          yPosition += 6;
          const wrappedSkills = doc.splitTextToSize(
            skills,
            pageWidth - 2 * leftMargin
          );
          doc.text(wrappedSkills, leftMargin, yPosition);
        }
    
        return doc;
      } catch (error) {
        console.error("PDF Generation Error:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
      }
    };

export const Template102 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts - Using Roboto for optimal ATS readability
    doc.addFont(roboto_reg, "roboto_reg", "normal");
    doc.addFont(roboto_bol, "roboto_bol", "normal");
    doc.setFont("roboto_reg");

    // Initialize basic layout parameters
    const leftMargin = 20;
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * leftMargin;

    const details = formData.personalDetails?.[0] || {};

        // Helper function to check if a string has meaningful content
        const hasContent = (str) => str && str.trim().length > 0;

        // Helper function for section headers
        const addSectionHeader = (title) => {
          doc.setFont("roboto_bol");
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(title.toUpperCase(), leftMargin, yPosition);
          yPosition += 2;
          doc.setLineWidth(0.5);
          doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
          yPosition += 5;
        };


    // Header Section - Only display if name exists
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setFontSize(22);
      doc.setFont("roboto_bol");
      const fullName = [details.firstName || "", details.lastName || ""]
        .filter(Boolean)
        .join(" ")
        .toUpperCase();
      doc.text(fullName, leftMargin, yPosition);
    }

    // Contact Information - Only display if any contact info exists
    const contactFields = [
      details.email,
      details.phoneNumber,
      details.linkedin,
      details.location,
    ].filter(hasContent);

    if (contactFields.length > 0) {
      yPosition += 8;
      doc.setFont("roboto_reg");
      doc.setFontSize(10);
      const contactInfo = contactFields.join(" | ");
      doc.text(contactInfo, leftMargin, yPosition);
    }

    // Professional Summary - Only display if about text exists
    if (hasContent(details.about)) {
      yPosition += 12;
      addSectionHeader("Professional Summary");
      doc.setFont("roboto_reg");
      doc.setFontSize(10);
      const summary = doc.splitTextToSize(details.about, contentWidth);
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 5 + 5;
    }

    // Core Competencies/Skills Section - Only display if skills exist and have names
    const validSkills = formData.skills?.filter(skill => hasContent(skill.skillName)) || [];
    if (validSkills.length > 0) {
      yPosition += 8;
      addSectionHeader("Core Competencies");
      doc.setFont("roboto_reg");
      doc.setFontSize(10);

      const skillsLine = validSkills
        .map((skill) => skill.skillName.trim())
        .join(" • ");

      const wrappedSkills = doc.splitTextToSize(skillsLine, contentWidth - 5);
      doc.text(wrappedSkills, leftMargin, yPosition);
      yPosition += wrappedSkills.length * 5 + 3;
    }

    // Professional Experience - Only display if valid experiences exist
    const validExperiences = formData.experienceDetails?.filter(exp => 
      hasContent(exp.role) || hasContent(exp.companyName) || hasContent(exp.description)
    ) || [];

    if (validExperiences.length > 0) {
      yPosition += 5;
      addSectionHeader("Professional Experience");

      validExperiences.forEach((exp) => {
        if (hasContent(exp.role)) {
          doc.setFont("roboto_bol");
          doc.setFontSize(11);
          doc.text(exp.role, leftMargin, yPosition);
        }

        if (hasContent(exp.year)) {
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          doc.text(exp.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 5;
        
        if (hasContent(exp.companyName)) {
          doc.text(exp.companyName, leftMargin, yPosition);
        }
        
        if (hasContent(exp.location)) {
          doc.text(exp.location, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        if (hasContent(exp.description)) {
          yPosition += 6;
          const bullets = exp.description.split("•").filter(hasContent);
          bullets.forEach((bullet) => {
            const bulletText = `• ${bullet.trim()}`;
            const wrappedBullet = doc.splitTextToSize(
              bulletText,
              contentWidth - 5
            );
            doc.text(wrappedBullet, leftMargin + 5, yPosition);
            yPosition += wrappedBullet.length * 5;
          });
        }
        yPosition += 8;
      });
    }

    // Projects Section - Only display if valid projects exist
    const validProjects = formData.projectDetails?.filter(project => 
      hasContent(project.projectName) || hasContent(project.description)
    ) || [];

    if (validProjects.length > 0) {
      yPosition += 5;
      addSectionHeader("Technical Projects");

      validProjects.forEach((project) => {
        if (hasContent(project.projectName)) {
          doc.setFont("roboto_bol");
          doc.setFontSize(11);
          doc.text(project.projectName, leftMargin, yPosition);
        }

        if (hasContent(project.year)) {
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          doc.text(project.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        if (hasContent(project.description)) {
          yPosition += 5;
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          const wrappedDesc = doc.splitTextToSize(
            project.description,
            contentWidth - 5
          );
          doc.text(wrappedDesc, leftMargin, yPosition);
          yPosition += wrappedDesc.length * 5;
        }

        if (hasContent(project.techStack)) {
          yPosition += 4;
          const techStackText = `Technologies: ${project.techStack}`;
          const wrappedTech = doc.splitTextToSize(
            techStackText,
            contentWidth - 5
          );
          doc.text(wrappedTech, leftMargin, yPosition);
          yPosition += wrappedTech.length * 5;
        }

        if (hasContent(project.projectLink)) {
          const clickText = "Link";
          doc.text(clickText, leftMargin, yPosition);
          doc.link(leftMargin, yPosition - 3, doc.getTextWidth(clickText), 5, {
            url: project.projectLink,
          });
        }

        yPosition += 8;
      });
    }

    // Education Section - Only display if valid education entries exist
    const validEducation = formData.educationDetails?.filter(edu => 
      hasContent(edu.course) || hasContent(edu.collegeName)
    ) || [];

    if (validEducation.length > 0) {
      yPosition += 5;
      addSectionHeader("Education");

      validEducation.forEach((edu) => {
        if (hasContent(edu.course)) {
          doc.setFont("roboto_bol");
          doc.setFontSize(11);
          doc.text(edu.course, leftMargin, yPosition);
        }

        if (hasContent(edu.year)) {
          doc.setFont("roboto_reg");
          doc.setFontSize(10);
          doc.text(edu.year, pageWidth - leftMargin, yPosition, {
            align: "right",
          });
        }

        yPosition += 5;
        
        if (hasContent(edu.collegeName) || hasContent(edu.location)) {
          doc.setFont("roboto_reg");
          const eduLocation = [edu.collegeName, edu.location]
            .filter(hasContent)
            .join(", ");
          doc.text(eduLocation, leftMargin, yPosition);
        }
        yPosition += 8;
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const Template103 = ({ formData }) => {
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
    const hasAnyContent = (fields) => fields.some(field => hasContent(field));

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
      details.linkedin
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
    const validExperiences = formData.experienceDetails?.filter(exp => 
      hasAnyContent([exp.role, exp.companyName, exp.location, exp.year, exp.description])
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
            .filter(desc => hasContent(desc));
          
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
    const validProjects = formData.projectDetails?.filter(project => 
      hasAnyContent([
        project.projectName,
        project.description,
        project.techStack,
        project.projectLink,
        project.year
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
          doc.setFontSize(8)
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
          doc.setTextColor(80,80,80)
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
    const validEducation = formData.educationDetails?.filter(edu => 
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

    // Skills Section - Only display if valid skills exist
    const validSkills = formData.skills?.filter(skill => 
      hasContent(skill.skillName)
    ) || [];

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

export const Template104 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add Inter fonts
    doc.addFont(Inter_reg, "Inter_reg", "normal");
    doc.addFont(Inter_bol, "Inter_bol", "normal");
    doc.setFont("Inter_reg");

    const leftMargin = 20;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;

    // Set mint green background
    doc.setFillColor(230, 242, 236);
    doc.rect(0, 0, pageWidth, 297, "F");

    const details = formData.personalDetails?.[0] || {};

    // Helper function to check if a string has meaningful content
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to check if a section has valid data
    const hasValidData = (section, requiredFields) => {
      if (!section) return false;
      if (Array.isArray(section)) {
        return (
          section.length > 0 &&
          section.some((item) =>
            requiredFields.some((field) => hasContent(item[field]))
          )
        );
      }
      return requiredFields.some((field) => hasContent(section[field]));
    };

    // Helper function to add section header
    const addSectionHeader = (title) => {
      yPosition += 5;
      doc.setFont("Inter_bol");
      doc.setFontSize(12);
      doc.setTextColor(27, 77, 62);
      doc.text(title.toUpperCase(), leftMargin, yPosition);
    };

    // Helper function to add section divider
    const addSectionDivider = () => {
      yPosition += 5;
      doc.setDrawColor(83, 187, 137);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 5;
    };

    // Header section - Only show if name exists
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setTextColor(27, 77, 62);
      doc.setFontSize(22);
      doc.setFont("Inter_bol");
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .toUpperCase();
      doc.text(fullName, leftMargin, yPosition);

      // Contact Information - Only show if any contact detail exists
      const contactFields = [
        details.phoneNumber,
        details.email,
        details.linkedin,
      ].filter(hasContent);

      if (contactFields.length > 0) {
        yPosition += 8;
        doc.setFontSize(9);
        doc.setFont("Inter_reg");
        doc.text(contactFields.join(" | "), leftMargin, yPosition);
      }
    }

    // Professional Summary - Only if about text exists
    if (hasContent(details.about)) {
      yPosition += 10;
      const summary = doc.splitTextToSize(
        details.about,
        pageWidth - 2 * leftMargin
      );
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 3;
      addSectionDivider();
    }

    // Experience Section
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      addSectionHeader("EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          yPosition += 8;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(exp.role)) {
            doc.text(exp.role, leftMargin, yPosition);
          }

          const expDetails = [exp.companyName, exp.location, exp.year]
            .filter(hasContent)
            .join(" | ");

          if (expDetails) {
            yPosition += 5;
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.text(expDetails, leftMargin, yPosition);
          }

          if (hasContent(exp.description)) {
            yPosition += 8;
            const bullets = exp.description.split("•").filter(hasContent);
            bullets.forEach((bullet) => {
              const bulletPoint = `• ${bullet.trim()}`;
              const wrappedBullet = doc.splitTextToSize(
                bulletPoint,
                pageWidth - 2 * leftMargin - 5
              );
              doc.setFontSize(9);
              doc.text(wrappedBullet, leftMargin + 5, yPosition);
              yPosition += wrappedBullet.length * 3;
            });
          }
        }
      });
      addSectionDivider();
    }

    // Project Section
    if (hasValidData(formData.projectDetails, ["year", "projectName"])) {
      addSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName) || hasContent(pro.year)) {
          yPosition += 10;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          
          const projectHeader = [pro.projectName, pro.year]
            .filter(hasContent)
            .join(" | ");
          
          if (projectHeader) {
            doc.text(projectHeader, leftMargin, yPosition);
          }

          if (hasContent(pro.projectLink)) {
            const clickText = "  -  Link";
            doc.setFontSize(8)
            doc.text(clickText, leftMargin - 2, yPosition + 5);
            doc.link(
              leftMargin - 2,
              yPosition + 3,
              doc.getTextWidth(clickText),
              5,
              { url: pro.projectLink }
            );
          }

          if (hasContent(pro.description)) {
            yPosition += 8;
            doc.setFont("Inter_reg");
            doc.setFontSize(9);
            doc.text(`• ${pro.description}`, leftMargin + 5, yPosition);
          }
        }
      });
      yPosition += 3
      addSectionDivider();
    }

    // Education Section
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      addSectionHeader("EDUCATION");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.course) || hasContent(edu.collegeName)) {
          yPosition += 8;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(edu.course)) {
            doc.text(edu.course, leftMargin, yPosition);
          }

          const eduDetails = [edu.collegeName, edu.location, edu.year]
            .filter(hasContent)
            .join(" | ");

          if (eduDetails) {
            yPosition += 8;
            doc.setFont("Inter_reg");
            doc.setFontSize(10);
            doc.text(eduDetails, leftMargin, yPosition);
          }
        }
      });
      addSectionDivider();
    }

    // Skills Section
    const skills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );
    
    if (skills.length > 0) {
      addSectionHeader("SKILLS");

      yPosition += 8;
      doc.setFont("Inter_reg");
      doc.setFontSize(9);

      // Create three columns for skills
      const skillsPerColumn = Math.ceil(skills.length / 3);
      const columnWidth = (pageWidth - 2 * leftMargin) / 3;
      
      skills.forEach((skill, index) => {
        const columnIndex = Math.floor(index / skillsPerColumn);
        const xPosition = leftMargin + columnWidth * columnIndex;
        const localY = yPosition + (index % skillsPerColumn) * 8;

        doc.text(`• ${skill.skillName}`, xPosition, localY);
      });

      yPosition += skillsPerColumn * 8 + 5;
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const Template105 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts
    doc.addFont(Inter_reg, "Inter_reg", "normal");
    doc.addFont(Inter_bol, "Inter_bol", "normal");
    doc.addFont(oxam, "oxam", "normal");
    doc.setFont("oxam");

    // Layout constants
    const leftMargin = 15;
    const rightColumnStart = 70;
    let leftYPosition = 20;
    let rightYPosition = 20;
    const pageWidth = doc.internal.pageSize.width;

    // Helper function to check if a string has meaningful content
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to check if a section has valid data
    const hasValidData = (section, requiredFields) => {
      if (!section) return false;
      if (Array.isArray(section)) {
        return (
          section.length > 0 &&
          section.some((item) =>
            requiredFields.some((field) => hasContent(item[field]))
          )
        );
      }
      return requiredFields.some((field) => hasContent(section[field]));
    };

    // Helper function to add right column section header
    const addRightSectionHeader = (title) => {
      rightYPosition += 6;
      doc.setFont("Inter_bol");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), rightColumnStart, rightYPosition);
      rightYPosition += 10;
    };

    const details = formData.personalDetails?.[0] || {};

    // Left Column - Dark background for sidebar
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, rightColumnStart - 5, 297, "F");

    // Sidebar - Name and Contact (only if there's content)
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("oxam");
      doc.setFontSize(20);
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .toUpperCase();
      doc.text(fullName, 10, leftYPosition);
      leftYPosition += 10;
    }

    // Contact Details (only if there's content)
    const contactInfo = [details.phoneNumber, details.email, details.linkedin]
      .filter(hasContent);
    
    if (contactInfo.length > 0) {
      doc.setFont("Inter_reg");
      doc.setFontSize(10);
      contactInfo.forEach((info) => {
        doc.text(info, 10, leftYPosition);
        leftYPosition += 6;
      });
    }

    // Skills in Sidebar (only if there's content)
    const validSkills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills.length > 0) {
      leftYPosition += 10;
      doc.setFont("Inter_bol");
      doc.text("SKILLS", 10, leftYPosition);
      leftYPosition += 6;

      doc.setFont("Inter_reg");
      validSkills.forEach((skill) => {
        doc.text(`• ${skill.skillName}`, 10, leftYPosition);
        leftYPosition += 5;
      });
    }

    // Experience in Right Column
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      doc.setTextColor(0, 0, 0);
      addRightSectionHeader("EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          if (hasContent(exp.role)) {
            doc.text(exp.role, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          doc.setFont("Inter_reg");
          doc.setFontSize(10);
          if (hasContent(exp.companyName)) {
            doc.text(exp.companyName, rightColumnStart, rightYPosition);
          }
          if (hasContent(exp.year)) {
            doc.text(exp.year, pageWidth - 15, rightYPosition, { align: "right" });
          }
          rightYPosition += 6;

          if (hasContent(exp.description)) {
            const wrappedDescription = doc.splitTextToSize(
              exp.description,
              pageWidth - rightColumnStart - 15
            );
            doc.setFontSize(10);
            doc.text(wrappedDescription, rightColumnStart, rightYPosition);
            rightYPosition += wrappedDescription.length * 5 + 5;
          }
        }
      });
    }

    // Education in Right Column
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      addRightSectionHeader("EDUCATION");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.collegeName) || hasContent(edu.course)) {
          if (hasContent(edu.collegeName)) {
            doc.setFont("Inter_bol");
            doc.setFontSize(12);
            doc.text(edu.collegeName, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          doc.setFont("Inter_reg");
          doc.setFontSize(10);
          if (hasContent(edu.course)) {
            doc.text(edu.course, rightColumnStart, rightYPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - 15, rightYPosition, { align: "right" });
          }
          rightYPosition += 6;

          if (hasContent(edu.location)) {
            const wrappedLocation = doc.splitTextToSize(
              edu.location,
              pageWidth - rightColumnStart - 15
            );
            doc.text(wrappedLocation, rightColumnStart, rightYPosition);
            rightYPosition += wrappedLocation.length * 5 + 5;
          }
        }
      });
    }

    // Projects in Right Column
    if (hasValidData(formData.projectDetails, ["projectName"])) {
      addRightSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName)) {
          rightYPosition += 6;
          doc.setFont("Inter_bol");
          doc.setFontSize(12);
          doc.text(pro.projectName, rightColumnStart, rightYPosition);
          rightYPosition += 6;

          doc.setFont("Inter_reg");
          doc.setFontSize(10);
          
          if (hasContent(pro.projectLink)) {
            doc.text(pro.projectLink, rightColumnStart, rightYPosition);
          }
          
          if (hasContent(pro.techStack)) {
            doc.text(
              `Techstack : ${pro.techStack}`,
              rightColumnStart,
              rightYPosition + 5
            );
          }
          
          if (hasContent(pro.year)) {
            doc.text(pro.year, pageWidth - 15, rightYPosition, { align: "right" });
          }
          rightYPosition += 6;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const Template106 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts
    doc.addFont(Poppins_reg, "Poppins_reg", "normal");
    doc.addFont(Poppins_bol, "Poppins_bol", "normal");
    doc.setFont("Poppins_reg");

    // Layout constants
    const leftMargin = 20;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * leftMargin;

    // Helper function to check if a string has meaningful content
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to check if a section has valid data
    const hasValidData = (section, requiredFields) => {
      if (!section) return false;
      if (Array.isArray(section)) {
        return (
          section.length > 0 &&
          section.some((item) =>
            requiredFields.some((field) => hasContent(item[field]))
          )
        );
      }
      return requiredFields.some((field) => hasContent(section[field]));
    };

    // Helper function for section headers with gray background
    const addSectionHeader = (title) => {
      // Create gray background rectangle
      doc.setFillColor(240, 240, 240);
      doc.rect(
        leftMargin - 5,
        yPosition - 5,
        pageWidth - 2 * (leftMargin - 5),
        10,
        "F"
      );
      
      // Add section title
      doc.setFont("Poppins_bol");
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      doc.text(title.toUpperCase(), leftMargin, yPosition + 2);
      yPosition += 12;
    };

    const details = formData.personalDetails?.[0] || {};

    // Header Section - Only display if name exists
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setFont("Poppins_bol");
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .toUpperCase();
      doc.text(fullName, leftMargin, yPosition);

      // Contact Information - Only display if any contact info exists
      const contactInfo = [details.address, details.email, details.linkedin]
        .filter(hasContent)
        .join(" | ");

      if (contactInfo) {
        yPosition += 8;
        doc.setFont("Poppins_reg");
        doc.setFontSize(10);
        doc.text(contactInfo, leftMargin, yPosition);
      }
    }

    // Summary Section - Only display if about text exists
    if (hasContent(details.about)) {
      yPosition += 12;
      addSectionHeader("SUMMARY");
      doc.setFont("Poppins_reg");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const summary = doc.splitTextToSize(details.about, contentWidth);
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 5 + 5;
    }

    // Technical Skills Section - Only display if valid skills exist
    const validSkills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills.length > 0) {
      yPosition += 5;
      addSectionHeader("TECHNICAL SKILLS");

      // Create three columns for skills
      const skillGroups = [];
      const skillsPerColumn = Math.ceil(validSkills.length / 3);

      for (let i = 0; i < validSkills.length; i += skillsPerColumn) {
        skillGroups.push(validSkills.slice(i, i + skillsPerColumn));
      }

      doc.setFont("Poppins_reg");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const columnWidth = contentWidth / 3;
      skillGroups.forEach((group, index) => {
        const xPos = leftMargin + index * columnWidth;
        let localY = yPosition;

        group.forEach((skill) => {
          doc.text(skill.skillName, xPos, localY);
          localY += 6;
        });
      });

      yPosition += Math.max(...skillGroups.map((g) => g.length)) * 6 + 5;
    }

    // Professional Experience Section - Only display if valid experience exists
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      yPosition += 5;
      addSectionHeader("PROFESSIONAL EXPERIENCE");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          if (hasContent(exp.role)) {
            doc.text(exp.role, leftMargin, yPosition);
          }
          if (hasContent(exp.year)) {
            doc.text(exp.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

          if (hasContent(exp.companyName)) {
            yPosition += 6;
            doc.setFont("Poppins_reg");
            doc.text(exp.companyName, leftMargin, yPosition);
          }

          if (hasContent(exp.description)) {
            yPosition += 6;
            const bullets = exp.description.split("•").filter(hasContent);
            bullets.forEach((bullet) => {
              const bulletText = `• ${bullet.trim()}`;
              const wrappedBullet = doc.splitTextToSize(
                bulletText,
                contentWidth - 5
              );
              doc.text(wrappedBullet, leftMargin + 5, yPosition);
              yPosition += wrappedBullet.length * 5;
            });
          }
          yPosition += 5;
        }
      });
    }

    // Education Section - Only display if valid education exists
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      yPosition += 5;
      addSectionHeader("EDUCATION");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.course) || hasContent(edu.collegeName)) {
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          if (hasContent(edu.course)) {
            doc.text(edu.course, leftMargin, yPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

          if (hasContent(edu.collegeName)) {
            yPosition += 6;
            doc.setFont("Poppins_reg");
            doc.text(edu.collegeName, leftMargin, yPosition);
          }

          if (hasContent(edu.location)) {
            yPosition += 5;
            doc.setFontSize(10);
            doc.text(edu.location, leftMargin, yPosition);
          }

          yPosition += 8;
        }
      });
    }

    // Projects Section - Only display if valid projects exist
    if (hasValidData(formData.projectDetails, ["projectName"])) {
      yPosition += 5;
      addSectionHeader("PROJECTS");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName)) {
          doc.setFont("Poppins_bol");
          doc.setFontSize(11);
          doc.text(pro.projectName, leftMargin, yPosition);
          
          if (hasContent(pro.year)) {
            doc.text(pro.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }

          if (hasContent(pro.techStack)) {
            yPosition += 5;
            doc.setFont("Poppins_reg");
            doc.setFontSize(9);
            doc.text(pro.techStack, leftMargin, yPosition);
          }

          if (hasContent(pro.projectLink)) {
            yPosition += 6;
            doc.setFontSize(8);
            doc.setFont("Poppins_reg");
            doc.text(pro.projectLink, leftMargin, yPosition);
          }

          yPosition += 8;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const Template107 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // Add fonts
    doc.addFont(merium_reg, "merium_reg", "normal");
    doc.addFont(merium_bol, "merium_bol", "normal");
    doc.setFont("merium_reg");

    // Layout constants that define our two-column structure
    const leftColumnWidth = 70;
    const rightColumnStart = leftColumnWidth + 10;
    let leftYPosition = 20;
    let rightYPosition = 20;
    const pageWidth = doc.internal.pageSize.width;

    // Helper function to check if a string has meaningful content
    // This ensures we only display fields that have actual text
    const hasContent = (str) => str && str.trim().length > 0;

    // Helper function to check if a section has valid data
    // This prevents empty sections from being displayed
    const hasValidData = (section, requiredFields) => {
      if (!section) return false;
      if (Array.isArray(section)) {
        return (
          section.length > 0 &&
          section.some((item) =>
            requiredFields.some((field) => hasContent(item[field]))
          )
        );
      }
      return requiredFields.some((field) => hasContent(section[field]));
    };

    // Helper function to add right column section headers
    // Ensures consistent formatting for all right column sections
    const addRightSectionHeader = (title) => {
      rightYPosition += 6;
      doc.setFont("merium_bol");
      doc.setFontSize(14);
      doc.text(title, rightColumnStart, rightYPosition);
      rightYPosition += 10;
    };

    const details = formData.personalDetails?.[0] || {};

    // Left Column Background - This creates the distinctive dark blue sidebar
    doc.setFillColor(9, 18, 44);
    doc.rect(0, 0, leftColumnWidth, 297, "F");
    
    // Name Section - Only display if there's actual content
    if (hasContent(details.firstName) || hasContent(details.lastName)) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("merium_bol");
      doc.setFontSize(20);
      const fullName = [details.firstName, details.lastName]
        .filter(hasContent)
        .join(" ")
        .trim();
      doc.text(fullName, 10, leftYPosition);
      leftYPosition += 10;
    }

    // Contact Information - Only display non-empty contact details
    const contactInfo = [details.phoneNumber, details.email, details.linkedin]
      .filter(hasContent);
    
    if (contactInfo.length > 0) {
      doc.setFontSize(10);
      doc.setFont("merium_reg");
      contactInfo.forEach((info) => {
        doc.text(info, 10, leftYPosition);
        leftYPosition += 6;
      });
    }

    // Skills Section - Only display if valid skills exist
    const validSkills = (formData.skills || []).filter((skill) =>
      hasContent(skill.skillName)
    );

    if (validSkills.length > 0) {
      leftYPosition += 10;
      doc.setFont("merium_bol");
      doc.text("Skills", 10, leftYPosition);
      leftYPosition += 6;

      doc.setFont("merium_reg");
      validSkills.forEach((skill) => {
        doc.text(`• ${skill.skillName}`, 10, leftYPosition);
        leftYPosition += 5;
      });
    }

    // Right Column Content - Switch to dark blue text
    doc.setTextColor(9, 18, 44);

    // Experience Section - Only display if valid experience exists
    if (hasValidData(formData.experienceDetails, ["role", "companyName"])) {
      addRightSectionHeader("Experience");

      formData.experienceDetails.forEach((exp) => {
        if (hasContent(exp.role) || hasContent(exp.companyName)) {
          doc.setFont("merium_bol");
          doc.setFontSize(11);
          if (hasContent(exp.role)) {
            doc.text(exp.role, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          doc.setFont("merium_reg");
          doc.setFontSize(10);
          if (hasContent(exp.companyName)) {
            doc.text(exp.companyName, rightColumnStart, rightYPosition);
          }
          if (hasContent(exp.year)) {
            doc.text(exp.year, pageWidth - 15, rightYPosition, { align: "right" });
          }
          rightYPosition += 6;

          if (hasContent(exp.description)) {
            const desc = doc.splitTextToSize(
              exp.description,
              pageWidth - rightColumnStart - 15
            );
            doc.text(desc, rightColumnStart, rightYPosition);
            rightYPosition += desc.length * 5 + 5;
          }
        }
      });
    }

    // Education Section - Only display if valid education exists
    if (hasValidData(formData.educationDetails, ["course", "collegeName"])) {
      addRightSectionHeader("Education");

      formData.educationDetails.forEach((edu) => {
        if (hasContent(edu.course) || hasContent(edu.collegeName)) {
          doc.setFont("merium_bol");
          doc.setFontSize(12);
          if (hasContent(edu.course)) {
            doc.text(edu.course, rightColumnStart, rightYPosition);
          }
          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - 15, rightYPosition, { align: "right" });
          }
          rightYPosition += 6;

          doc.setFont("merium_reg");
          doc.setFontSize(10);
          const eduLocation = [edu.collegeName, edu.location]
            .filter(hasContent)
            .join(", ");
          if (eduLocation) {
            doc.text(eduLocation, rightColumnStart, rightYPosition);
          }
          rightYPosition += 8;
        }
      });
    }

    // Projects Section - Only display if valid projects exist
    if (hasValidData(formData.projectDetails, ["projectName"])) {
      addRightSectionHeader("Projects");

      formData.projectDetails.forEach((pro) => {
        if (hasContent(pro.projectName)) {
          doc.setFont("merium_bol");
          doc.setFontSize(12);
          doc.text(pro.projectName, rightColumnStart, rightYPosition);
          if (hasContent(pro.year)) {
            doc.text(pro.year, pageWidth - 15, rightYPosition, { align: "right" });
          }
          rightYPosition += 6;

          doc.setFont("merium_reg");
          doc.setFontSize(9);
          
          if (hasContent(pro.projectLink)) {
            doc.text(pro.projectLink, rightColumnStart, rightYPosition);
            rightYPosition += 6;
          }

          if (hasContent(pro.techStack)) {
            doc.setFontSize(10);
            doc.text(
              `Tech Used: ${pro.techStack}`,
              rightColumnStart,
              rightYPosition
            );
          }
          
          rightYPosition += 8;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const Template108 = ({ formData }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helper function to check if a string has meaningful content
  const hasContent = (str) => str && str.trim().length > 0;

  // Helper function for section headers
  const addSectionHeader = (title) => {
    doc.setFont("Arvo_bol");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
  };

  try {
    // Add fonts
    doc.addFont(Arvo_reg, "Arvo_reg", "normal");
    doc.addFont(Arvo_bol, "Arvo_bol", "normal");
    doc.setFont("Arvo_reg");

    const leftMargin = 20;
    let yPosition = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * leftMargin;

    const details = formData.personalDetails?.[0] || {};

    // Header Section - Name (only if name exists)
    const firstName = details.firstName || "";
    const lastName = details.lastName || "";
    if (hasContent(firstName) || hasContent(lastName)) {
      doc.setFont("Arvo_bol");
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      const fullName = `${firstName} ${lastName}`.trim().toUpperCase();
      doc.text(fullName, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 8;
    }

    // Contact Information (only if any contact details exist)
    const contactDetails = [
      details.phoneNumber,
      details.email,
      details.linkedin,
      details.address,
    ].filter(hasContent);

    if (contactDetails.length > 0) {
      doc.setFontSize(10);
      doc.setFont("Arvo_reg");
      const contactInfo = contactDetails.join(" · ");
      doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;
    }

    // Professional Summary (only if about exists)
    if (hasContent(details.about)) {
      addSectionHeader("PROFILE SUMMARY");
      
      doc.setFont("Arvo_reg");
      doc.setFontSize(10);
      const summary = doc.splitTextToSize(details.about, contentWidth);
      doc.text(summary, leftMargin, yPosition);
      yPosition += summary.length * 3 + 9;
    }

    // Skills Section (only if skills exist and have content)
    const validSkills = formData.skills?.filter(skill => 
      hasContent(skill.skillName)
    );

    if (validSkills?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("STRENGTHS AND EXPERTISE");

      const skillGroups = [];
      const skillsPerRow = 3;
      const columnWidth = contentWidth / 3;

      for (let i = 0; i < validSkills.length; i += skillsPerRow) {
        skillGroups.push(validSkills.slice(i, i + skillsPerRow));
      }

      doc.setFont("Arvo_reg");
      doc.setFontSize(10);

      skillGroups.forEach((row) => {
        row.forEach((skill, colIndex) => {
          const xPos = leftMargin + colIndex * columnWidth;
          doc.text(skill.skillName, xPos, yPosition);
        });
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Experience Section (only if valid experiences exist)
    const validExperiences = formData.experienceDetails?.filter(exp => 
      hasContent(exp.companyName) || hasContent(exp.role) || hasContent(exp.description)
    );

    if (validExperiences?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("PROFESSIONAL EXPERIENCE");

      validExperiences.forEach((exp) => {
        if (hasContent(exp.companyName)) {
          doc.setFont("Arvo_bol");
          doc.setFontSize(11);
          doc.text(exp.companyName, leftMargin, yPosition);
          
          if (hasContent(exp.year)) {
            doc.setFont("Arvo_reg");
            doc.text(exp.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
          yPosition += 6;
        }

        if (hasContent(exp.role)) {
          doc.setFont("Arvo_reg");
          doc.text(exp.role, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(exp.description)) {
          const bullets = exp.description.split("•").filter(hasContent);
          bullets.forEach((bullet) => {
            const bulletText = `• ${bullet.trim()}`;
            const wrappedBullet = doc.splitTextToSize(
              bulletText,
              contentWidth - 5
            );
            doc.text(wrappedBullet, leftMargin + 5, yPosition);
            yPosition += wrappedBullet.length * 5;
          });
        }
        yPosition += 2;
      });
    }

    // Education Section (only if valid education entries exist)
    const validEducation = formData.educationDetails?.filter(edu =>
      hasContent(edu.collegeName) || hasContent(edu.course)
    );

    if (validEducation?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("EDUCATION");

      validEducation.forEach((edu) => {
        if (hasContent(edu.collegeName)) {
          doc.setFontSize(11);
          doc.setFont("Arvo_bol");
          doc.text(edu.collegeName, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(edu.course)) {
          doc.setFont("Arvo_reg");
          doc.text(edu.course, leftMargin, yPosition);

          if (hasContent(edu.year)) {
            doc.text(edu.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
          yPosition += 8;
        }
      });
    }

    // Projects Section (only if valid projects exist)
    const validProjects = formData.projectDetails?.filter(proj =>
      hasContent(proj.projectName) || hasContent(proj.techStack) || hasContent(proj.projectLink)
    );

    if (validProjects?.length > 0) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
      yPosition += 8;

      addSectionHeader("PROJECTS");

      validProjects.forEach((proj) => {
        if (hasContent(proj.projectName)) {
          doc.setFont("Arvo_bol");
          doc.text(proj.projectName, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(proj.techStack)) {
          doc.setFont("Arvo_reg");
          doc.text(proj.techStack, leftMargin, yPosition);
          yPosition += 6;
        }

        if (hasContent(proj.projectLink)) {
          doc.setFontSize(10);
          doc.text(proj.projectLink, leftMargin, yPosition);

          if (hasContent(proj.year)) {
            doc.text(proj.year, pageWidth - leftMargin, yPosition, {
              align: "right",
            });
          }
          yPosition += 8;
        }
      });
    }

    return doc;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};




const TEMPLATE_REGISTRY = {
  101: Template101,
  102: Template102,
  103: Template103,
  104: Template104,
  105: Template105,
  106: Template106,
  107: Template107,
  108: Template108,
};

// generates template on selected templates

export const generatePDF = ({ formData }) => {
  const selected_template = formData.selected_template || 101;

  const templateGenerator = TEMPLATE_REGISTRY[selected_template];

  if (!templateGenerator) {
    console.error(`Template ${selected_template} not found`);
    throw new Error(`Template ${selected_template} is not implemented`);
  }

  return templateGenerator({ formData });
};
