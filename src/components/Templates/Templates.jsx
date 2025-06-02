import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useDispatch } from "react-redux";
import { catch_template } from "../../features/templateSlice";
import Loader from '../UI/Loader';
import { useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
import { templateImgs } from "../../constants/constant";

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
          <Grid2 container spacing={3} justifyContent="center">
            {templateImgs.map((template) => (
              <Grid2 key={template.id} xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "1rem",
                    overflow: "hidden",
                    transition: "box-shadow 0.3s ease-in-out",
                    "&:hover": { boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" },
                  }}
                >
                  <CardMedia
                    component="img"
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
                          padding: "8px",
                          borderRadius: "10px",
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
      )}

      {/* Modal for Template Preview */}
      <Dialog open={!!selectedTemplate} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogContent sx={{ textAlign: "center", padding: "20px" }}>
          {selectedTemplate && (
            <>
              <img
                src={selectedTemplate.image}
                alt="Template Preview"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
              <Box mt={2}>
                <Button
                  onClick={() => handleTemplateSelect(selectedTemplate.id)}
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    padding: "8px 16px",
                    borderRadius: "10px",
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
