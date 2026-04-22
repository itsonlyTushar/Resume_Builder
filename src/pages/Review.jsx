import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import Navbar from "../components/Navbar/Navbar";
import ReviewPrompt from "../constants/ReviewPrompt";
import toast, { Toaster } from "react-hot-toast";
import AiLoader from "../components/UI/AiLoader";
import { auth } from "../auth/firebase";
import { fallBackModel } from "../constants/fallbackModel";
import { fetchUserResumes } from "../backend/resumeOperations";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

// Set up PDF.js worker for Vite - using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Review = () => {
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [findScore, setFindScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      const user = auth.currentUser;
      if (user) {
        setIsLoadingResumes(true);
        try {
          const userResumes = await fetchUserResumes(user.uid);
          setResumes(userResumes);
        } catch (error) {
          console.error("Error loading resumes:", error);
        } finally {
          setIsLoadingResumes(false);
        }
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadResumes();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectSavedResume = async (resume) => {
    const loadingToast = toast.loading("Loading resume...");
    try {
      const response = await fetch(resume.downloadUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const date = new Date(resume.$createdAt);
      const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, '-');
      const file = new File([blob], `Saved_Resume_${formattedDate}.pdf`, { type: "application/pdf" });
      
      setPdfFile(file);
      setExtractedText("");
      setIsResumeModalOpen(false);
      toast.success("Resume selected successfully", { id: loadingToast });
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error("Failed to load resume. Please try again.", { id: loadingToast });
    }
  };


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

              {/* Select Saved Resume Option */}
              {!pdfFile && (
                <div className="mt-6 flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center w-full max-w-xs">
                    <div className="flex-1 border-t border-black/10"></div>
                    <span className="px-4 text-xs font-bold text-black/40 uppercase tracking-widest">
                      Or
                    </span>
                    <div className="flex-1 border-t border-black/10"></div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="px-6 py-3 rounded-xl border-2 border-black/10 hover:border-black/30 hover:bg-black/5 text-[#1D1F24] font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <i className="ri-folder-user-line text-lg"></i>
                    Select from Saved Resumes
                  </button>
                </div>
              )}

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

      {/* Saved Resumes Modal */}
      <Dialog
        open={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "1.5rem",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle className="text-center pb-2">
          <span className="text-2xl font-bold text-[#1D1F24]">Your Saved Resumes</span>
        </DialogTitle>
        <DialogContent className="pt-4">
          {isLoadingResumes ? (
            <div className="flex justify-center items-center py-8">
              <i className="ri-loader-4-line text-3xl animate-spin text-black/50"></i>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-file-list-3-line text-5xl text-gray-300 mb-4 block"></i>
              <p>No saved resumes found.</p>
              <p className="text-sm mt-2">Build a resume first to use this feature.</p>
            </div>
          ) : (
            <div className="grid gap-4 mt-2">
              {resumes.map((resume) => {
                const date = new Date(resume.$createdAt);
                const formattedDate = date.toLocaleDateString("en-GB");
                const isExpired = resume.downloadsLeft <= 0;

                return (
                  <div
                    key={resume.$id}
                    className="flex items-center justify-between p-4 border border-black/10 rounded-2xl hover:border-black/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center text-black/50 group-hover:text-black transition-colors">
                        <i className="ri-file-text-line text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1D1F24]">Saved Resume</h4>
                        <p className="text-sm text-gray-500">Created: {formattedDate}</p>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      disabled={isExpired}
                      onClick={() => handleSelectSavedResume(resume)}
                      sx={{
                        backgroundColor: '#1D1F24',
                        borderRadius: '0.75rem',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'black'
                        }
                      }}
                    >
                      {isExpired ? 'Expired' : 'Select'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
