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
  const { reset } = useForm();

  const handleOpenDialog = () => {
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

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen">
        <Navbar />
        <div
          className="flex-grow flex justify-center"
          style={{ minHeight: "calc(80vh - 200px)" }}
        >
          <Toaster />

          <div className="p-5">
            <h1 className="text-center text-5xl font-semibold py-10">
              User Profile
            </h1>
            <div className="border-none rounded-3xl p-5 flex justify-center items-center flex-wrap overflow-hidden w-[350px] sm:w-full bg-gray-100 border shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl py-16">
                <div className="flex justify-center items-center">
                  <h1 className="text-4xl mt-4 font-semibold">
                    {displayName || "User"}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSignOut(dispatch, navigate, reset)}
                    className="border transition-all hover:shadow-lg shadow-sm ease-in-out delay-100 hover:-translate-y-0 hover:scale-110 font-semibold rounded-2xl cursor-pointer text-lg text-white bg-black py-2 px-2"
                  >
                    Sign out
                  </button>
                  <button
                    onClick={() => {
                      handleOpenDialog({
                        title: "Delete Account",
                        message: "Are you sure you want delete you account ?",
                      });
                    }}
                    className=" border transition-all hover:shadow-lg shadow-sm ease-in-out delay-100 hover:-translate-y-0 hover:scale-110 font-semibold rounded-2xl cursor-pointer text-lg text-white bg-[#E10400] py-2 px-2"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#EEEFEF] rounded-3xl sm:h-[60vh] h-[550px] max-w-3xl">
              <div className="mt-10">
                <h1 className="text-4xl font-semibold mt-5 mb-10 ml-3 p-5">
                  My Resumes
                </h1>
              </div>
              <div className="flex justify-center items-center">
                {isLoadingResumes ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader />
                  </div>
                ) : (
                  <div>
                    <ResumeList
                      resumes={resumes}
                      onResumeClick={handleResumeClick}
                      onDelete={handleResumeDelete}
                    />
                  </div>
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
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to do this?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your Account will be deleted permanently
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
