import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import Navbar from "../components/Navbar/Navbar";
import ReviewPrompt from "../constants/ReviewPrompt";
import toast, { Toaster } from "react-hot-toast";
import AiLoader from "../components/UI/AiLoader";
import { auth } from "../auth/firebase";
import { fallBackModel } from "../constants/fallbackModel";

// Set up PDF.js worker for Vite - using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Review = () => {
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [findScore, setFindScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendResumeToReview = async (e) => {
    // Text pdf Extraction
    e.preventDefault();
    setLoading(true);
    try {
      const pdf = await pdfjs.getDocument(URL.createObjectURL(pdfFile)).promise;
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      const rawText = textContent.items.map((item) => item.str).join(" ");
      setExtractedText(rawText);

      // Ai Generation Call
      const result = await fallBackModel(rawText);
      const response = await result.response;
      const text = response.text();
      // Extract Score
      const scoreMatch = text.match(/TOTAL ATS SCORE: (\d+)\/100/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      setFindScore(score);
      setAnswer(text);

      setPdfFile(null);
    } catch (error) {
      toast.error("Failed to process the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setExtractedText("");
    } else {
      toast.error("Please select a valid PDF file.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFD] selection:bg-[#1D1F24] selection:text-white font-sans text-black">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        {/* Header Section */}
        <div className="relative z-10 text-center mb-16 lg:mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-transparent border border-black/10 text-black text-[11px] font-bold mb-8 uppercase tracking-[0.2em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-50"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black"></span>
            </span>
            AI Analysis
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#1D1F24] mb-6 leading-tight">
            Elevate Your Resume.
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Strict, actionable feedback based on modern ATS standards. Upload
            your resume to uncover what recruiters actually see.
          </p>
        </div>

        {/* Upload Form */}
        <div
          className="relative z-10 w-full max-w-2xl mx-auto mb-20 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <form onSubmit={sendResumeToReview}>
            <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 p-8 md:p-12 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative group">
              <label className="block w-full cursor-pointer">
                <div
                  className={`w-full border-[1.5px] border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-6 px-6 py-16
                  ${
                    pdfFile
                      ? "border-black bg-black/5"
                      : "border-black/20 bg-gray-50/30 hover:bg-gray-50 hover:border-black/40"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out ${
                      pdfFile
                        ? "bg-black text-white scale-110 shadow-lg shadow-black/10"
                        : "bg-white text-black shadow-sm border border-black/10 group-hover:-translate-y-1 group-hover:shadow-md"
                    }`}
                  >
                    <i
                      className={`text-2xl ${
                        pdfFile ? "ri-file-pdf-2-fill" : "ri-upload-2-line"
                      }`}
                    ></i>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-[#1D1F24]">
                      {pdfFile ? "Ready" : "Upload Resume"}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium max-w-[250px] mx-auto">
                      {pdfFile
                        ? pdfFile.name
                        : "Drag & drop your PDF, or click to browse."}
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>

              <button
                className={`mt-10 w-full py-4 px-6 rounded-2xl text-lg font-bold text-white
                flex items-center justify-center gap-3 transition-all duration-500
                ${
                  !pdfFile
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#1D1F24] hover:bg-black shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:translate-y-0"
                }`}
                type="submit"
                disabled={!pdfFile || loading}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line text-xl animate-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    Generate Review
                    <i className="ri-arrow-right-line text-xl transition-transform group-hover:translate-x-1"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Report Section Wrapper */}
        <div className="relative z-10 w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] py-16 animate-fade-in-up">
              <div className="scale-125 mb-8">
                <AiLoader />
              </div>
              <p className="mt-8 text-black/40 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">
                Analyzing Structure & Content
              </p>
            </div>
          ) : (
            answer && (
              <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 p-8 md:p-12 mb-20 animate-fade-in-up delay-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8 pb-8 border-b border-black/5">
                  <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
                    <i className="ri-file-search-line text-3xl"></i>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1F24]">
                      Review Output
                    </h2>
                    <p className="text-gray-400 mt-2 font-medium">
                      Rigorous evaluation against industry standards.
                    </p>
                  </div>
                </div>

                <div className="grayscale">
                  <ReviewPrompt
                    answer={answer}
                    score={findScore}
                    pdf={pdfFile}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 text-center">
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-[0.15em]">
                    AI-generated reviews may vary with each generation.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `,
        }}
      />
    </div>
  );
};

export default Review;
