import { useEffect, useState, useCallback, memo } from "react";
import { Outlet, useNavigate } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography, LinearProgress } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useDispatch } from "react-redux";
import { catch_template, setFormData } from "../../features/templateSlice";
import Loader from "../UI/Loader";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { devTemplate, templateImgs } from "./templateConfig";
import Tooltip from '../UI/Tooltip';
import { fallBackModel } from "../../constants/fallbackModel";
import { autofillPrompt } from "../../constants/AutofillPrompt";
import { pdfjs } from "react-pdf";
import toast, { Toaster } from "react-hot-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Memoized Template Card Component
const TemplateCard = memo(({ template, onOpenModal }) => (
  <Grid2 xs={12} sm={6} md={3}>
    <Card
      variant="outlined"
      sx={{
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.02)",
        },
      }}
    >
      <CardMedia
        component="img"
        loading="lazy"
        sx={{
          height: "auto",
          width: "100%",
          maxHeight: 420,
          objectFit: "cover",
          cursor: "pointer",
        }}
        image={template.image}
        onClick={() => onOpenModal(template)}
      />
      <CardActions>
        <Box display="flex" justifyContent="center" width="100%">
          <Button
            onClick={() => onOpenModal(template)}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "black",
              padding: "8px 16px",
              borderRadius: "10px",
              transition: "all 0.2s ease-in-out",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            View Template
          </Button>
        </Box>
      </CardActions>
    </Card>
  </Grid2>
));

TemplateCard.displayName = 'TemplateCard';

function Templates() {
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTemplateSelect = useCallback((templateId) => {
    dispatch(catch_template(templateId));
    setOptionsModalOpen(true);
    setSelectedTemplate(null);
  }, [dispatch]);

  const handleBuilderOption = () => {
    setOptionsModalOpen(false);
    navigate("/builder");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatus("Reading PDF file...");
    try {
      const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
      let rawText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        rawText += textContent.items.map((item) => item.str).join(" ") + " ";
        setUploadProgress(10 + Math.floor((i / pdf.numPages) * 30));
      }

      setUploadStatus("AI is analyzing your resume...");
      
      const interval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 1 : prev);
      }, 300);

      const result = await fallBackModel(rawText, autofillPrompt);
      const response = await result.response;
      let text = response.text();

      clearInterval(interval);
      setUploadProgress(95);
      setUploadStatus("Formatting data...");

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsedData = JSON.parse(text);
      dispatch(setFormData(parsedData));

      setUploadProgress(100);
      setUploadStatus("Done!");
      toast.success("Resume data loaded successfully!");
      setTimeout(() => {
        setOptionsModalOpen(false);
        setIsUploading(false);
        navigate("/builder");
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract data from the PDF.");
      setIsUploading(false);
    } finally {
      e.target.value = null;
    }
  };

  const handleOpenModal = useCallback((template) => {
    setSelectedTemplate(template);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="p-4 mt-5 mb-24">
          <h1 className="text-center text-3xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold py-6 text-gray-800">
            Select a Template
          </h1>

          {/* Developer Friendly */}
          <div className="flex items-center gap-2">

          <h3 className="text-3xl font-bold text-start text-gray-800 ">
            Developer Friendly
          </h3>
          
          <Tooltip title={"The Developer Friendly resume template is clean, minimal, and tailored for showcasing technical skills and projects."}>
            <i className="ri-question-line font-medium"></i>
          </Tooltip>
          </div>
          <div className="h-[2px] bg-black w-full max-w-sm mb-6"></div>

          <Box display="flex" justifyContent="center" className="mb-10">
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "70%", md: "50%", lg: "40%" },
                borderRadius: "1rem",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardMedia
                component="img"
                loading="lazy"
                sx={{
                  height: "auto",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                image={devTemplate.image}
                onClick={() => handleTemplateSelect(devTemplate.id)}
              />
              <CardActions>
                <Box display="flex" justifyContent="center" width="100%">
                  <Button
                    onClick={() => handleTemplateSelect(devTemplate.id)}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "black",
                      padding: "8px 22px",
                      borderRadius: "10px",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    Select
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>

          {/* Other Templates */}
          <h3 className="text-3xl font-bold text-start text-gray-800 pt-4 pb-2">
            Other Templates
          </h3>
          <div className="h-[2px] bg-black w-full max-w-sm mb-6"></div>

          <div className="bg-gray-100 p-5 rounded-3xl">
          
          <Grid2 container spacing={3} justifyContent="center">
            {templateImgs.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onOpenModal={handleOpenModal}
              />
            ))}
          </Grid2>

          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog
        open={!!selectedTemplate}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ textAlign: "center", padding: "24px" }}>
          {selectedTemplate && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
              >
                {selectedTemplate.name || "Template Preview"}
              </Typography>
              <img
                loading="lazy"
                src={selectedTemplate.image}
                alt="Template Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                }}
              />
              <Box mt={3}>
                <Button
                  onClick={() => handleTemplateSelect(selectedTemplate.id)}
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  Choose Template
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Options Modal */}
      <Dialog
        open={optionsModalOpen}
        onClose={() => !isUploading && setOptionsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            minHeight: "400px",
            display: "flex",
            justifyContent: "center",
          }
        }}
      >
        <DialogContent sx={{ textAlign: "center", padding: "40px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 5, color: "#333" }}>
            {isUploading ? "Uploading Resume" : "How would you like to start?"}
          </Typography>
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3} alignItems="stretch">
            {/* Option 1: Start from Scratch */}
            {!isUploading && (
              <Box 
                onClick={handleBuilderOption}
                sx={{
                  flex: 1,
                  border: "2px solid #eaeaea",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  "&:hover": {
                    borderColor: "black",
                    backgroundColor: "rgba(0,0,0,0.02)",
                    transform: "translateY(-4px)"
                  }
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 text-black flex items-center justify-center mb-2">
                  <i className="ri-file-edit-line text-3xl"></i>
                </div>
                <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  Start from Scratch
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                  Build your resume step-by-step using our manual builder.
                </Typography>
              </Box>
            )}

            {/* Option 2: Upload Resume */}
            <Box 
              sx={{
                flex: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <input
                type="file"
                accept=".pdf"
                id="resume-upload"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <label htmlFor="resume-upload" style={{ flex: 1, display: "flex", flexDirection: "column", cursor: isUploading ? "default" : "pointer" }}>
                <Box
                  sx={{
                    flex: 1,
                    border: isUploading ? "none" : "2px dashed #eaeaea",
                    borderRadius: "16px",
                    padding: isUploading ? "0px" : "32px 24px",
                    cursor: "inherit",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    "&:hover": {
                      borderColor: isUploading ? "transparent" : "black",
                      backgroundColor: isUploading ? "transparent" : "rgba(0,0,0,0.02)",
                      transform: isUploading ? "none" : "translateY(-4px)"
                    }
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 text-black flex items-center justify-center mb-2">
                    {isUploading ? (
                      <i className="ri-loader-4-line animate-spin text-3xl"></i>
                    ) : (
                      <i className="ri-upload-cloud-2-line text-3xl"></i>
                    )}
                  </div>
                  <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {isUploading ? uploadStatus : "Upload to Autofill"}
                  </Typography>
                  
                  {isUploading ? (
                    <Box sx={{ width: '80%', mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4, 
                          backgroundColor: '#eaeaea', 
                          '& .MuiLinearProgress-bar': { backgroundColor: 'black' } 
                        }} 
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontWeight: "bold" }}>
                        {uploadProgress}%
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                      Upload your existing PDF resume and let AI fill in the details.
                    </Typography>
                  )}
                </Box>
              </label>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
      <Outlet />
    </>
  );
}

export default Templates;
