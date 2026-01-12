import { useEffect } from "react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import Navigation from "../components/Navbar/Navigation.jsx";
import Footer from "../components/Footer/Footer";

function TermsOfUse() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Use | ResuMate</title>
        <meta
          name="description"
          content="Read the terms and conditions for using ResuMate's resume building service."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="relative">
          <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1
              data-aos="fade-up"
              className="text-4xl sm:text-6xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-l from-[#364050] via-[#171F2E] to-[#6b90cf]"
            >
              Terms of Use
            </h1>

            <p className="text-gray-500 text-center mb-12 text-lg">
              Last Updated: January 12, 2026
            </p>

            <div className="space-y-8 text-gray-700">
              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  1. Acceptance of Terms
                </h2>
                <p className="leading-relaxed">
                  Welcome to ResuMate. By accessing or using our resume building
                  service, you agree to be bound by these Terms of Use. If you
                  do not agree to these terms, please do not use our service.
                </p>
                <p className="leading-relaxed">
                  These terms constitute a legally binding agreement between you
                  and ResuMate. We reserve the right to modify these terms at
                  any time, and continued use of the service after changes
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  2. Service Description
                </h2>
                <p className="leading-relaxed">
                  ResuMate provides a free, online resume building platform that
                  allows users to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create professional resumes using various templates</li>
                  <li>Store and manage resume information securely</li>
                  <li>Customize and edit resume content</li>
                  <li>Download resumes in various formats</li>
                  <li>
                    Receive AI-powered resume feedback (via Google Gemini API)
                  </li>
                  <li>
                    Access the service through Google Firebase authentication
                  </li>
                </ul>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  3. User Accounts and Authentication
                </h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#364050]">
                    3.1 Account Creation
                  </h3>
                  <p className="leading-relaxed">
                    To use ResuMate, you must create an account using Google
                    Firebase Authentication. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>
                      Be responsible for all activities under your account
                    </li>
                    <li>Notify us immediately of any unauthorized access</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    3.2 Account Eligibility
                  </h3>
                  <p className="leading-relaxed">
                    You must be at least 13 years old to use ResuMate. By
                    creating an account, you represent that you meet this age
                    requirement.
                  </p>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  4. User Content and Ownership
                </h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#364050]">
                    4.1 Your Content
                  </h3>
                  <p className="leading-relaxed">
                    You retain full ownership of all content you create and
                    upload to ResuMate, including your resume information,
                    personal details, and any other data you provide.
                  </p>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    4.2 License to Use Your Content
                  </h3>
                  <p className="leading-relaxed">
                    By using our service, you grant ResuMate a limited,
                    non-exclusive license to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Store and process your resume data to provide the service
                    </li>
                    <li>
                      Send your resume to Google Gemini API when you use the
                      review feature
                    </li>
                    <li>
                      Display your content within the application for resume
                      generation
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    4.3 Content Responsibility
                  </h3>
                  <p className="leading-relaxed">
                    You are solely responsible for the accuracy and legality of
                    the content you submit. You agree not to include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>False, misleading, or fraudulent information</li>
                    <li>Content that violates any law or regulation</li>
                    <li>
                      Copyrighted material that you do not have rights to use
                    </li>
                    <li>Harmful, offensive, or inappropriate content</li>
                  </ul>
                </div>
              </section>

              <section id="thirdparty" data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  5. Third-Party Services
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#364050] mb-2">
                      5.1 Google Firebase Authentication
                    </h3>
                    <p className="leading-relaxed">
                      Our service uses Google Firebase for user authentication.
                      By using ResuMate, you also agree to Google's Terms of
                      Service and Privacy Policy as they relate to Firebase
                      authentication.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#364050] mb-2">
                      5.2 Google Gemini API
                    </h3>
                    <p className="leading-relaxed">
                      When you use the resume review feature, your resume
                      content is sent to Google's Gemini API for AI-powered
                      analysis and feedback. By using this feature, you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                      <li>
                        Acknowledge that your resume data will be processed by
                        Google
                      </li>
                      <li>
                        Agree to Google's Terms of Service and Privacy Policy
                      </li>
                      <li>
                        Understand that this is an optional feature you can
                        choose not to use
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#364050] mb-2">
                      5.3 Third-Party Limitations
                    </h3>
                    <p className="leading-relaxed">
                      We are not responsible for the availability, accuracy, or
                      performance of third-party services. Any issues with
                      Firebase or Gemini API should be directed to Google.
                    </p>
                  </div>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  6. Acceptable Use Policy
                </h2>
                <p className="leading-relaxed">You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Use the service for any illegal or unauthorized purpose
                  </li>
                  <li>
                    Attempt to gain unauthorized access to our systems or other
                    users' accounts
                  </li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Use automated scripts or bots to access the service</li>
                  <li>
                    Reverse engineer, decompile, or disassemble any part of the
                    service
                  </li>
                  <li>
                    Copy, modify, or distribute our templates or code without
                    permission
                  </li>
                  <li>Use the service to spam, phish, or distribute malware</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  7. Service Availability and Modifications
                </h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#364050]">
                    7.1 Service Availability
                  </h3>
                  <p className="leading-relaxed">
                    We strive to provide continuous service availability, but we
                    do not guarantee uninterrupted access. The service may be
                    temporarily unavailable due to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Scheduled maintenance</li>
                    <li>Technical issues or updates</li>
                    <li>
                      Third-party service disruptions (Firebase, Gemini API)
                    </li>
                    <li>Force majeure events</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    7.2 Service Modifications
                  </h3>
                  <p className="leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue any
                    aspect of the service at any time without prior notice. We
                    are not liable for any modification, suspension, or
                    discontinuation of the service.
                  </p>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  8. Intellectual Property Rights
                </h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#364050]">
                    8.1 Our Property
                  </h3>
                  <p className="leading-relaxed">
                    All aspects of the ResuMate service, including but not
                    limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Website design and layout</li>
                    <li>Resume templates</li>
                    <li>Software code and algorithms</li>
                    <li>Logos, branding, and trademarks</li>
                    <li>User interface and design elements</li>
                  </ul>
                  <p className="leading-relaxed mt-2">
                    are owned by ResuMate or its licensors and are protected by
                    copyright, trademark, and other intellectual property laws.
                  </p>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    8.2 Limited License
                  </h3>
                  <p className="leading-relaxed">
                    We grant you a limited, non-exclusive, non-transferable
                    license to access and use the service for personal,
                    non-commercial purposes. You may not copy, distribute, or
                    create derivative works from our templates or service
                    without written permission.
                  </p>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  9. Disclaimer of Warranties
                </h2>
                <div className="bg-[#EEEFEF] p-6 rounded-lg">
                  <p className="leading-relaxed font-semibold text-[#171F2E]">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                  </p>
                  <p className="leading-relaxed mt-3">
                    ResuMate disclaims all warranties, including but not limited
                    to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Merchantability or fitness for a particular purpose</li>
                    <li>Accuracy, reliability, or completeness of content</li>
                    <li>Uninterrupted or error-free service</li>
                    <li>Security of data transmission</li>
                    <li>Results or outcomes from using the service</li>
                  </ul>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  10. Limitation of Liability
                </h2>
                <div className="bg-[#EEEFEF] p-6 rounded-lg">
                  <p className="leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESUMATE SHALL NOT
                    BE LIABLE FOR ANY:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>
                      Indirect, incidental, special, consequential, or punitive
                      damages
                    </li>
                    <li>Loss of profits, revenue, data, or use</li>
                    <li>Damage to reputation or business opportunities</li>
                    <li>
                      Issues arising from third-party services (Firebase, Gemini
                      API)
                    </li>
                    <li>Unauthorized access to or alteration of your data</li>
                  </ul>
                  <p className="leading-relaxed mt-3">
                    This limitation applies regardless of the legal theory
                    (contract, tort, negligence, or otherwise) and whether or
                    not we have been advised of the possibility of such damages.
                  </p>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  11. Indemnification
                </h2>
                <p className="leading-relaxed">
                  You agree to indemnify, defend, and hold harmless ResuMate,
                  its officers, directors, employees, and agents from any
                  claims, damages, losses, liabilities, and expenses (including
                  legal fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the service</li>
                  <li>Your violation of these Terms of Use</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Content you submit or upload to the service</li>
                  <li>Your breach of any applicable laws or regulations</li>
                </ul>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  12. Data and Privacy
                </h2>
                <p className="leading-relaxed">
                  Your use of the service is also governed by our Privacy
                  Policy. Please review our Privacy Policy to understand how we
                  collect, use, and protect your information, particularly
                  regarding:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Google Firebase Authentication</li>
                  <li>Google Gemini API usage for resume review</li>
                  <li>Data storage and security practices</li>
                  <li>Your rights regarding your personal data</li>
                </ul>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  13. Termination
                </h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#364050]">
                    13.1 Your Rights
                  </h3>
                  <p className="leading-relaxed">
                    You may terminate your account at any time by deleting your
                    account through the service interface or contacting us
                    directly.
                  </p>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    13.2 Our Rights
                  </h3>
                  <p className="leading-relaxed">
                    We reserve the right to suspend or terminate your account
                    and access to the service at any time, without prior notice,
                    for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violation of these Terms of Use</li>
                    <li>Fraudulent, abusive, or illegal activity</li>
                    <li>Extended periods of inactivity</li>
                    <li>
                      Any reason we deem necessary to protect our service or
                      users
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#364050] mt-4">
                    13.3 Effect of Termination
                  </h3>
                  <p className="leading-relaxed">
                    Upon termination, your right to use the service ceases
                    immediately. We may delete your account data, though some
                    information may be retained as required by law or for
                    legitimate business purposes.
                  </p>
                </div>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  14. Governing Law and Disputes
                </h2>
                <p className="leading-relaxed">
                  These Terms of Use shall be governed by and construed in
                  accordance with applicable laws, without regard to conflict of
                  law principles. Any disputes arising from these terms or your
                  use of the service shall be resolved through good faith
                  negotiation.
                </p>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  15. Changes to Terms
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms of Use at any time.
                  We will notify users of significant changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Updating the "Last Updated" date at the top of this page
                  </li>
                  <li>Posting a notice on the service</li>
                  <li>Sending an email notification (if applicable)</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  Your continued use of the service after changes constitutes
                  acceptance of the modified terms. If you do not agree to the
                  changes, you must stop using the service.
                </p>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  16. Severability
                </h2>
                <p className="leading-relaxed">
                  If any provision of these Terms of Use is found to be invalid
                  or unenforceable, the remaining provisions shall continue in
                  full force and effect. The invalid provision shall be modified
                  to the minimum extent necessary to make it valid and
                  enforceable.
                </p>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  17. Entire Agreement
                </h2>
                <p className="leading-relaxed">
                  These Terms of Use, together with our Privacy Policy,
                  constitute the entire agreement between you and ResuMate
                  regarding the use of the service and supersede all prior
                  agreements and understandings.
                </p>
              </section>

              <section data-aos="fade-up" className="space-y-4">
                <h2 className="text-2xl font-bold text-[#171F2E]">
                  18. Contact Information
                </h2>
                <p className="leading-relaxed">
                  If you have any questions, concerns, or feedback about these
                  Terms of Use, please contact us:
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

              <section
                data-aos="fade-up"
                className="bg-[#EEEFEF] p-6 rounded-lg mt-8"
              >
                <h3 className="text-xl font-bold text-[#171F2E] mb-3">
                  Acknowledgment
                </h3>
                <p className="leading-relaxed text-[#364050]">
                  BY USING RESUMATE, YOU ACKNOWLEDGE THAT YOU HAVE READ,
                  UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF USE.
                </p>
              </section>
            </div>
          </div>

          <div className="absolute p-2 top-24 px-10 ">
            <button onClick={() => document.getElementById('thirdparty')?.scrollIntoView({ behavior: 'smooth' })}>Third-Party Services</button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TermsOfUse;
