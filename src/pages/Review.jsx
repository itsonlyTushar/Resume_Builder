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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
      alert("Please select a valid PDF file.");
    }
  };



  return (
    <>
      <Navbar />
      <Toaster />
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-center text-5xl font-bold text-gray-900 mb-3">
          AI Resume Review
        </h1>
        <p className="text-center text-gray-500 text-lg mb-8">
          Get instant feedback on your resume with AI-powered analysis
        </p>

        {/* Upload Form */}
        <form onSubmit={sendResumeToReview} className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <label className="block">
                <div
                  className="h-36 w-full border-2 border-gray-300 hover:border-black border-dashed rounded-xl cursor-pointer text-center
                  flex flex-col items-center justify-center gap-2 px-5 py-8
                  text-gray-400 hover:text-gray-500 hover:bg-indigo-50/30 transition-all duration-200"
                >
                  <i className="ri-file-upload-line text-5xl"></i>
                  <span className="text-xl font-semibold">Upload PDF</span>
                  <span className="text-sm text-gray-400">
                    {pdfFile ? pdfFile.name : "PDF Resume Only"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>

              <button
                className="mt-6 w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg text-lg font-semibold 
                transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
                type="submit"
                disabled={!pdfFile}
              >
                <i className="ri-ai-generate"></i> Generate Review
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Report Section */}
      {loading ? (
        <>
          <div className="flex justify-center items-center min-h-[400px] py-20">
            <AiLoader />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Report</h1>
          <p className="text-gray-500 mb-6">
            Detailed analysis from the AI Reviewer
          </p>
          <ReviewPrompt answer={answer} score={findScore} pdf={pdfFile} />
        </div>
      )}
    </>
  );
};

export default Review;
