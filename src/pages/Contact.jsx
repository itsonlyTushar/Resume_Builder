import React, { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import toast, { Toaster } from "react-hot-toast";
import { Box, Button, Modal } from "@mui/material";
import Logo from "./Logo";
import { auth } from "../auth/firebase";


const Contact = () => {
  const [open, setopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleOpen = () => setopen(true);
  const handleClose = () => setopen(false);

  const template_params = {
    email,
    name,
    subject,
    description,
  };

  const handleSendMail = () => {
    setLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        template_params,
        import.meta.evn.VITE_EMAILJS_PUBLIC_KEYS
      )
      .then((response) => {
        setLoading(false);
        setSubject("");
        setDescription("");
        toast.success("Mail sent...");
        setTimeout(() => {
          handleClose();
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Erros try again later");
      });
  };

  return (
    <>
      <div onClick={handleOpen}>Contact Us</div>

      <Modal open={open} onClose={handleClose}>
    
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 5,
          }}
        >
          {/* Conctact form  */}
          <form onSubmit={handleSubmit(handleSendMail)}>
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="text-md text-center">
              Send us email, we'll reach out!
            </h1>
            <label className="block mb-2 text-md mt-5" htmlFor="name">
              Your Name
            </label>
            <input
              className="outline-none w-full border rounded-xl p-3"
              placeholder="Enter Name..."
              type="text"
              {...register("name", {
                required: true,
                onChange: (e) => setName(e.target.value),
              })}
            />
            {errors.name && (
              <span className="text-red-600 text-md ml-2">
            
                <i className="ri-error-warning-line"></i>Enter Name
              </span>
            )}
            <label className="block mb-2 text-md" htmlFor="subject">
              Subject
            </label>
            <input
              className="outline-none w-full border rounded-xl p-3"
              placeholder="Subject..."
              type="text"
              {...register("subject", {
                required: true,
                onChange: (e) => setSubject(e.target.value),
              })}
            />
            {errors.subject && (
              <span className="text-red-600 text-md ml-2">
        
                <i className="ri-error-warning-line"></i>Enter Subject
              </span>
            )}

<label className="block mb-2 text-md" htmlFor="subject">
              Email
            </label>
            <input
              className="outline-none w-full border rounded-xl p-3"
              placeholder="Enter email..."
              type="text"
              {...register("email", {
                required: true,
                onChange: (e) => setEmail(e.target.value),
              })}
            />
            {errors.email && (
              <span className="text-red-600 text-md ml-2">
        
                <i className="ri-error-warning-line"></i>Enter email
              </span>
            )}

            <label className="block mt-2 mb-1 text-md " htmlFor="description">
              Description
            </label>
            <textarea
              className="outline-none w-full border rounded-xl p-3"
              placeholder="Write here..."
              name="description"
              id="descri-id"
              {...register("description", {
                required: true,
                onChange: (e) => setDescription(e.target.value),
              })}
            />
            {errors.description && (
              <span className="text-red-600 text-md ml-2">
                <i className="ri-error-warning-line"></i>Enter Description
              </span>
            )}
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                sx={{
                  bgcolor: "black",
                  borderRadius: 2,
                  color: "white",
                  width: "700px",
                }}
              >
                {loading ? (
                  <i className="ri-loader-line spin"></i>
                ) : (
                  <i className="ri-telegram-2-line mr-2 text-xl"></i>
                )}
                Mail
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Contact;
