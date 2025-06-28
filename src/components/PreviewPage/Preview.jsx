import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../../auth/firebase";
import { uploadResume, downloadResume } from "../../backend/resumeOperations";
import { generatePDF } from "../../utils/helpers";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Modal } from "@mui/material";
import Logo from "../../pages/Logo";
import { PizzaIcon } from "lucide-react";
import qr from '../../assets/qr.png'

function Preview() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [open, setopen] = useState(false);

  const handleClose = () => setopen(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadDoc, setUploadDoc] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const formData = useSelector((state) => state.resumeBuilder.form_data);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        setIsLoading(true);

        const doc = generatePDF({ formData });

        setUploadDoc(doc);
        const blob = await doc.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfDoc(url);
      } catch (err) {
        console.error("Error generating PDF:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (formData?.selected_template) {
      generatePreview();
    }
  }, [formData]);

  useEffect(() => {
    if (!formData?.selected_template) {
      navigate("/select_template");
    }
    return () => {
      if (pdfDoc) {
        URL.revokeObjectURL(pdfDoc);
      }
    };
  }, [pdfDoc]);

  const handleBack = () => {
    navigate("/builder");
  };

  const handleDownload = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Processing...");

    try {
      const uploadResult = await uploadResume(uploadDoc, user.uid);
      if (!uploadResult) {
        throw new Error("Failed to save resume");
      }

      const downloadUrl = await downloadResume(
        uploadResult.documentId,
        uploadResult.fileId
      );
      if (!downloadUrl) {
        throw new Error("Failed to get download URL");
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Resume saved and downloaded successfully", {
        id: loadingToast,
      });

      setopen(true);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to save resume. Please try again", {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <h2 className="mt-5 sm:text-2xl text-3xl md:text-2xl lg:text-4xl font-bold mb-5 text-center">
        Resume Preview
      </h2>

      <div className="container mx-auto px-4 mb-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* PDF Preview Display*/}
          <div className="w-full lg:w-2/3 ">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              {pdfDoc && <Viewer fileUrl={pdfDoc} />}
            </Worker>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col  gap-4 py-24">
            <button
              onClick={handleDownload}
              disabled={isLoading || !pdfDoc}
              className={`transition-all hover:shadow-lg shadow-xl ease-in-out delay-100 hover:-translate-y-0 hover:scale-105 border px-6 bg-black py-2 text-white text-lg rounded-full ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <i className="ri-download-2-fill mr-1"></i>
              {isLoading ? "Saving..." : "Save & Download"}
            </button>

            <button
              onClick={handleBack}
              disabled={isLoading}
              className="shadow-lg px-10 py-2 text-black text-lg rounded-full bg-[#EEEFEF]"
            >
              <i className="ri-arrow-left-circle-line mr-1"></i> Back
            </button>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md" >
          <div className="text-center">
            <Logo />
            <p className="text-md  text-blackBg mt-4 py-4">
              if you liked using app consider paying what you like!
            </p>
            <div className="flex justify-center items-center">
              <img src={qr} alt="qr" />
            </div>
            <div className="flex justify-center items-center">
              


              <a
                href="upi://pay?pa=tushargsoni17@okicici&pn=TusharSoni&cu=INR"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center gap-2 justify-center bg-black text-white px-2 py-2 rounded-xl text-lg">
                  <PizzaIcon />
                  Buy me a Pizza
                </button>
              </a>

            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
}

export default Preview;
