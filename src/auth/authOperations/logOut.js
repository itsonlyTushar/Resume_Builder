import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase";

export const handleSignOut = async (dispatch, navigate, resetForm) => {
  const loading = toast.loading("Signing you out...");

  try {
    // Delay for smooth transition
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
