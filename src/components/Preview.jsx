import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generatePDF } from "../state_templates/pdfTemplates";
import Footer from "../pages/Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../auth/firebase";
import { uploadResume, downloadResume } from "../state_templates/resumeOperations";
import Loader from "../pages/Loader";

function Preview() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const formData = useSelector((state) => state.resumeBuilder.form_data);

  useEffect(() => {

    const generatePreview = async () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      try {
        const doc = generatePDF({ formData });
        setPdfDoc(doc);
        const pdfBlob = doc.output("blob");
        const newPdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(newPdfUrl);
      } catch (err) {
        console.error("Error generating PDF:", err);
        new Promise(resolve => setTimeout(resolve, 2000));
          toast.error('Please select the template first to see preview');
        new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/select_template');
      }
    };

    generatePreview();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [formData]);

  const handleBack = () => {
    navigate('/builder');
  };

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please login to download and save your resume');
      return;
    }

    if (!pdfDoc) {
      toast.error('PDF not generated yet. Please try again');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Processing...');

    try {
    
      const uploadResult = await uploadResume(pdfDoc, user.uid);
      
      if (!uploadResult) {
        toast.error('Failed to save resume', { id: loadingToast });
        return;
      }

  
      const downloadUrl = await downloadResume(uploadResult.documentId, uploadResult.fileId);
      if (!downloadUrl) {
        toast.error('Failed to download resume', { id: loadingToast });
        return;
      }

  
      window.open(downloadUrl, '_blank');
      
      toast.success('Resume saved and downloaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to save resume. Please try again', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  if(!formData?.selected_template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking template....</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <h2 className="mt-5 text-5xl font-bold mb-5 text-center">
        Resume Preview
      </h2>
    
      <div className="container mx-auto px-4 mb-10">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="w-full lg:w-2/3">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&view=FitH`}
                className="w-full h-[37rem] border-4 border-solid border-[#000000] rounded-2xl shadow-xl"
                title="Resume Preview"
              />
            ) : (
              <div className="w-full h-[37rem] flex items-center justify-center">
                <p>Loading preview....</p>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <button
              onClick={handleDownload}
              disabled={isLoading || !pdfDoc}
              className={`w-full max-w-xs mx-auto transition-all hover:shadow-lg shadow-xl ease-in-out delay-100 hover:-translate-y-0 hover:scale-105 border px-4 bg-black py-2 text-white text-lg rounded-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
              <i className="ri-download-2-fill mr-1"></i>
              {isLoading ? 'Saving...' : 'Save & Download'}
            </button>
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="w-full max-w-xs mx-auto shadow-lg px-10 py-2 text-black text-lg rounded-full bg-[#EEEFEF]"
            >
              <i className="ri-arrow-left-circle-line"></i> Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Preview;