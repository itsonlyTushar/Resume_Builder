import jsPDF from "jspdf";
import toast from "react-hot-toast";
import roboto_reg from "../../assets/fonts/roboto/Roboto_Regular.ttf";
import roboto_bol from "../../assets/fonts/roboto/Roboto_Medium.ttf";
import { checkEach, checkStr } from "../../utils/helpers";

export const Template02 = ({ formData }) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    let leftMargin = 35;
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.width;

    // gathring the data to make pdf
    const personalDetails = formData.personalDetails[0];
    const educationDetails = formData.educationDetails;
    const experienceDetails = formData.experienceDetails;
    const projectDetails = formData.projectDetails;
    const skills = formData.skills;
    const certification = formData.certification;
    const linkIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAACLlJREFUeF7tnXWofUUQxz8/O7ELA0EMsAs7sBFFRSzEBsXARgWxRcHCwEKwsRHjH8Huwg4sEAOxRbGx7vf3zoXn++k7s+eceffu3Zk/35udMzvzPXN2Z2fnTiOoaAtMK3r2MXkCAIWDIAAQACjcAoVPPyJAAKBwCxQ+/YgAAYDCLVD49CMCBAAKt0Dh048IEAAo3AKFTz8iQACgcAsUPv2IAAGAwi1Q+PQjAgQACrdA4dOPCBAAKNwChU8/IkAAoHALFD79iAABgMItUPj0IwIEAAq3QOHTjwgQACjcAoVPPyJAAKBwCxQ+/YgAAYDCLVD49CMCBAAKt0Dh048IEAAo3AKFT3/QEWAuYBVgRWB5YCFAf5vbwS/PARcZ5R4LrG/kTWH7CfgZ+Br4AHgHeBP4JUVIl7yDAIAcvSewNbAeMFuXE5pE1p3A7sZn3QHsZuRty/Yb8DzwIHBbBYy2Ms3jpwoAswB7AIcDG5i165ZxWAEwcZbPAJcDtwN/dmuCGaV5A0Dy9+1N5BRgOe/J1MjPBQD9aegTcSZwM/C3l+08AbAacEUvtG3kpXyi3NwA0J/ek8Bh1Vohccr17F4AOBi4FJi9XoUp48gVADKQ1gknApd0ba2uATAHcOMULqBS7JEzAPrz1Lpgf+DXlIlPxtslAOYH7gU27Uq5juWMAgBkkseBnYDvu7BPVwCYt+f4R4B1ulDKScaoAEDmeQHYEvixra26AID28fcB27ZVxnn8KAFAptILt321Pmhsui4AcBVwSGMNxgZ+BbwMvAd8V2XLWoqcYbiybvpEWUghdiULYyKPspwLACsAawMLJ46fyK58wRFtZLQFgDJ6tzZU4Evghmr8q5573Yb6eQ+bCVgD2AvYr5f8WaThA5WxvKvh2Fbt4hevctnzJT5ci5czgKud3vREdYaCXZHh0CphlmpPRUxFK71QydQmAihDtXfiEx8ADgA+TxxXCvsSwPXANokTViTV9jCZmgJAJ2XKWaeMPxc4ucBQn+oUfRpkqxMSBipVrIO1FxPGTGdNceB42fcDOyQ8TI4/J4E/WMdelrMTDKEF7s4J/I0BsCrwWgJ4LgOOTFUs+KdbQGcpWhtYSFFAvnnLwtznaRIBLu5t1Y4yPkQhaWPgdyN/sP3bAjpLebraMlpso4KX4yyMTQGgc/1PgcUMD/kDWLcXlrTFC2puAb3VypHI9nX0BbAUINubKDUCbA48apIM1wA6FQxqb4Frq92TRdImwFMWRvGkAkD791MNwvU9Up3f+wbeYKm3gDKHymRa/HVaVUhSL9UocLygx3oRYDODZJ1YKVp0SQptgyonS53Hs9WnMnXcZPwqDNF6qo4UobeoY+r/34Ko8bK+6RV6LGgQrkWiCkK6JKU8VayZA6n4VIdPXdIxxqpmVRyb08opAJBQa7pxdeD1LmdfFZmUDACdG7xitKkOmfSy1lIKALSi1zl0HWkFqrr+rrd+pUcAbQl1r2DmOgdUdRkvGfhMi4q+HH1XHjYI/aiXz17WwJfKUjoAZK+PgaUNhpOvTLu1lAigM/J7DA9/A1BFcNcUAADZVjep6ki+UpFOLQUAak3UiMFjEShFBgqA+ATYseAFgIF+AmIROFgADHwRqK2FavcspC2LTgy7pNLXAGtWZwIWm+qW9bcWxpQ1gOQpySDhdXS0wy2W0gGgU74L6gxfvaSLGvims6QCwJoKfsKYMrbqKb7SU8E64LHcs3RNBZ/eK+nSYUMd6TBIhYoq8w5qbwHZ8m3jC6vDurOsj0yNADoIUhSwkI4wD7IwBk+tBVQoqtJxC+nASEUkJkoFgIoSPgFUEl5Ham6gnYM1f10nr9T/r1Wl4C0p4M+AZVIaS6QCQE5Q2ZFOpiykfPSGDucClmePAo+2fjpa1g7AQhf27gseb2Hs8zQBgFKROumzjr2yanCQolfwjllAl2esVVVad8k3WiuYyerEiQKVZ97R/JSxFjEpJc4JokeWVYs5VWBZSec0u1iZ20QAjdUlBIWmFACd32tscFKvpOyvVCUL49e3/jxAreqspLdf6y3TEfB4oSkOnKiMOoHsY9Ww4nuoWs1qsRI0owWWrDqsmEu6KhHX9Y6KD2xi0DYAUGm4ChXVGSSFfqg+B7r0oAKHIJinaqGn20BqtpFCSvkqT2BN0/9LdhsASJBOvdS3pglJ4Zuq6+Gqey/t06A7gOoRoOvhiqRNewXs2qu/uLuJAzSmLQAkI+X60v/pqfq1foMIIdojMgxDgwiVyqmott8gwlJgO5lvW1+76wIAs1bVJ9s1ReEUjRu1FjEqz1OLmFa1l10AQP7TN0w9a7QSHVYaJQCot/BWw9Ikqu9wgUDfIjWBHkYaFQDoLEbXwIeqTVzf4WoUqYMLNYYeNhoFANxSbffUObQT6uoTMFEZNYhW97A5O9GyGyE5AyCbVrHjXbVytUMYls6huQJAIV9t9pNy/NZ3xisC9J8v+Wokpby2fihikJQbAFRMo7MAteHLsl38eGcrv62kkZCs42Fv4P0X0HIAgBytYg41gNQ9SPfk2CAcoR+O0CJR2xhd99bCcSpoWAGgzt/quKZzEv1kzIdTYYzxIXoqnzfxWVokaq2gZhLKjikzpu3kKP9olBo8K9v5blUzqR+N6qz9e6ozBxEBUnUMfkcLBAAcjZuD6ABADl5y1DEA4GjcHEQHAHLwkqOOAQBH4+YgOgCQg5ccdQwAOBo3B9EBgBy85KhjAMDRuDmIDgDk4CVHHQMAjsbNQXQAIAcvOeoYAHA0bg6iAwA5eMlRxwCAo3FzEB0AyMFLjjoGAByNm4PoAEAOXnLUMQDgaNwcRAcAcvCSo44BAEfj5iA6AJCDlxx1DAA4GjcH0QGAHLzkqGMAwNG4OYgOAOTgJUcdAwCOxs1BdAAgBy856hgAcDRuDqIDADl4yVHHAICjcXMQHQDIwUuOOgYAHI2bg+gAQA5ectQxAOBo3BxEBwBy8JKjjv8At7k9kMKsbgMAAAAASUVORK5CYII=`;
    pdf.addFont(roboto_reg, "roboto_reg", "normal");
    pdf.addFont(roboto_bol, "roboto_bol", "normal");

    // full name with background
    pdf.setFont("roboto_reg");
    pdf.setFillColor(175, 160, 255);
    pdf.rect(leftMargin - 35, yPosition - 20, pageWidth, 35, "F");
    pdf.setFontSize(35);
    pdf.setTextColor(255, 255, 255);
    pdf.text(
      `${personalDetails.firstName} ${personalDetails.lastName}`,
      leftMargin - 25,
      yPosition + 10
    );

    // personal information section
    yPosition += 25;
    pdf.setFont("roboto_bol");
    pdf.setFontSize(12);
    pdf.setTextColor(170, 90, 255);
    if (
      checkStr(personalDetails.linkedin) ||
      checkStr(personalDetails.email) ||
      checkStr(personalDetails.phoneNumber)
    ) {
      pdf.text("Personal Information", leftMargin - 24, yPosition + 2);

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("roboto_reg");
      if (checkStr(personalDetails.linkedin)) {
        yPosition += 4;
        pdf.addImage(linkIcon, leftMargin - 11, yPosition + 1, 4, 4);
        pdf.textWithLink("Linkedin", leftMargin - 24, yPosition + 4, {
          url: `${personalDetails.linkedin}`,
        });
      }
      pdf.text(personalDetails.email, leftMargin - 24, yPosition + 9, {
        align: "left",
      });
      pdf.text(
        `Tel : ${personalDetails.phoneNumber}`,
        leftMargin - 24,
        yPosition + 14,
        { align: "left" }
      );
    }

    if(checkStr(personalDetails.about)) {
    // about me section
    pdf.setFont("roboto_bol");
    pdf.setFontSize(12);
    pdf.setTextColor(170, 90, 255);
    pdf.text("My Profile", leftMargin + 34, yPosition - 2);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("roboto_reg");
    const description = pdf.splitTextToSize(personalDetails.about, 180);
    pdf.setFontSize(9);
    pdf.text(description, leftMargin + 34, yPosition + 3);
    }

    if (checkEach(skills, "skillName")) {
      // skills section
      yPosition += 25;
      pdf.setFont("roboto_bol");
      pdf.setFontSize(12);
      pdf.setTextColor(170, 90, 255);
      pdf.text("Technical Skills", leftMargin - 24, yPosition + 2);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("roboto_bol");

      skills.forEach((skill) => {
        yPosition += 5;
        pdf.text(`• ${skill.skillName}`, leftMargin - 24, yPosition + 4);
      });
    }

    // Certification section

    if (
      checkEach(certification, "certiName") ||
      checkEach(certification, "year")
    ) {
      pdf.setFont("roboto_bol");
      pdf.setFontSize(12);
      pdf.setTextColor(170, 90, 255);
      pdf.text("Certication / Courses", leftMargin - 24, yPosition + 20);

      certification.forEach((certi) => {
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        yPosition += 7;
        pdf.text(`• ${certi.certiName}`, leftMargin - 26, yPosition + 25);
        yPosition += 3;
        pdf.setFontSize(7);
        pdf.setTextColor(202, 202, 213);
        pdf.text(`${certi.year}`, leftMargin - 24, yPosition + 26);
      });
    }

    // education section

    if(checkEach(educationDetails, "collegeName") || checkEach(educationDetails, "location") || checkEach(educationDetails, "year") || checkEach(educationDetails, "course") ){
    pdf.setFont("roboto_bol");
    pdf.setFontSize(12);
    pdf.setTextColor(170, 90, 255);
    pdf.text("Education", leftMargin + 34, yPosition - 8);

    educationDetails.forEach((edu) => {
      yPosition += 4;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const collegeHeading = pdf.splitTextToSize(edu.collegeName, 200);
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        `${edu.course} - ${collegeHeading}, ${edu.location}`,
        leftMargin + 34,
        yPosition - 5
      );
      yPosition += 3;
      pdf.setFontSize(7);
      pdf.setTextColor(202, 202, 213);
      pdf.text(edu.year, leftMargin + 34, yPosition - 4);
      yPosition += 4;
    });
    }

    // Experince section

    if (
      checkEach(experienceDetails, "companyName") ||
      checkEach(experienceDetails, "role") ||
      checkEach(experienceDetails, "location") ||
      checkEach(experienceDetails, "year") ||
      checkEach(experienceDetails, "description")
    ) {
      yPosition += 20;
      pdf.setFont("roboto_bol");
      pdf.setFontSize(12);
      pdf.setTextColor(170, 90, 255);
      pdf.text("Experience", leftMargin + 34, yPosition - 8);

      experienceDetails.forEach((exp, index) => {
        yPosition += 5;
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);

        const JD = pdf.splitTextToSize(exp.description, 140);
        pdf.setTextColor(0, 0, 0);
        if (index !== 0) {
          yPosition += 12;
        }
        pdf.setFont("roboto_bol");
        pdf.text(
          `${exp.role} -  ${exp.companyName}, ${exp.location}`,
          leftMargin + 34,
          yPosition - 5
        );
        yPosition += 10;

        pdf.setFont("roboto_reg");
        pdf.setFontSize(7);
        pdf.setTextColor(202, 202, 213);
        pdf.setFont("roboto_bol");
        pdf.text(exp.year, leftMargin + 34, yPosition - 12);
        pdf.setTextColor(0, 0, 0);

        yPosition += 2;
        pdf.setFontSize(9);
        pdf.setFont("roboto_reg");
        pdf.text(JD, leftMargin + 34, yPosition - 9);
        yPosition += 4;
      });
    }

    // Projects Section

    if (
      checkEach(projectDetails, "projectName") ||
      checkEach(projectDetails, "projectLink") ||
      checkEach(projectDetails, "techStack") ||
      checkEach(projectDetails, "year")
    ) {
      yPosition += 35;
      pdf.setFont("roboto_bol");
      pdf.setFontSize(12);
      pdf.setTextColor(170, 90, 255);
      pdf.text("Projects", leftMargin + 34, yPosition - 8);

      projectDetails.forEach((pro) => {
        yPosition += 4;
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("roboto_bol");
        pdf.text(
          `${pro.projectName} - ${pro.techStack}`,
          leftMargin + 34,
          yPosition - 5
        );
        yPosition += 11;

        pdf.setFont("roboto_reg");
        pdf.setFontSize(7);
        pdf.setTextColor(202, 202, 213);
        pdf.setFont("roboto_bol");
        pdf.text(pro.year, leftMargin + 34, yPosition - 12);
        pdf.setTextColor(0, 0, 0);
        yPosition += 2;
        pdf.setFontSize(9);
        pdf.setFont("roboto_reg");
        pdf.text(
          `Live Link ~ ${pro.projectLink}`,
          leftMargin + 34,
          yPosition - 9
        );
        yPosition += 4;
      });
    }

    return pdf;
  } catch (error) {
    toast.error("Error Generating the Resume try again...");
  }
};
