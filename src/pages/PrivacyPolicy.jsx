import { useEffect } from "react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import Navigation from "../components/Navbar/Navigation.jsx";
import Footer from "../components/Footer/Footer";

function PrivacyPolicy() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | ResuMate</title>
        <meta
          name="description"
          content="Learn how ResuMate handles your data and protects your privacy."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navigation />
        
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 
            data-aos="fade-up"
            className="text-4xl sm:text-6xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-l from-[#364050] via-[#171F2E] to-[#6b90cf]"
          >
            Privacy Policy
          </h1>
          
          <p className="text-gray-500 text-center mb-12 text-lg">
            Last Updated: January 12, 2026
          </p>

          <div className="space-y-8 text-gray-700">
            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to ResuMate. We are committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we 
                collect, use, and safeguard your data when you use our resume building service.
              </p>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">2. Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#364050]">2.1 Personal Information</h3>
                <p className="leading-relaxed">
                  When you create an account or build a resume, we collect information such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information</li>
                  <li>Email address (via Google Firebase Authentication)</li>
                  <li>Education and work experience details</li>
                  <li>Skills, projects, and other resume-related information</li>
                  <li>Account credentials (securely managed by Google Firebase)</li>
                </ul>
              </div>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">3. How We Use Your Information</h2>
              <p className="leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our resume building service</li>
                <li>Authenticate users via Google Firebase Authentication</li>
                <li>Generate and customize your resume templates</li>
                <li>Improve and optimize our service features</li>
                <li>Communicate with you about updates and features</li>
              </ul>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">4. Data Sharing and Third-Party Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#364050] mb-2">4.1 Google Firebase Authentication</h3>
                  <p className="leading-relaxed">
                    We use Google Firebase for user authentication. When you sign in, your credentials 
                    are processed and stored by Google Firebase according to their privacy policy. 
                    Firebase helps us securely manage user accounts and authentication.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#364050] mb-2">4.2 Google Gemini API (Resume Review Feature)</h3>
                  <p className="leading-relaxed">
                    Our resume review feature uses the Google Gemini API to provide AI-powered feedback 
                    on your resume. When you use this feature, your resume content is temporarily sent 
                    to Google's Gemini API for analysis. This is the only instance where your resume 
                    data is shared with a third-party service.
                  </p>
                  <p className="leading-relaxed mt-2 font-semibold text-[#171F2E]">
                    Important: Your resume content is only shared with Gemini API when you explicitly 
                    use the resume review feature. The data is processed by Google according to their 
                    privacy policy and terms of service.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#364050] mb-2">4.3 No Other Data Sharing</h3>
                  <p className="leading-relaxed">
                    Apart from the services mentioned above (Firebase Authentication and Gemini API for 
                    resume review), we do not share, sell, or transfer your personal information to any 
                    other third parties.
                  </p>
                </div>
              </div>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">5. Data Storage and Security</h2>
              <p className="leading-relaxed">
                Your resume data is stored securely using industry-standard practices. We implement 
                appropriate technical and organizational measures to protect your information from 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure authentication through Google Firebase</li>
                <li>Encrypted data transmission (HTTPS)</li>
                <li>Regular security updates and monitoring</li>
                <li>Access controls and authentication requirements</li>
              </ul>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">6. Your Rights and Choices</h2>
              <p className="leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and download your resume data at any time</li>
                <li>Edit or delete your resume information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of using the resume review feature</li>
                <li>Request information about what data we store</li>
              </ul>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">7. Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use essential cookies to maintain your session and provide basic functionality. 
                We do not use third-party tracking cookies or analytics that compromise your privacy.
              </p>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">8. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our service is not intended for users under the age of 13. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">9. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by posting the new policy on this page and updating the 
                "Last Updated" date at the top.
              </p>
            </section>

            <section data-aos="fade-up" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#171F2E]">10. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or how we handle 
                your data, please contact us at:
              </p>
              <div className="bg-[#EEEFEF] p-6 rounded-lg mt-4">
                <p className="font-semibold text-[#171F2E]">Email:</p>
                <a 
                  href="mailto:tushargsoni17@gmail.com" 
                  className="text-[#6b90cf] hover:underline"
                >
                  tushargsoni17@gmail.com
                </a>
              </div>
            </section>

            <section data-aos="fade-up" className="bg-[#EEEFEF] p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold text-[#171F2E] mb-3">Summary</h3>
              <p className="leading-relaxed text-[#364050]">
                ResuMate respects your privacy. Your data is only shared with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-[#364050]">
                <li><strong>Google Firebase</strong> - for secure authentication</li>
                <li><strong>Google Gemini API</strong> - only when you use the resume review feature</li>
              </ul>
              <p className="leading-relaxed text-[#364050] mt-3">
                We do not sell or share your information with any other third parties.
              </p>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default PrivacyPolicy;
