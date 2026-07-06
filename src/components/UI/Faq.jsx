import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDown } from "lucide-react";
function Faq() {
  const questions = [
    {
      id: 1,
      question: <>Is <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>x</span><span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>LPA</span> free to use?</>,
      answer:
        <>Yes! <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>x</span><span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>LPA</span> is completely free to use. You can build and download your resume without paying anything.</>,
    },
    {
      id: 2,
      question: "Are the templates professionally formatted?",
      answer:
        "Yes. All our templates are designed to be clean, modern, and compliant with standard recruitment formats, ensuring your resume is easily readable by recruiters and hiring managers.",
    },
    {
      id: 3,
      question: "Can I create multiple resumes?",
      answer:
        "Yes! You can create up to 4 resumes for different job applications and download them an unlimited number of times.",
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
