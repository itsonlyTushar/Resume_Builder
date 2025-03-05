import React from "react";
import { deleteResume } from "../state_templates/resumeOperations";
import toast from "react-hot-toast";
import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

function ResumeList({ resumes, onResumeClick, onDelete }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const handleOpenDialog = (resume) => {
    setResumeToDelete(resume);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setResumeToDelete(null);
    setOpenDialog(false);
  };
  
  const handleCVDelete = async () => {
    try {
      await deleteResume(resumeToDelete.$id, resumeToDelete.fileId);
      onDelete();
      handleCloseDialog();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete resume");
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center text-center justify-center p-8">
        <div>
          <i className="ri-file-list-3-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-600 text-center">No resumes created yet</p>
          <button
            onClick={() => (window.location.href = "/select_template")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {resumes.map((resume) => {
          const created_At = resume.$createdAt;
          const date = new Date(created_At);
          const formateDate = date.toLocaleDateString("en-GB");

          return (
            <div
              key={resume.$id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Resume id: {resume.fileId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Date: {formateDate}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenDialog(resume)}
                  className="text-red-500 hover:text-red-700 p-1 ml-5"
                  title="Delete Resume"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => onResumeClick(resume)}
                  className={`text-sm ${
                    resume.downloadsLeft > 0
                      ? "text-gray-500 hover:text-black"
                      : "text-gray-300 cursor-not-allowed"
                  } transition-colors`}
                  disabled={resume.downloadsLeft <= 0}
                >
                  {resume.downloadsLeft > 0 ? "View Resume" : "No downloads left"}
                </button>
                <i className="ri-external-link-line text-gray-600"></i>
              </div>

              <div className="flex gap-2 text-[#4B5563] mt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=Check%20out%20my%20resume%20here:%20${resume.downloadUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-whatsapp-line"></i>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${resume.downloadUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-linkedin-fill"></i>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${resume.downloadUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-twitter-x-line"></i>
                </a>
              </div>
            </div>
          );
        })}
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
            Your resume will be deleted permanently
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleCVDelete}
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
  );
}

export default ResumeList;
