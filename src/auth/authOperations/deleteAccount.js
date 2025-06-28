import { deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

  // delete account permanently
 export const handleDelete = async (navigate) => {
    try {
      const user = auth.currentUser;

      const provider = new GoogleAuthProvider();

      await reauthenticateWithPopup(user,provider)
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