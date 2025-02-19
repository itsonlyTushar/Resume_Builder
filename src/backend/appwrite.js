import { Client, Databases, Storage } from "appwrite";


export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)


export const STORAGE_BUCKET = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

    
export const databases = new Databases(client)
export const storage = new Storage(client)