import { useEffect } from "react";
import Footer from "../components/Footer/Footer";
import FabScroll from "../components/UI/Fab";
import AOS from "aos";
import Navigation from "../components/Navbar/Navigation";
import { Link } from "react-router-dom";

function Terms() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <Navigation />
      <div className="pt-20">
        <h1 className="text-5xl text-center mb-10 font-bold py-4">Terms of Use</h1>
        
        {/* Header section */}
        <section
          data-aos="fade-up"
          className="flex text-center justify-center items-center px-16 mx-4 bg-gray-100 py-16 rounded-3xl mb-10"
        >
          <div className="max-w-4xl px-4 rounded-2xl">
            <h1 className="sm:text-4xl text-3xl font-semibold mb-6">
              📄 Terms of Use – ResuMate
            </h1>
            <div className="text-lg text-gray-700 space-y-2">
              <p><strong>Effective Date:</strong> July 1, 2025</p>
              <p><strong>Owner:</strong> Tushar Soni</p>
              <p><strong>Project:</strong> ResuMate – Professional Resume Builder</p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          
          {/* Section 1 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              By accessing or using <strong>ResuMate</strong>, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the application.
            </p>
          </div>

          {/* Section 2 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
              Usage Eligibility
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              You must be at least 13 years old to use ResuMate. By using the service, you confirm that you meet this requirement.
            </p>
          </div>

          {/* Section 3 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
              Your Responsibilities
            </h2>
            <ul className="text-lg text-gray-700 leading-relaxed space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                You are responsible for the accuracy of the information you input into the resume builder.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                You agree not to use ResuMate for any illegal or unauthorized purposes.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                You must not attempt to gain unauthorized access to other user accounts or data.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
              User Accounts
            </h2>
            <ul className="text-lg text-gray-700 leading-relaxed space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                ResuMate uses <strong className="mx-2"> Firebase Authentication </strong>  to manage user accounts securely.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                You are responsible for maintaining the confidentiality of your login credentials.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
              Data & Privacy
            </h2>
            <ul className="text-lg text-gray-700 leading-relaxed space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                ResuMate stores user data via <strong className="mx-2">Appwrite</strong>.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                No personal data is sold or shared with third parties.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
              PDF and Resume Content
            </h2>
            <ul className="text-lg text-gray-700 leading-relaxed space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                ResuMate provides multiple resume templates for personal use only.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                You may export resumes as PDF files using jsPDF and use them for job applications.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                You may not resell or redistribute the templates or design elements without permission.
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
              Intellectual Property
            </h2>
            <ul className="text-lg text-gray-700 leading-relaxed space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                All code, UI elements, branding, and original templates belong to <strong className="mx-2">Soni Tushar Ganesh</strong> unless otherwise stated.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Unauthorized copying, distribution, or modification is strictly prohibited.
              </li>
            </ul>
          </div>

          {/* Section 8 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
              Limitation of Liability
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed space-y-3">
              <p className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                ResuMate is provided "as is" without warranties of any kind.
              </p>
              <p>While we strive to keep the platform stable and secure, we are not liable for:</p>
              <ul className="ml-6 space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">◦</span>
                  Data loss
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">◦</span>
                  PDF generation errors
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">◦</span>
                  Downtime or outages
                </li>
              </ul>
            </div>
          </div>

          {/* Section 9 */}
          <div data-aos="fade-up" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
              Modifications to the Terms
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We reserve the right to update these Terms of Use at any time. Continued use of the platform after any change constitutes your acceptance of the new terms.
            </p>
          </div>

          {/* Section 10 - Contact */}
          <div data-aos="fade-up" className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-2 border-red-100">
            <h2 className="text-2xl font-bold mb-4 text-blackBg flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
              Contact
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about these terms, feel free to reach out:
            </p>
            <div className="space-y-3">
              <p className="flex items-center text-lg">
                <span className="text-xl mr-3"><i className="ri-mail-unread-line"></i></span>
                <strong>Email:</strong> 
                <Link to="mailto:ts281102@gmail.com" className="text-red-600 hover:text-red-800 ml-2 underline">
                  tushargsoni17@gmail.com
                </Link>
              </p>
              <p className="flex items-center text-lg">
                <span className="text-xl mr-3"><i className="ri-user-4-line"></i></span>
                <strong>Portfolio:</strong> 
                <Link to="https://portfolio-site-six-navy.vercel.app/" target="_blank" className="text-red-600 hover:text-red-800 ml-2 underline">
                  Personal Website
                </Link>
              </p>
              <p className="flex items-center text-lg">
                <span className="text-xl mr-3"><i className=" ri-linkedin-line"></i></span>
                <strong>LinkedIn:</strong> 
                <Link to="https://www.linkedin.com/in/tushar-soni-b0426022b/" className="text-red-600 hover:text-red-800 ml-2 underline">
                  linkedin.com/in/tushar-soni-b0426022b
                </Link>
              </p>
            </div>
          </div>

          {/* Back to top notice */}
          <div data-aos="fade-up" className="text-center bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-600 text-lg">
              Thank you for using <strong className="text-blackBg">ResuMate</strong>! 
              We're committed to helping you build professional resumes with ease and security.
            </p>
          </div>

        </div>
      </div>
      <FabScroll />
      <Footer />
    </>
  );
}

export default Terms;