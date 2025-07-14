import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useDispatch } from "react-redux";
import { catch_template } from "../../features/templateSlice";
import Loader from "../UI/Loader";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { devTemplate, templateImgs } from "./templateConfig";
import Tooltip from '../UI/Tooltip'


function Templates() {
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId) => {
    dispatch(catch_template(templateId));
    navigate("/builder");
  };

  const handleOpenModal = (template) => {
    setSelectedTemplate(template);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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
              <Grid2 key={template.id} xs={12} sm={6} md={3}>
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
                    onClick={() => handleOpenModal(template)}
                  />
                  <CardActions>
                    <Box display="flex" justifyContent="center" width="100%">
                      <Button
                        onClick={() => handleOpenModal(template)}
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

      <Footer />
      <Outlet />
    </>
  );
}

export default Templates;
