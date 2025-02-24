import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import GoogleAuth from "../auth/GoogleAuth";
import Navigation from "./Navigation";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [isHidden,setIsHidden] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Account created successfully!");
      navigate("/select_template");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <section>
      <Navigation />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center min-h-screen p-5"
      >
        <div className="border border-gray-200 rounded-3xl p-10 mt-24">
          <div className="flex justify-center text-5xl ">
            <i className="ri-attachment-2"></i>
          </div>
          <h1 className="text-xl font-bold mb-4 text-center">Sign Up With Resumate</h1>
          <div className="block">
            <input
              {...register("email", { required: "Email is required" })}
              className="block py-2 border-slate-200 shadow-sm mb-2 rounded-md w-full focus:border-black focus:ring-0 focus:outline-none"
              type="email"
              placeholder="Enter Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              {...register("password", { required: "Password is required" })}
              className="block py-2 border-slate-200 shadow-sm rounded-md w-full focus:border-black focus:ring-0 focus:outline-none"
              type="password"
              placeholder="Enter Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <div className="relative">
            <input
            type={isHidden ? "password" : "text"}
            className="mt-2 block py-2 border-slate-200 shadow-sm rounded-md w-full focus:border-black focus:ring-0 focus:outline-none"
              {...register("confirmPassword", {
                required: "Please Confirm Your Password",

                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              placeholder="Confirm Password"
            />
            <button onClick={() => setIsHidden(!isHidden)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{isHidden ? <i className="ri-eye-off-line"></i> : <i class="ri-eye-line"></i>}</button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
            
            <button
              type="submit"
              className="block bg-black text-white w-full py-2 rounded-md mt-3 text-md"
              disabled={loading}
            >
              {loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                "Continue Sign Up"
              )}
            </button>
            <div className="bg-gray-300 h-[0.2px] mt-4 w-full"></div>
            <GoogleAuth name="Sign up with Google" />
          </div>
          <p className="mt-4 font-mono p-2 bg-[#F4F4F5] text-red-500 border-none rounded-md items-center text-center">
            <Link to="/signin">Already have an account? Sign In</Link>
          </p>
          <Toaster position="bottom-center" reverseOrder={false} />
        </div>
      </form>
    </section>
  );
}

export default SignUp;
