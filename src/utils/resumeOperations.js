import { storage, databases } from '../backend/appwrite'
import { ID, Query } from 'appwrite';
import toast from "react-hot-toast";

const STORAGE_BUCKET = '676d037b001892026fbf';
const DATABASE_ID = '677138b5003a8ac08657';
const RESUMES_COLLECTION = '679b1dfe003d6270e5df'

const MAX_RESUMES = 2;

// Get user counts from appwrite collection
const getUserResumeCount = async (userId) => {
  try {
    const shortUserId = userId.slice(0,4);
    const response = await databases.listDocuments(
      DATABASE_ID,  
      RESUMES_COLLECTION,
      [Query.equal("userId", shortUserId)]
    );
    return response.documents.length;
  } catch (error) {
    console.error('Error getting resume')
    throw error;
  }
}

// Uploads the resume to appwrite

export const uploadResume = async (pdfDoc, userId) => {
  const loadingToast = toast.loading('Saving Resume...');
  try {

    const resumeCount = await getUserResumeCount(userId);
    if (resumeCount >= MAX_RESUMES) {
      toast.error(`You can only create up to ${MAX_RESUMES} resumes. Please delete an existing resume first.`, { id: loadingToast });
      return null;
    }

    const pdfBlob = pdfDoc.output('blob');
    const timestamp = Date.now().toString(36).slice(-5);
    const pdfFile = new File([pdfBlob], `${timestamp}.pdf`, { type: 'application/pdf' });
    const shortFileId = timestamp.padStart(5, '0');
    const shortUserId = userId.slice(0, 4);

    const fileResponse = await storage.createFile(
      STORAGE_BUCKET,
      shortFileId,
      pdfFile
    );

    if (!fileResponse?.$id) {
      throw new Error('File upload failed');
    }

    const documentData = {
      userId: shortUserId,
      fileId: shortFileId,
      down: '2'
    };

    const dbResponse = await databases.createDocument(
      DATABASE_ID,
      RESUMES_COLLECTION,
      ID.unique(),
      documentData
    );

    toast.success('Resume saved successfully!', { id: loadingToast });
    return { fileId: shortFileId, documentId: dbResponse.$id };

  } catch (error) {
    console.error('Upload error:', error);
    toast.error(`Failed to save resume: ${error.message}`, { id: loadingToast });
    throw error;
  }
};

// Fetching the resumes to show in user page
export const fetchUserResumes = async (userId) => {
  try {
    const shortUserId = userId.slice(0, 4);
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      RESUMES_COLLECTION,
      [
        Query.equal("userId", shortUserId),
        Query.limit(100)
      ]
    );
    
    if (!response?.documents) {
      throw new Error('No documents found');
    }

    const resumesWithUrls = response.documents.map(doc => ({
      ...doc,
      previewUrl: storage.getFileView(STORAGE_BUCKET, doc.fileId),
      downloadUrl: storage.getFileDownload(STORAGE_BUCKET, doc.fileId),
      downloadsLeft: parseInt(doc.down)
    }));
    
    return resumesWithUrls;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw error;
  }
};

export const getResumeFileUrl = async (fileId) => {
    try {
        const fileUrl = storage.getFileView(STORAGE_BUCKET,fileId);
        return fileUrl;

    } catch (error) {
        console.error("Error getting URL resumes:", error);
        throw error;
    }
};

// deletes resume from appwrite and a user page also
export const deleteResume = async (documentId, fileId) => {
  const loadingToast = toast.loading('Deleting resume...');
  try {
    // Delete file from storage first
    await storage.deleteFile(
      STORAGE_BUCKET,
      fileId
    );
    
    // Then delete the document from database
    await databases.deleteDocument(
      DATABASE_ID,
      RESUMES_COLLECTION,
      documentId
    );

    toast.success('Resume deleted successfully', { id: loadingToast });
    return true;
  } catch (error) {
    console.error('Resume deletion error:', error);
    toast.error('Failed to delete resume', { id: loadingToast });
    throw error;
  }
};

// download function to download resumes
export const downloadResume = async (documentId, fileId) => {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      RESUMES_COLLECTION,
      documentId
    );

    const downloadsLeft = parseInt(doc.down);
    if (downloadsLeft <= 0) {
      toast.error('You have reached the maximum number of downloads for this resume');
      return null;
    }

    await databases.updateDocument(
      DATABASE_ID,
      RESUMES_COLLECTION,
      documentId,
      {
        down: (downloadsLeft - 1).toString()
      }
    );

    return storage.getFileDownload(STORAGE_BUCKET, fileId);

  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
};

