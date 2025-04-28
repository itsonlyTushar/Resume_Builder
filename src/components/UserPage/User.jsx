import React, { useEffect, useState } from "react";
import place_holder from "../../assets/placeholder-male.jpg";
import { auth } from "../../auth/firebase";
import { deleteUser, signOut } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import * as Popover from "@radix-ui/react-popover";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer.jsx";
import { COLLECTION_ID, DATABASE_ID, databases, storage, STORAGE_BUCKET } from "../../backend/appwrite";
import { ID, Query } from "appwrite";
import ResumeList from "./ResumeList";
import { fetchUserResumes } from "../../utils/resumeOperations.js";
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

export const handleSignOut = async (dispatch, navigate,resetForm) => {
  const loading = toast.loading("Signing you out...");

  try {
    // Deley for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await signOut(auth);

    dispatch({ type: "RESET_STORE" });

    resetForm();

    toast.success("Signed out successfully!", { id: loading });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // navigate to home page after log out.
    setTimeout(() => {
      navigate("/"); 
    }, 2000); 
  } catch (error) {
    console.error("Sign out error:", error);
    toast.error("Sign out failed!", { id: loading });
  }
};



function User() {

  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user.uid;
  const displayName = user.displayName;
  const [documentId, setDocumentId] = useState(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [uploading,setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const { reset } = useForm();

  // Appwrite Config
  const storage_bucket = STORAGE_BUCKET
  const database_id = DATABASE_ID
  const collection_id = COLLECTION_ID
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];



  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // handling the profile image upload to appwrite
  const imageUpload = async (e) => {
    const file = e.target.files[0];


    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG and JPG files are allowed");
      return;
    }

    setUploading(true);
    let uploadToast = toast.loading("Uploading image...");

    try {
      if (fileId) {
        try {
          await storage.deleteFile(storage_bucket, fileId);
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      const response = await storage.createFile(
        storage_bucket,
        ID.unique(),
        file
      );

      const newFileId = response.$id;

      // Prepare document data with timestamp
      const documentData = {
        uid: userId,
        fileId: newFileId,
        lastUpdated: new Date().toISOString(),
      };

      // Update or create document based on whether we have an existing one
      if (documentId) {
        await databases.updateDocument(
          database_id,
          collection_id,
          documentId,
          documentData
        );
      } else {
        const dbResponse = await databases.createDocument(
          database_id,
          collection_id,
          ID.unique(),
          documentData
        );
        setDocumentId(dbResponse.$id);
      }

      // Update the UI with the new image
      const previewUrl = storage.getFilePreview(storage_bucket, newFileId);
      setFileId(newFileId);
      setImage(previewUrl);

      toast.success("Image uploaded successfully", { id: uploadToast });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`, {
        id: uploadToast,
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        // Fetch the most recent image document for this user
        const response = await databases.listDocuments(
          database_id,
          collection_id,
          [Query.equal("uid", userId), Query.limit(1)]
        );

        if (response.documents.length > 0) {
          const userDoc = response.documents[0];
          setDocumentId(userDoc.$id);
          setFileId(userDoc.fileId);

          try {
            await storage.getFile(storage_bucket, userDoc.fileId);
            const previewUrl = storage.getFilePreview(
              storage_bucket,
              userDoc.fileId
            );
            setImage(previewUrl);
          } catch (fileError) {
            console.error("File not found:", fileError);
            setImage(place_holder);
          }
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
        toast.error("Failed to load profile image");
        setImage(place_holder);
      }
    };
    fetchUserImage();

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

  // function to open resume on click
  const handleResumeClick = async (resume) => {
    try {
      window.open(resume.downloadUrl, "_blank");
    } catch (error) {
      console.error("Error opening resume:", error);
      toast.error("Failed to open resume");
    }
  };


  // delete account permenantly
  const handleDelete = async () => {
    try {
      const user = auth.currentUser;
      await deleteUser(user);
      toast.success("Account deleted successfully");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete account");
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
            <div className="border-none rounded-3xl p-5 flex justify-center items-center flex-wrap overflow-hidden w-[350px] sm:w-full bg-gray-100 border shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <div className="z-10">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="px-4 py-2 rounded-3xl text-white">
                        <img
                          className="rounded-3xl h-[14rem]"
                          src={image || place_holder}
                          alt="place-holder"
                        />
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        className="bg-white p-3 shadow-md rounded-2xl border-none"
                        sideOffset={1}
                        side="left"
                        onPointerEnter={(e) => e.stopPropagation()}
                      >
                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="file-upload"
                          onChange={imageUpload}
                        />
                        <button
                          onClick={() => document.getElementById('file-upload').click()}
                          disabled={uploading}
                          htmlFor="file-upload"
                          className="z-10 cursor-pointer"
                        >
                          <i className="ri-upload-2-line"></i> Upload
                        </button>
                        <Popover.Arrow
                          className="fill-white h-3 w-2"
                          style={{ position: "absolute", zIndex: 1 }}
                        />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
                <div className="flex justify-center items-center">
                  <h1 className="text-4xl mt-4 font-semibold">{displayName}</h1>
                </div>
                <div className="flex sm:flex-col justify-center items-center mx-auto text-center gap-2 z-10 mb-6 mt-6">
                  <button
                    onClick={() => handleSignOut(dispatch,navigate,reset)}
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
            <div className="bg-[#EEEFEF] rounded-3xl sm:h-[60vh] h-[550px]">
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
              onClick={handleDelete}
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
