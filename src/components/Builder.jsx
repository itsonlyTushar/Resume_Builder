import React, { useEffect, useState } from "react";
import { Step, StepLabel, Stepper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetails from "./form_blocks/PersonalDetails";
import EducationDetails from "./form_blocks/EducationDetails";
import ExperinceDetails from "./form_blocks/ExperinceDetails";
import OtherDetails from "./form_blocks/OtherDetails";
import ProjectDetails from "./form_blocks/ProjectDetails";
import Loader from "../pages/Loader";
import Navbar from "./Navbar";
import Footer from "../pages/Footer";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { resetFormData } from "../state_templates/templateSlice";
import Tooltip from "../pages/Tooltip";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";


function Builder() {
  const formData = useSelector((state) => state.resumeBuilder.form_data);
  const [openDialog, setOpenDialog] = useState(false);
  const methods = useForm({
    defaultValues: {
      personalDetails: formData.personalDetails || [],
      educationDetails: formData.educationDetails || [],
      experienceDetails: formData.experienceDetails || [],
      projectDetails: formData.projectDetails || [],
      skills: formData.skills || [],
    },
  });

  useEffect(() => {
    methods.reset({
      personalDetails: formData.personalDetails || [],
      educationDetails: formData.educationDetails || [],
      experienceDetails: formData.experienceDetails || [],
      projectDetails: formData.projectDetails || [],
      skills: formData.skills || [],
    });
  }, [formData]);

  const [loading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  
  const navigate = useNavigate();
  const steps = [
    "Personal Details",
    "Education Details",
    "Experience Details",
    "Project Details",
    "Other Details",
  ];
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit = async () => {
    const loadingToast = toast.loading('Generating resume...');
    try {
      toast.success('Resume generated and you can download', { id: loadingToast });
      navigate('/preview');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(`Failed to generate resume: ${err.message}`, { id: loadingToast });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFormChange = (step) => {
    switch (step) {
      case 0:
        return <PersonalDetails />;
      case 1:
        return <EducationDetails />;
      case 2:
        return <ExperinceDetails />;
      case 3:
        return <ProjectDetails />;
      case 4:
        return <OtherDetails />;
    }
  };

  const handleClickPreview = (event) => {
    event.preventDefault();
    navigate("/preview");
  };

  const handleReset = () => {
    dispatch(resetFormData());
    methods.reset({
      personalDetails: [
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          linkedin: "",
          about: "",
          id: 1,
        },
      ],
      educationDetails: [
        { collegeName: "", course: "", location: "", year: "", id: 1 },
      ],
      experienceDetails: [
        {
          companyName: "",
          role: "",
          location: "",
          year: "",
          description: "",
          id: 1,
        },
      ],
      projectDetails: [
        {
          projectName: "",
          techStack: "",
          year: "",
          projectLink: "",
          id: 1,
        },
      ],
      skills: [{ skillName: "", level: "", id: 1 }]
    });

    setActiveStep(0);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex sm:flex-row justify-center items-center px-0 z-10 mb-32 mt-6">
        <div className="p-5">
          <div className="border-none rounded-3xl flex-wrap overflow-hidden bg-gray-100 py-6 sm:px-10  sm:py-28 shadow-sm">
            <Stepper
              activeStep={activeStep}
              orientation={isMobile ? "horizontal" : "vertical"}
              sx={{
                "& .MuiStepLabel-label": {
                  color: "#fffff",
                  fontSize: isMobile ? "12px" : "18px",
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: "black",
                },
                "& .MuiStepIcon-root": {
                  color: "#AE445A",
                  fontSize: isMobile ? "0px" : "26px",
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: "black",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "black",
                  fontWeight: "bold",
                },
                "& .MuiStepConnector-line": {
                  borderColor: "linear-gradient(to right,#171F2E, #6b90cf)",
                },
              }}
            >
              {steps.map((item, index) => (
                <Step key={index}>
                  <StepLabel>{item}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>
        <div className="p-5">
          <FormProvider {...methods}> 
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="bg-[#EEEEEE] min-h-scren rounded-3xl p-10 sm:w-[55vw] overflow-y-auto custom-scrollbar">
                {loading ? <Loader /> : handleFormChange(activeStep)}
                <div className="flex gap-4 items-center mt-8">
                  <Tooltip title="Reset Complete Form">
                    <button
                      className="bg-white hover:bg-[#FAFAFA] text-black rounded-xl p-2 px-4"
                      onClick={handleOpenDialog}
                    >
                      <i className="ri-reset-right-line text-sm"></i>
                    </button>
                  </Tooltip>
                  <Tooltip title="Live preview">
                    <button
                      onClick={handleClickPreview}
                      className="bg-white hover:bg-[#FAFAFA] text-black rounded-xl p-2 px-4"
                    >
                      Preview
                    </button>
                  </Tooltip>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="flex">
        <button
          className="bg-black text-white px-5 mx-2 py-2 rounded-2xl text-lg"
          type={activeStep === steps.length - 1 ? "submit" : "button"}
          onClick={
            activeStep === steps.length - 1
              ? methods.handleSubmit(onSubmit)
              : methods.handleSubmit(handleNext)
          }
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
          <i className="ri-arrow-right-s-line text-sm"></i>
        </button>
        <button
          hidden={activeStep === 0 ? true : false}
          className="text-black px-5 mx-2 py-2 rounded-2xl text-lg bg-[#EEEFEF]"
          onClick={handleBack}
        >
          Back
        </button>
        </div>
      </div>
      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{
            borderRadius: "30px",
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to reset form ?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              All input data will be reset
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleReset}
              variant="contained"
              style={{
                backgroundColor: "#000000",
                color: "white",
                borderRadius: "10px",
              }}
              autoFocus
            >
              Reset Form
            </Button>
          </DialogActions>
        </Dialog>

      <Footer />
    </>
  );
}

export default Builder;
