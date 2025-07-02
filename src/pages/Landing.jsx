import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Contact from "./Contact";
import { useViewTransition } from "../utils/useViewTranstion.js";
import AOS from "aos";
import Navigation from "../components/Navbar/Navigation.jsx";
import laptop from "../assets/laptop.png";
import CardSwap, { Card } from "../components/CardSwap/CardSwap.jsx";
import { templateImgs } from "../components/Templates/templateConfig.js";
import { Helmet } from "react-helmet";
import Fabscroll from "../components/UI/Fab.jsx";

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
      <Helmet>
      
        <title>
          ResuMate | Resume Builder - Make Your Resume in Minutes
        </title>
        <meta
          name="description"
          content="Create professional, ATS-friendly resumes for free with ResuMate. Choose from industry-approved templates and build your resume in minutes."
        />
        <meta
          name="keywords"
          content="resume builder, free resume, ATS resume, professional resume, online resume, resume templates, career, job application"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="ResuMate | Free Resume Builder" />
        <meta
          property="og:description"
          content="Build your resume for free with ResuMate. Choose templates, customize, and download instantly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resumate.shop" />
        <meta
          property="og:image"
          content="https://resumate.shop/og-img.png"
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="https://resumate.shop/og-img.png" />
        <meta name="twitter:title" content="ResuMate | Free Resume Builder" />
        <meta
          name="twitter:description"
          content="Create professional, ATS-friendly resumes for free in minutes with ResuMate."
        />
        <meta
          name="twitter:image"
          content="https://resumate.shop/og-img.png"
        />
        <meta name="twitter:url" content="https://resumate.shop" />

      </Helmet>

      <div className="landing_page">
        <Navigation />
        <div className="pt-32 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
          <p className="border-none rounded-3xl text-[#717985] px-6 py-2 font-mono text-sm sm:text-base font-bold bg-[#EEEFEF]">
            Make Resume in Minutes
          </p>
          <section className="text-center max-w-4xl">
            <h1
              data-aos="zoom-in-up"
              className="text-4xl sm:text-6xl font-bold mt-5 mb-4"
            >
              Resume On Demand,
            </h1>
            <h3
              data-aos="zoom-in"
              className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#364050] via-[#171F2E] to-[#6b90cf]"
            >
              For Free.
            </h3>
            <p className="mt-6 text-gray-500 text-base sm:text-lg mx-auto max-w-xl">
              Ready to make an impact? Start building your resume today and take
              the first step toward your career goals!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                onClick={() => transtionNavigate("/select_template")}
                className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-100 hover:-translate-y-0 hover:scale-105 border px-6 py-2 bg-black text-white text-base sm:text-lg rounded-full"
              >
                Make Resume
                <i className="ml-3 text-sm fa-solid fa-arrow-right"></i>
              </button>
              <button
                onClick={() => transtionNavigate("/about")}
                className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-100 hover:-translate-y-0 hover:scale-105 border px-6 py-2 bg-white text-black text-base sm:text-lg rounded-full"
              >
                About Us
                <i className="ml-3 text-sm fa-solid fa-circle-up"></i>
              </button>
            </div>
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center items-center mt-9 text-[#757D88] text-center">
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

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center mt-24 mb-28 px-4 sm:px-6 lg:px-8">
          <div>
            <i className="fa-regular fa-handshake text-6xl sm:text-8xl mb-2 mt-3 text-[#10141F]"></i>
            <p className="text-2xl sm:text-4xl font-bold">Feels Easy</p>
          </div>
          <div>
            <i className="fa-solid fa-lock text-6xl sm:text-8xl mb-2 mt-3 text-[#10141F]"></i>
            <p className="text-2xl sm:text-4xl font-bold">Privacy & Security</p>
          </div>
          <div>
            <i className="fa-solid fa-file text-6xl sm:text-8xl mb-2 mt-3 text-[#10141F]"></i>
            <p className="text-2xl sm:text-4xl font-bold">ATS Friendly</p>
          </div>
        </section>

        <section className="bg-[#10141F] rounded-t-3xl text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <div className="mb-11 py-3">
                <h1 className="mt-10 sm:mt-28 text-4xl sm:text-6xl font-bold">
                  Less Stress
                </h1>
                <p className="max-w-lg mt-2 text-base sm:text-lg">
                  No need to worry about layout, formatting, or readability—we
                  handle all of that for you.
                </p>
              </div>

              <div
                data-aos="fade-up"
                className="shadow-lg shadow-white/5 mt-6 border-gray-700 border bg-[#1C2029] rounded-3xl p-5 hover:bg-[#2d323c]"
              >
                <i className="ri-seo-fill text-3xl sm:text-4xl"></i>
                <h1 className="font-bold mt-2 text-lg sm:text-xl">
                  Select a Template
                </h1>
                <p className="text-sm sm:text-base">
                  Pick from professionally-designed templates tailored to make
                  your resume stand out.
                </p>
              </div>

              <div
                data-aos="fade-up"
                className="shadow-lg shadow-white/5 mt-6 border-gray-700 border bg-[#1C2029] rounded-3xl p-5 hover:bg-[#2d323c]"
              >
                <i className="ri-bard-fill text-3xl sm:text-4xl"></i>
                <h1 className="font-bold mt-2 text-lg sm:text-xl">
                  Customize Your Content
                </h1>
                <p className="text-sm sm:text-base">
                  Fill in your details, skills, and experiences.
                </p>
              </div>

              <div
                data-aos="fade-up"
                className="shadow-lg shadow-white/5 mt-6 border-gray-700 border bg-[#1C2029] rounded-3xl p-5 hover:bg-[#2d323c]"
              >
                <i className="ri-download-line text-3xl sm:text-4xl"></i>
                <h1 className="font-bold mt-2 text-lg sm:text-xl">
                  Download and Share
                </h1>
                <p className="text-sm sm:text-base">
                  Save, download, or share your resume directly. Perfectly
                  formatted, every time.
                </p>
              </div>
            </div>

            <div data-aos="fade-up">
              <div className="border-gray-700 border bg-[#1C2029] rounded-3xl p-6 sm:p-8 hover:bg-[#2d323c]">
                <i className="ri-color-filter-line text-3xl sm:text-5xl"></i>
                <h1 className="font-bold mt-2 text-lg sm:text-xl">
                  More Effective
                </h1>
                <p className="text-sm sm:text-base">
                  Access industry-approved templates and formats that have been
                  tried and tested.
                </p>
                <Link to="/signup">
                  <button className="w-full sm:w-auto py-3 px-6 bg-white mt-5 text-black font-mono rounded-full text-base sm:text-xl shadow-md shadow-gray-400">
                    Sign Up <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                </Link>
              </div>

              <div className="mt-6 border-gray-700 border bg-[#1C2029] rounded-3xl p-6 sm:p-8 hover:bg-[#2d323c]">
                <i className="ri-questionnaire-line text-3xl sm:text-5xl"></i>
                <h1 className="font-bold mt-2 text-lg sm:text-xl">
                  Have Questions?
                </h1>
                <p className="text-sm sm:text-base">
                  Our team is here to help you make the most of your
                  resume-building experience. Reach out to us anytime.
                </p>

                <button className="w-full sm:w-auto py-3 px-6 bg-white mt-5 text-black font-mono rounded-full text-base sm:text-xl shadow-md shadow-gray-400 flex items-center justify-center">
                  <Contact />
                  <i className="ri-contacts-line ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 grid grid-cols-1 sm:grid-cols-2 place-items-center py-36">
          <div data-aos="fade-up">
            <img src={laptop} alt="laptop" />
          </div>

          <div data-aos="fade-up" className="p-10 max-w-2xl">
            <h1 className="text-5xl font-semibold py-2">
              Customize any template to suit your needs
            </h1>
          </div>
        </section>

        {/* Cardswap compoenenet  */}
        <section className="bg-[#10141F] rounded-t-3xl grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 place-items-center content-center py-36 overflow-hidden">
          <div data-aos="fade-up" className="p-10 max-w-2xl">
            <h1 className="text-5xl text-white font-semibold py-2">
              Browse Unique Templates to Stand Out
            </h1>
            <p className="text-gray-400 text-sm">
              ResuMate offers a range of professionally designed templates so
              you can make the right first impression—no matter your industry or
              experience level.
            </p>
          </div>

          <div
            className="card-img"
            style={{ height: "500px", position: "relative" }}
          >
            <CardSwap
              skewAmount={1}
              cardDistance={70}
              verticalDistance={15}
              delay={2000}
              pauseOnHover={false}
            >
              {templateImgs.slice(0, 10).map((img) => (
                <Card key={img.id} className="border-none">
                  <img className="rounded-xl" src={img.image} alt={img.id} />
                </Card>
              ))}
            </CardSwap>
          </div>
        </section>

        <Fabscroll />

        <Footer />
      </div>
    </>
  );
}

export default Landing;
