import { deleteResume } from "../../backend/resumeOperations";
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => {
            const created_At = resume.$createdAt;
            const date = new Date(created_At);
            const formateDate = date.toLocaleDateString("en-GB");
            const isExpired = resume.downloadsLeft <= 0;

            return (
              <div
                key={resume.$id}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {isExpired ? (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                      Expired
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          Resume #{resume.fileId.slice(0, 8)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="ri-calendar-line mr-1"></i>
                          <span>{formateDate}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenDialog(resume)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        title="Delete Resume"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => onResumeClick(resume)}
                    disabled={isExpired}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 mb-4 ${
                      isExpired
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
                    }`}
                  >
                    <i className="ri-eye-line mr-2"></i>
                    {isExpired ? "No Downloads Left" : "View Resume"}
                  </button>

                  {/* Social Share */}
                  {!isExpired && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Share on</p>
                      <div className="flex gap-3">
                        <a
                          href={`https://api.whatsapp.com/send?text=Check%20out%20my%20resume%20here:%20${resume.downloadUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center py-2 px-3 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-lg transition-all duration-200 hover:scale-105"
                          title="Share on WhatsApp"
                        >
                          <i className="ri-whatsapp-line text-lg"></i>
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${resume.downloadUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center py-2 px-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg transition-all duration-200 hover:scale-105"
                          title="Share on LinkedIn"
                        >
                          <i className="ri-linkedin-fill text-lg"></i>
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${resume.downloadUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center py-2 px-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-200 hover:scale-105"
                          title="Share on X (Twitter)"
                        >
                          <i className="ri-twitter-x-line text-lg"></i>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
    </>
  );
}

export default ResumeList;
