import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDown } from "lucide-react";
function Faq() {
  const questions = [
    {
      id: 1,
      question: "Is ResuMate free to use?",
      answer:
        "Yes! ResuMate is completely free to use. You can build and download your resume without paying anything.",
    },
    {
      id: 2,
      question: "Will my resume be ATS-friendly?",
      answer:
        "Yes. All our templates are designed to be clean and compliant with Applicant Tracking Systems (ATS), ensuring your resume gets through the filters.",
    },
    {
      id: 3,
      question: "Can I create multiple resumes?",
      answer:
        "Yes, you can create and download two resumes for different job applications.",
    },
    {
      id: 4,
      question: "I found a bug or have a suggestion. How can I contact you?",
      answer: `We’d love to hear from you! Reach out to us by using the contact form on the site.`,
    },
  ];

  return (
    <>
      <div >
        {questions.map((ques) => (
          <Accordion key={ques.id}>
            <AccordionSummary
              expandIcon={<ArrowDown />}

            >
              <h1 className="text-lg">{ques.question}</h1>
            </AccordionSummary>

            <AccordionDetails>
              <h3>{ques.answer}</h3>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
}

export default Faq;
