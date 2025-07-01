import { useEffect, useState } from "react";
import { Avatar, Box, Card, CardMedia, Rating } from "@mui/material";
import { Pagination } from "@mui/material";
import Footer from "../components/Footer/Footer";
import FabScroll from "../components/UI/Fab";
import AOS from "aos";
import Navigation from "../components/Navbar/Navigation";
import { Link } from "react-router-dom";
import tushar from "../assets/team_photos/tushar.jpg";

function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Sahiba Bali",
      avatar: (
        <Avatar
          sx={{ width: 70, height: 70 }}
          alt="sahiba"
          src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      ),
      review:
        "This Resume builder transformed my job search experience. The intuitive interface and professional templates helped me create a standout resume that landed me multiple interview opportunities within weeks.",
      star: 3.5,
    },
    {
      id: 2,
      name: "Deval Soni",
      avatar: (
        <Avatar
          sx={{ width: 70, height: 70 }}
          alt="deval"
          src="https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0c3xlbnwwfHwwfHx8MA%3D%3D"
        />
      ),
      review:
        "What impressed me most was how quickly I could create different versions of my resume for various roles. The template selection is modern and professional. Made my job application process much more efficient.",
      star: 4,
    },
    {
      id: 3,
      name: "Manik Manha",
      avatar: (
        <Avatar
          sx={{ width: 70, height: 70 }}
          alt="puneet"
          src="https://images.unsplash.com/photo-1619300026534-8e8a76941138?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      ),
      review:
        "As someone who reviews hundreds of resumes, I appreciate how this tool maintains professional formatting while allowing for creativity. ",
      star: 3.5,
    },
  ];

  const [page, setPage] = useState(1);
  const reviewsPerPage = 1;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const displayedReviews = reviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );

  return (
    <>
      <Navigation />
      <div className="pt-20">
        <h1 className="text-5xl text-center mb-10 font-bold py-4">About Us</h1>
        {/* About section  */}
        <section
          data-aos="fade-up"
          className="flex text-center justify-center items-center text-center px-16 mx-4 bg-gray-100 py-16 rounded-3xl"
        >
          <div className="max-w-3xl px-4 rounded-2xl">
            <h1 className="sm:text-5xl text-3xl font-semibold">
              How Resume Builder Created and Why?
            </h1>
            <p className="mb-5 pt-10">
              This project was created with a vision to help job seekers craft
              standout resumes effortlessly. With features like authentication
              and different templates, users can securely manage their
              information and download resumes with ease. Our goal is to provide
              a seamless, user-friendly experience while continuously improving
              and adding new features.
            </p>
          </div>
        </section>
        {/* Team section  */}

        <div className="grid sm:grid-cols-2 grid-cols-1 place-items-center content-center items-center m-5 gap-8 py-14">
          <div data-aos="fade-left" className="p-5 m-2">
            <h2 className="text-4xl font-bold mb-4 text-blackBg">
              Hey i build this !
            </h2>
            <p className="max-w-xl text-justify text-xl">
              I’m Tushar Soni — a web developer and the person behind Resumate,
              a professional resume builder. I built this with a simple goal in
              mind: to make creating resumes quicker, easier, and more modern.
              As someone who loves building things that solve everyday problems,
              this project is close to my heart. It's all about helping job
              seekers craft professional resumes effortlessly and giving them a
              smoother experience during their job search.
            </p>

            <div className="mt-5">
              <ul className="flex gap-4 text-2xl text-blackBg">
                <li className="border-red max-w-xl bg-red-100  px-6 py-2 rounded-lg">
                  <Link to={"https://www.instagram.com/tushar_28.7/"}>
                    <i className="ri-instagram-line"></i>
                  </Link>
                </li>
                <li className="border-red max-w-xl bg-red-100  px-6 py-2 rounded-lg">
                  <Link to={"https://x.com/ts28_7"}>
                    <i className="ri-twitter-x-line"></i>
                  </Link>
                </li>
                <li className="border-red max-w-xl bg-red-100  px-6 py-2 rounded-lg">
                  <Link
                    to={"https://www.linkedin.com/in/tushar-soni-b0426022b/"}
                  >
                    <i className="ri-linkedin-fill"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div data-aos="fade-up" className="bg-blackBg  rounded-xl pt-10 p-5 m-2">
            <img
              className="sm:max-w-md max-w-sm object-cover rounded-xl"
              src={tushar}
              alt="tushar"
            />
          </div>
        </div>
      </div>
      <FabScroll />
      <Footer />
    </>
  );
}

export default About;
