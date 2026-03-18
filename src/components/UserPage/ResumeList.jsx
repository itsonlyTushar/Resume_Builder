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
                className="group relative bg-white border-2 shadow-sm border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-300"
              >

                {/* Card Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          Saved Resume 
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

                    <i className="ri-link-m mr-2"></i>
                    {isExpired ? "No Downloads Left" : "View Resume"}
                  </button>
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
