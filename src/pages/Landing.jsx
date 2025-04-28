import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Footer from "../components/Footer/Footer";
import Contact from "./Contact";
import { useViewTransition } from "../utils/useViewTranstion.js";
import AOS from "aos";

function Landing() {
  const transtionNavigate = useViewTransition();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <div className="landing_page">
        <nav className="fixed backdrop-blur-md bg-opacinty-30 z-10 bg-white/45 w-full border-white border shadow-sm h-16 py-2 px-3 ">
          <div className="flex justify-between items-center text-center">
            <Logo />
            <ul className="flex space-x-3 text-lg">
              <li>
                <button
                  onClick={() => transtionNavigate("/signin")}
                  className="bg-black border text-lg text-white rounded-xl px-2 py-1 shadow-sm"
                >
                  Sign in
                </button>
              </li>
              <li>
                <button
                  onClick={() => transtionNavigate("/signup")}
                  className="py-1 px-2 border bg-white rounded-xl text-lg shadow-sm"
                >
                  Sign up
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="pt-32 flex flex-col justify-center items-center">
          <p className="border-none rounded-3xl text-[#717985] px-10 py-2 font-mono text-[1rem] font-bold bg-[#EEEFEF]">
            Make Resume in Minutes
          </p>
          <section className="text-center max-w-4xl">
            <h1
              data-aos="zoom-in-up"
              className="sm:text-7xl text-6xl font-bold mt-5 mb-4"
            >
              Resume On Demand,
            </h1>
            <h3
              data-aos="zoom-in"
              className="sm:text-8xl text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#364050] via-[#171F2E] to-[#6b90cf] "
            >
              For Free.
            </h3>
            <p className="mt-6 text-gray-500 sm:text-wrap sm:text-xl text-md mx-24">
              Ready to make an impact? Start building your resume today and take
              the first step toward your career goals!
            </p>
            <button
              onClick={() => transtionNavigate("/select_template")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-100 hover:-translate-y-0 hover:scale-110 border px-4 mx-2 mt-5 bg-black py-2 text-white text-xl rounded-full"
            >
              Make resume
              <i className="ml-3 text-sm fa-solid fa-arrow-right"></i>
            </button>
            <button
              onClick={() => transtionNavigate("/about")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-100 hover:-translate-y-0 hover:scale-110 border px-4 mx-2 bg-white rounded-full py-2 text-xl"
            >
              About Us
              <i className="ml-3 text-[0.9rem] fa-solid fa-circle-up"></i>
            </button>
            <ul className="flex gap-10 justify-center mt-9 text-[#757D88]">
              <li>
                <i className="mr-2 fa-regular fa-circle-check"></i>
                100% Free
              </li>
              <li>
                <i className="mr-2 fa-solid fa-filter"></i>
                Different Templates
              </li>
              <li>
                <i className="mr-2 fa-solid fa-user-tie"></i>
                Professional Resumes
              </li>
            </ul>
          </section>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-3 justify-center items-center gap-6 text-center mt-36 mb-28">
          <div>
            <i className="fa-regular fa-handshake text-8xl mb-2 mt-3 text-[#10141F]"></i>
            <p className="text-4xl font-bold">Feels Easy</p>
          </div>
          <div>
            <i className="fa-solid fa-lock text-8xl mb-2 mt-3 text-[#10141F]"></i>
            <p className="text-4xl font-bold">Privacy & Security</p>
          </div>
          <div>
            <i className="fa-solid fa-file text-8xl mb-2 mt-3 text-[#10141F]"></i>
            <p className="text-4xl font-bold">ATS Friendly</p>
          </div>
        </section>
        <section className="bg-[#10141F] rounded-t-[4rem] text-white py-10">
          <div className="grid sm:grid-cols-2">
            <div className="1ST_DIV">
              <div className="mx-4 mb-11 py-3">
                <h1 className="mt-28 text-6xl font-bold">Less Stress</h1>
                <p className="max-w-lg mt-2">
                  No need to worry about layout, formatting, or readability—we
                  handle all of that for you.
                </p>
              </div>
              <div
                data-aos="fade-up"
                className="mt-6 border-gray-700 border bg-[#1C2029] mx-3 rounded-3xl p-5 hover:bg-[#2d323c]"
              >
                <i className="ri-seo-fill text-4xl"></i>
                <h1 className="font-bold mt-2 text-xl">Select a Template</h1>
                <p>
                  Pick from professionally-designed templates tailored to make
                  your resume stand out.
                </p>
              </div>

              <div
                data-aos="fade-up"
                className="mt-6 border-gray-700 border bg-[#1C2029] mx-3 rounded-3xl p-5 hover:bg-[#2d323c] "
              >
                <i class="ri-bard-fill text-4xl"></i>
                <h1 className="font-bold mt-2 text-xl">
                  Customize Your Content
                </h1>
                <p>
                  Fill in your details, skills, and experiences. Add, remove, or
                  reorder sections effortlessly.
                </p>
              </div>
              <div
                data-aos="fade-up"
                className="mt-6 border-gray-700 border bg-[#1C2029] mx-3 rounded-3xl p-5 hover:bg-[#2d323c] "
              >
                <i class="ri-download-line text-4xl"></i>
                <h1 className="font-bold mt-2 text-xl">Download and Share</h1>
                <p>
                  Save, download, or share your resume directly. Perfectly
                  formatted, every time.
                </p>
              </div>
            </div>
            <div data-aos="fade-up" className="2ND_DIV mt-10">
              <div className="mt-6 border-gray-700 border bg-[#1C2029] mx-4 rounded-3xl p-8 hover:bg-[#2d323c] ">
                <i className="ri-color-filter-line text-5xl"></i>
                <h1 className="font-bold mt-2 text-xl">More Effective</h1>
                <p>
                  Access industry-approved templates and formats that have been
                  tried and tested.
                </p>
                <Link to={"/signup"}>
                  <button className="py-4 px-8 bg-white mt-5  text-black font-mono rounded-full text-xl shadow-md  shadow-gray-400">
                    Sign Up<i className="ri-arrow-right-line ml-2"></i>
                  </button>
                </Link>
              </div>
              <div className="mt-6 border-gray-700 border bg-[#1C2029] mx-4 rounded-3xl p-8 hover:bg-[#2d323c] ">
                <i className="ri-questionnaire-line text-5xl"></i>
                <h1 className="font-bold mt-2 text-xl">Have Questions?</h1>
                <p>
                  Our team is here to help you make the most of your
                  resume-building experience. Reach out to us anytime.
                </p>

                <button className="py-4 flex px-8 bg-white mt-5  text-black font-mono rounded-full text-xl shadow-md  shadow-gray-400">
                  <Contact />
                  <i className="ri-contacts-line ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Landing;
