import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import GoogleAuth from "./GoogleAuth";
import Navigation from "../components/Navbar/Navigation";


function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loading = toast.loading('Signed in!', {duration: 2000});
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("redirecting to templates", { id: loading });
      
      setTimeout(() => {
        navigate("/select_template");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        toast.error("Invalid Credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email || email.trim() === "") {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Failed to send email. Make sure the email is registered.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Navigation />
      <form
        onSubmit={handleSignIn}
        className="flex items-center justify-center min-h-screen p-5"
      >
        <div className="border border-gray-200 rounded-3xl p-10 mt-24">
          <div className="flex justify-center text-5xl ">
            <i className="ri-attachment-2"></i>
          </div>
          <h1 className="text-xl font-bold mb-4 text-center">Sign In With Resumate</h1>
          <div className="block">
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="block py-2 border-slate-200 shadow-sm mb-2 rounded-md w-full focus:border-black focus:ring-0 focus:outline-none"
              type="email"
              placeholder="Enter Email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="block py-2 border-slate-200 shadow-sm rounded-md w-full focus:border-black focus:ring-0 focus:outline-none"
              type="password"
              placeholder="Enter Password"
            />
            <button
              type="submit"
              className="block bg-black text-white w-full py-2 rounded-md mt-3 text-md"
            >
              {isLoading ? <i className="fa fa-spinner fa-spin"></i> : ""}{" "}
              {isLoading ? "" : <i class="ri-login-box-line"></i>} Continue Sign
              In
            </button>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="mt-1 text-sm"
            >
              Forgot Password?
            </button>
            <div className="bg-gray-300 h-[0.2px] mt-4 w-full"></div>

            <GoogleAuth name="Sign in with Google" />
          </div>
          <p className="p-2 mt-4 bg-[#F4F4F5] text-red-500 border-none rounded-md font-mono items-center text-center ">
            <Link to="/signup">Don't have an account ? Sign Up</Link>
          </p>
        </div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </form>
    </section>
  );
}

export default SignIn;
