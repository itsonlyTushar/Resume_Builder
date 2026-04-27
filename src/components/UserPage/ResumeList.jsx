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

function ResumeList({ resumes, onResumeClick, onEdit, onDelete }) {
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
          const canEdit = !!resume.parsedFormData;

          return (
            <div
              key={resume.$id}
              className="group relative bg-white border-2 shadow-sm border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-300"
            >
              {/* Card Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
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

                    {/* Action icon buttons */}
                    <div className="flex items-center gap-1">
                      {/* View */}
                      <button
                        onClick={() => onResumeClick(resume)}
                        disabled={isExpired}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isExpired
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        title={isExpired ? "No downloads left" : "View Resume"}
                      >
                        <i className="ri-external-link-line text-xl"></i>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => canEdit && onEdit(resume)}
                        disabled={!canEdit}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          !canEdit
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={
                          canEdit
                            ? "Edit Resume"
                            : "Edit unavailable — legacy resume"
                        }
                      >
                        <i className="ri-edit-line text-xl"></i>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleOpenDialog(resume)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        title="Delete Resume"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status pill */}
                <div
                  className={`w-full py-2 px-4 rounded-xl text-sm font-semibold text-center ${
                    isExpired
                      ? "bg-gray-100 text-gray-400"
                      : "bg-black/5 text-gray-700"
                  }`}
                >
                  {isExpired
                    ? "No Downloads Left"
                    : `${resume.downloadsLeft} download${
                        resume.downloadsLeft !== 1 ? "s" : ""
                      } left`}
                </div>

                {/* Legacy hint */}
                {!canEdit && (
                  <p className="mt-2 text-center text-xs text-gray-400">
                    <i className="ri-information-line mr-1"></i>
                    Edit unavailable — legacy resume
                  </p>
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
        style={{ borderRadius: "30px" }}
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
