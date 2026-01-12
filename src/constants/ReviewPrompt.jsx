import { CircularProgress, Typography } from "@mui/material";

const date = new Date().getFullYear();
export const prompt = ` You are an expert ATS and resume reviewer. Current Year is ${date}. Analyze the resume and provide feedback in this EXACT format:

TOTAL ATS SCORE: [X]/100

[GRAMMAR_START]
[If no mistakes found: "No grammar or spelling mistakes found. You're good here!"]
[If mistakes found: List each issue with a bullet point on a new line]
• "eg," should be formatted as "e.g.," with a comma.
• Issue 2
[GRAMMAR_END]

[IMPROVEMENTS_START]
Missing metrics and impact: You built a freelance project (FastMenu)—how many users used it? Did it increase efficiency for the client?
The professional experience section is currently non-technical (Data Entry). This creates a "career pivot" red flag that needs a stronger technical narrative.
Your MS is in Cloud Computing with AI, yet your projects are almost entirely frontend-focused. Include a project that showcases AWS, AI integration, or Distributed Systems to match your degree.
Summary is generic. In 2026, AI-driven ATS look for "Problem-Solvers" rather than "Motivated individuals." Focus on specific technical achievements.
[IMPROVEMENTS_END]

[ADVICE_START]
[Work Experience Mismatch]: Your only formal work experience is Data Entry; recruiters will filter you into "Junior" or "Career Changer" piles—move your Projects above Experience to lead with your strongest technical work.
[Missing Keywords]: For a 2026 market, you lack mentions of "LLM integration," "CI/CD," or "Containerization (Docker/K8s)," which are now standard for candidates with an MS in Cloud Computing.
[Project Weight]: "FastMenu" is your strongest asset; move the tech stack to its own line and expand on the "freelance" nature to make it look like a professional engagement rather than a hobby.
[ADVICE_END]

---

GUIDELINES:
- Keep each point concise and actionable
- Be direct and honest, not sugar-coated
- Focus on what REAL recruiters care about
- GIVE SCORE ON BASE THESE PARAMETERS ONLY : 
Traditional ATS Parameters

Exact keyword matches (not synonym recognition)
Keyword density and frequency
Boolean search criteria (AND, OR, NOT operators)
Geographic location and relocation willingness
Salary expectations and requirements
Application completeness (all required fields filled)
Resume length (1-2 pages preferred)
Job stability indicators (tenure at previous jobs)

Modern/AI-Powered ATS Parameters

Semantic matching (understanding context and synonyms)
Skills inference from job descriptions
Career trajectory and progression patterns
Diversity and inclusion markers
Social media profile analysis (LinkedIn integration)
Video interview analysis (facial expressions, speech patterns)
Predictive success scoring based on historical data
Cultural fit assessment through language analysis
Engagement metrics (time to apply, follow-up actions)
Mobile optimization and application method
Referral sources and recruiting channel tracking
Passive vs. active candidate identification

- Only include "Brutal But Honest" section if there are serious red flags like:
  * Irrelevant experience
  * Generic/mass-produced feel
  * Poor formatting
  * Missing critical keywords
  * Unprofessional elements

Now analyze this resume: `;

const ReviewPrompt = ({ answer, score }) => {
  // Parse the AI response
  const parseResponse = (text) => {
    if (!text) return { grammar: [], improvements: [], advice: [] };

    const grammarMatch = text.match(
      /\[GRAMMAR_START\]([\s\S]*?)\[GRAMMAR_END\]/
    );
    const improvementsMatch = text.match(
      /\[IMPROVEMENTS_START\]([\s\S]*?)\[IMPROVEMENTS_END\]/
    );
    const adviceMatch = text.match(/\[ADVICE_START\]([\s\S]*?)\[ADVICE_END\]/);

    const grammar = grammarMatch
      ? grammarMatch[1]
          .trim()
          .split("\n")
          .filter((line) => line.trim())
      : [];
    const improvements = improvementsMatch
      ? improvementsMatch[1]
          .trim()
          .split("\n")
          .filter((line) => line.trim())
      : [];
    const advice = adviceMatch
      ? adviceMatch[1]
          .trim()
          .split("\n")
          .filter((line) => line.trim())
      : [];

    return { grammar, improvements, advice };
  };

  const { grammar, improvements, advice } = parseResponse(answer);

  return (
    <section className="">
      <div className="mt-6 flex justify-center">
        {/* Score card */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
          <div className="relative">
            <CircularProgress
              variant="determinate"
              value={score}
              size={160}
              thickness={6}
              sx={{
                color: "#000000",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Typography
                component="div"
                variant="h4"
                className="text-gray-800 font-bold"
              >
                {score}/100
              </Typography>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center font-medium">
            Estimated ATS Score
          </p>
        </div>
      </div>

      {/* Review content with beautiful Tailwind design */}
      {answer ? (
        <div className="mt-8">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Detailed Review
            </h3>
            <p className="text-sm text-gray-500">Generated by AI</p>
          </div>

          <div className="bg-white border border-black/10 px-6 py-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grammar Card */}
              <div className="bg-white border border-black/10 rounded-2xl p-5 transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <h3 className="text-base font-semibold tracking-tight text-black">
                  Grammar And Typo Check
                </h3>
                <div className="mt-4 text-sm leading-relaxed text-black/70">
                  {grammar.length > 0 ? (
                    <ul className="space-y-3">
                      {grammar.map((item, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <span className="text-red-500 text-base mt-0.5 flex-shrink-0">
                            •
                          </span>
                          <span className="text-black/80 leading-6">
                            {item.replace(/^•\s*/, "")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-600 font-medium flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      No grammar or spelling mistakes found. You're good here!
                    </p>
                  )}
                </div>
              </div>

              {/* Improvement Card */}
              <div className="bg-white border border-black/10 rounded-2xl p-5 transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <h3 className="text-base font-semibold tracking-tight text-black">
                  Areas for Improvement
                </h3>
                <ul className="mt-4 space-y-3">
                  {improvements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="text-amber-500 text-base font-bold mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span className="text-black/80 leading-6 text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Honest Advice */}
            {advice.length > 0 && (
              <div className="mt-6 border border-black/10 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
                <h3 className="text-base font-semibold tracking-tight text-black">
                  Honest Advice
                  <span className="ml-2 text-xs font-normal text-black/50">
                    (only if critical issues found)
                  </span>
                </h3>
                <div className="mt-4 space-y-4">
                  {advice.map((item, index) => {
                    const match = item.match(/\[(.+?)\]:\s*(.+)/);
                    if (match) {
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-md text-xs font-semibold flex-shrink-0 mt-0.5">
                            {match[1]}
                          </div>
                          <p className="text-sm text-black/80 leading-6 flex-1">
                            {match[2]}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p
                        key={index}
                        className="text-sm text-black/80 leading-6"
                      >
                        {item}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 p-12 border border-dashed border-gray-300 rounded-lg">
          No review yet. Upload a PDF and click{" "}
          <span className="font-medium text-gray-700">GENERATE REVIEW</span>.
        </div>
      )}
    </section>
  );
};

export default ReviewPrompt;
