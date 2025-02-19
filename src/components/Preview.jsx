import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generatePDF } from "../state_templates/pdfTemplates";
import Footer from "../pages/Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../auth/firebase";
import { uploadResume, downloadResume } from "../state_templates/resumeOperations";
import * as pdfjsLib from 'pdfjs-dist';
import Loader from "../pages/Loader";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function Preview() {
  const [pdfImages, setPdfImages] = useState([]);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const formData = useSelector((state) => state.resumeBuilder.form_data);

  // Function to convert PDF to images
  const convertPdfToImages = async (pdfData) => {
    try {
      // Load the PDF data
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const images = [];

      // Convert each page to an image
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); 

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert canvas to image URL
        images.push(canvas.toDataURL('image/jpeg', 0.95));
      }

      return images;
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      throw error;
    }
  };

  useEffect(() => {
    const generatePreview = async () => {
      try {
        setIsLoading(true);
        
        // Generate PDF
        const doc = generatePDF({ formData });
        setPdfDoc(doc);

        // Get PDF as array buffer
        const pdfData = doc.output('arraybuffer');
        
        // Convert PDF to images
        const images = await convertPdfToImages(pdfData);
        setPdfImages(images);
        
      } catch (err) {
        console.error("Error generating PDF:", err);
        new Promise(resolve => setTimeout(resolve, 2000));
          toast.error('Please select the template first to see preview');
        new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/select_template');
      } finally {
        setIsLoading(false);
      }
    };

    if (formData?.selected_template) {
      generatePreview();
    }
  }, [formData]);

  const handleBack = () => {
    navigate('/builder');
  };

  const handleDownload = async () => {

    setIsLoading(true);
    const loadingToast = toast.loading('Processing...');

    try {
      const uploadResult = await uploadResume(pdfDoc, user.uid);
      
      if (!uploadResult) {
        throw new Error('Failed to save resume');
      }

      const downloadUrl = await downloadResume(uploadResult.documentId, uploadResult.fileId);
      if (!downloadUrl) {
        throw new Error('Failed to get download URL');
      }

      // For mobile compatibility
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Resume saved and downloaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to save resume. Please try again', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData?.selected_template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking template...</p>
      </div>
    );
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
            {isLoading ? (
              <div className="w-full h-[37rem] flex items-center justify-center">
                <Loader />
              </div>
            ) : pdfImages.length > 0 ? (
              <div className="w-full border-4 border-solid border-[#000000] rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src={pdfImages[currentPage - 1]} 
                  alt={`Resume page ${currentPage}`}
                  className="w-full h-auto"
                />
                {pdfImages.length > 1 && (
                  <div className="flex justify-center gap-4 p-4 bg-gray-100">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="flex items-center">
                      Page {currentPage} of {pdfImages.length}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pdfImages.length, prev + 1))}
                      disabled={currentPage === pdfImages.length}
                      className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[37rem] flex items-center justify-center">
                <p>No preview available</p>
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