import { useState } from "react";
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

  const onSubmit = () => {
    setClicked(true);
    toast.success("Thanks for subscribing to our newsletter!");
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  return (
    <>
      <Toaster />
      <footer className="bg-gradient-to-b from-[#0B0F19] to-[#04060B] text-white pt-16 pb-16 border-t border-zinc-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

            {/* Column 1: Brand details (Takes 5 columns) */}
            <div className="md:col-span-5 space-y-4">
              <Logo />
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Create professional, standout resumes in minutes. ResuMate handles formatting and styling to showcase your unique career journey.
              </p>
            </div>

            {/* Column 2: Company links (Takes 2 columns) */}
            <div className="md:col-span-2 md:mt-2">
              <ul className="space-y-3">
                <li className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Company</li>
                <li>
                  <a
                    href="mailto:tushargsoni17@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-2 inline-flex transition-colors duration-200"
                  >
                    <i className="ri-mail-line text-zinc-500"></i> Email Us
                  </a>
                </li>
                <li className="text-zinc-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors duration-200">
                  <i className="ri-contacts-line text-zinc-500"></i> <Contact />
                </li>
                <li>
                  <button
                    onClick={() => transtionNavigate('/about')}
                    className="text-zinc-400 hover:text-white flex items-center gap-2 text-left w-full transition-colors duration-200"
                  >
                    <i className="ri-user-line text-zinc-500"></i> About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal links (Takes 2 columns) */}
            <div className="md:col-span-2 md:mt-2">
              <ul className="space-y-3">
                <li className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Legal</li>
                <li>
                  <button
                    onClick={() => transtionNavigate('/privacy')}
                    className="text-zinc-400 hover:text-white flex items-center gap-2 text-left w-full transition-colors duration-200"
                  >
                    <i className="ri-shield-keyhole-line text-zinc-500"></i> Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => transtionNavigate('/terms')}
                    className="text-zinc-400 hover:text-white flex items-center gap-2 text-left w-full transition-colors duration-200"
                  >
                    <i className="ri-file-text-line text-zinc-500"></i> Terms of Use
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Socials (Takes 3 columns) */}
            <div className="md:col-span-3 md:mt-2">
              <ul className="space-y-3">
                <li className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Connect</li>
                <li>
                  <a
                    href="https://x.com/ts28_7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-2 inline-flex transition-colors duration-200"
                  >
                    <i className="fa-brands fa-x-twitter text-zinc-500"></i> Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/tushar_28.7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-2 inline-flex transition-colors duration-200"
                  >
                    <i className="fa-brands fa-instagram text-[#E1306C]"></i> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/tushar-soni-b0426022b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-2 inline-flex transition-colors duration-200"
                  >
                    <i className="fa-brands fa-linkedin"></i> LinkedIn
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
