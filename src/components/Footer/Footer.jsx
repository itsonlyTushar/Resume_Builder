import React, { useState } from "react";
import Logo from '../../pages/Logo'
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Contact from "../../pages/Contact";
import { useViewTransition } from "../../utils/useViewTranstion";

function Footer() {
  const [clicked, setClicked] = useState(false);
  const transtionNavigate = useViewTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleClick = () => {
    if (!errors.email) {
      setClicked(true);
      toast.success("thanks for subscribing to our newsletter!");
      setTimeout(() => {
        setClicked(false);
      }, 1000);
    } else {
      toast.error(errors.email.message);
    }
  };
  return (
    <>
      <Toaster />
      <footer className="bg-black text-white py-14 grid sm:grid-cols-3 gap-28 ">
        <div className="mx-4">
          <Logo />
          <h1 className="text-4xl font-bold mb-3 mt-6">Stay Updated</h1>
          <p className="mb-4 text-[#858B96]">
            Get updates on new features and improvements
          </p>
          <form onSubmit={handleSubmit(handleClick)}>
            <div className="sm:flex">
              <input
                type="email"
                className="rounded-full px-4 py-2 bg-transparent text-white outline-none"
                placeholder="Enter email..."
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email",
                  },
                })}
              />

              <button
                type="submit"
                className="ml-4 rounded-full flex p-4 mt-4 bg-gradient-to-r from-[#865f28] via-[#575f1c] to-[#736138] "
                disabled={!!errors.email}
              >
                {clicked && <i className="ri-loader-line spin"></i>}
                Subscribe
              </button>
            </div>
            {errors.email && (
              <p>
                <i className="ri-error-warning-line"></i> Enter email to
                subscribe
              </p>
            )}
          </form>
        </div>
        <div className="ml-3 text-center">
          <ul>
            <li className="font-bold text-lg">Company</li>
            <div className="text-[#858B96] cursor-pointer hover:text-[#c7cdd9] transition-all ease-in-out hover:transition-all">
              <li className="my-3 hover:text-[#858B96]">
                <a href="mailto=tushargsoni17@gmail.com">Email</a>
              </li>
              <li className="my-3 hover:text-[#858B96]">
                <Contact />
              </li>
              <li className="my-3 hover:text-[#858B96]">
                <button onClick={() => transtionNavigate('/about')} >About Us</button>
              </li>
            </div>
          </ul>
        </div>
        <div className="ml-3 text-center">
          <ul>
            <li className="font-bold text-lg">Socials</li>
            <div className="text-[#858B96]">
              <li className="my-3">
                <i className="fa-brands fa-x-twitter mr-2 "></i>
                <a href="https://x.com/ts28_7">Twitter</a>
              </li>
              <li className="my-3">
                <i className="fa-brands fa-instagram mr-2"></i>
                <a href="https://www.instagram.com/tushar_28.7">Instagram</a>
              </li>
              <li>
                <i className="fa-brands fa-linkedin mr-2"></i>
                <a href="https://www.linkedin.com/in/tushar-soni-b0426022b/">
                  Linkedin
                </a>
              </li>
            </div>
          </ul>
        </div>
      </footer>
    </>
  );
}

export default Footer;
