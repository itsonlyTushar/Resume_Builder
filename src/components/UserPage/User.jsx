import { useEffect, useState } from "react";
import { auth } from "../../auth/firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer.jsx";
import ResumeList from "./ResumeList";
import { fetchUserResumes } from "../../backend/resumeOperations.js";
import { useDispatch } from "react-redux";
import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Loader from "../UI/Loader.jsx";
import { handleDelete } from "../../auth/authOperations/deleteAccount";
import { handleSignOut } from "../../auth/authOperations/logOut.js";

function User() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user.uid;
  const displayName = user.displayName;
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [resumes, setResumes] = useState([]);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const { reset } = useForm();

  const handleOpenDialog = ({ title = "Delete Account", message = "Are you sure?" } = {}) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const loadResumes = async () => {
      if (!userId) return;

      setIsLoadingResumes(true);
      try {
        const userResumes = await fetchUserResumes(userId);
        setResumes(userResumes);
      } catch (error) {
        console.error("Error loading resumes:", error);
        toast.error("Failed to load your resumes");
      } finally {
        setIsLoadingResumes(false);
      }
    };

    loadResumes();
  }, [userId]);

  
  const handleResumeClick = async (resume) => {
    try {
      window.open(resume.downloadUrl, "_blank");
    } catch (error) {
      console.error("Error opening resume:", error);
      toast.error("Failed to open resume");
    }
  };

  const handleResumeDelete = () => {
    const loadResumes = async () => {
      const userResumes = await fetchUserResumes(userId);
      setResumes(userResumes);
    };
    loadResumes();
  };

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen">
        <Navbar />
        <div
          className="flex-grow flex justify-center"
          style={{ minHeight: "calc(80vh - 200px)" }}
        >
          <Toaster />

          <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-center text-5xl pt-10 font-semibold mb-10">
              User Profile
            </h1>
            
            {/* Profile Card */}
            <div className="border rounded-3xl p-8 sm:p-12 shadow-sm mb-8 bg-gradient-to-br from-white to-gray-50">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar and Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                  <Avatar 
                    sx={{ 
                      bgcolor: "#000000", 
                      width: 96, 
                      height: 96,
                      fontSize: '2rem',
                      fontWeight: 600,
                      border: '4px solid #f3f4f6'
                    }}
                  >
                    {initials}
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h2 className="text-4xl font-bold mb-2">{displayName || "User"}</h2>
                    <p className="text-lg text-gray-600 mb-4">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                        Active Account
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                        {resumes.length} Resume{resumes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: 'black',
                      color: 'black',
                      borderRadius: '12px',
                      padding: '10px 24px',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'black',
                        color: 'white',
                        borderColor: 'black'
                      }
                    }}
                    onClick={() => handleSignOut(dispatch, navigate, reset)}
                  >
                    <i className="ri-logout-box-r-line mr-2"></i>
                    Sign Out
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#EF4444',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '10px 24px',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#DC2626'
                      }
                    }}
                    onClick={() =>
                      handleOpenDialog({
                        title: "Delete Account",
                        message: "Your account and data will be permanently deleted.",
                      })
                    }
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
            {/* Resumes Section */}
            <div className="border rounded-3xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white border-b px-8 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">My Resumes</h2>
                    <p className="text-gray-600">Manage and share your professional resumes</p>
                  </div>
                  {resumes.length > 0 && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '10px 24px',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#1f2937'
                        }
                      }}
                      onClick={() => navigate('/builder')}
                    >
                      <i className="ri-add-line mr-2"></i>
                      Create New Resume
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="sm:h-[60vh] h-[550px] overflow-y-auto p-6 scrollbar-hide">
                {isLoadingResumes ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader />
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <i className="ri-file-list-3-line text-5xl text-gray-400"></i>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">No resumes yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md">Start building your professional resume with our easy-to-use builder</p>
                    <Button 
                      variant="contained"
                      sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '12px 32px',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#1f2937'
                        }
                      }}
                      onClick={() => navigate('/builder')}
                    >
                      <i className="ri-add-line mr-2"></i>
                      Create Your First Resume
                    </Button>
                  </div>
                ) : (
                  <ResumeList
                    resumes={resumes}
                    onResumeClick={handleResumeClick}
                    onDelete={handleResumeDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <MuiDialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{
            borderRadius: "30px",
          }}
        >
          <DialogTitle id="alert-dialog-title">{dialogTitle || "Confirm action"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogMessage || "This action cannot be undone."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={() => handleDelete(navigate)}
              variant="contained"
              style={{
                backgroundColor: "#E10400",
                color: "white",
                borderRadius: "10px",
              }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </MuiDialog>
      </div>
      <Footer />
    </>
  );
}

export default User;
