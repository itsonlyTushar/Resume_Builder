import React, { useEffect, useState } from "react";
import about_us from "../assets/about_us.jpg";
import { Avatar, Box, Card, CardMedia, Rating } from "@mui/material";
import myImg from "../assets/team_photos/201.jpg";
import { Pagination } from "@mui/material";
import Footer from './Footer'
import FabScroll from './Fab'
import AOS from 'aos';
import Navigation from "./Navigation";


function About() {

  useEffect(()=> {
    AOS.init({
      duration:1000,
      once:true
    })
  },[])


  const reviews = [
    {
      id: 1,
      name: "Sahiba Bali",
      avatar: (
        <Avatar sx={{ width: 70, height: 70 }} alt="sahiba" src='https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
      ),
      review:
        "This Resume builder transformed my job search experience. The intuitive interface and professional templates helped me create a standout resume that landed me multiple interview opportunities within weeks.",
      star: 3.5,
    },
    {
      id: 2,
      name: "Deval Soni",
      avatar: (
        <Avatar sx={{ width: 70, height: 70 }} alt="deval" src='https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0c3xlbnwwfHwwfHx8MA%3D%3D' />
      ),
      review:
        "What impressed me most was how quickly I could create different versions of my resume for various roles. The template selection is modern and professional. Made my job application process much more efficient.",
      star: 4,
    },
    {
      id: 3,
      name: "Manik Manha",
      avatar: (
        <Avatar sx={{ width: 70, height: 70 }} alt="puneet" src='https://images.unsplash.com/photo-1619300026534-8e8a76941138?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
      ),
      review:"As someone who reviews hundreds of resumes, I appreciate how this tool maintains professional formatting while allowing for creativity. ",
      star: 3.5,
    },
  ];

  const [page, setPage] = useState(1);
  const reviewsPerPage = 1;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleChange = (event,value) => {
    setPage(value);
  };

  

  const displayedReviews = reviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );

  const team_imgs = [
    {
      name: "Regie Donald",
      img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      position: "Head of Product",
    },
    {
      name: "Shanaya Singh",
      img: "https://images.unsplash.com/photo-1620122303020-87ec826cf70d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      position: "UI/UX Designer",
    },
    {
      name: "Rajat Gurjar",
      img: "https://images.unsplash.com/photo-1618284554746-71a7b3e923c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      position: "Graphic Designer",
    },
    {
      name: "Tushar Soni",
      img: myImg,
      position: "Web Developer",
    },
    {
      name: "Dolly Singh",
      img: "https://images.unsplash.com/photo-1617187735632-727b180e432d?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      position: "React Developer",
    },
    {
      name: "Clark Kent",
      img: "https://images.unsplash.com/photo-1617859524891-1de8cee43c39?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGJsYWNrJTIwYW5kJTIwd2hpdGUlMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
      position: "Project Manager",
    },
  ];

  return (
    <>

      <Navigation />
      <div className="pt-20">
      <h1 className="text-5xl text-center mb-10 font-bold">About Us</h1>
      <section className="flex justify-center items-stretch text-center">
        {/* Bento grid like a design */}

        <div className="grid sm:grid-cols-2 grid-cols-1  gap-4">
          <div data-aos="fade-up" className=" border p-6 sm:w-[35vw] m-2 shadow-xl rounded-xl">
            <p className="text-left m-2 text-green-600 font-bold">
              This is us
            </p>
            <h1 className="text-3xl font-bold text-left p-4">
              How Resume Builder Created and Why?
            </h1>
            <p className="p-4 mt-56 text-wrap text-justify text-gray-500">
            This project was created with a vision to help job seekers craft standout resumes effortlessly. With features like Firebase authentication and jsPDF integration, users can securely manage their information and download resumes with ease. Our goal is to provide a seamless, user-friendly experience while continuously improving and adding new features.
            </p>
          </div>

          <div data-aos="fade-up" className="border shadow-xl rounded-xl p-6 sm:w-[35vw] m-2 ">
            <div className="m-2 ">
              <img
                className="w-[25rem] rounded-xl"
                src={about_us}
                alt="aboutus"
              />
            </div>
            <div className="bg-gray-50 m-2 p-5 grid sm:grid-cols-2 grid-cols-1 gap-3 rounded-xl">
              <div className="bg-gray-200 p-5 rounded-xl">
                <h2 className="text-left text-3xl font-semibold">4.5</h2>
                <p className="text-left text-sm">Years Experince</p>
              </div>
              <div className="bg-gray-200 p-5 rounded-xl">
                <h2 className="text-left text-3xl font-semibold">10</h2>
                <p className="text-left text-sm">Tools Developed</p>
              </div>
              <div className="bg-gray-200 p-5 rounded-xl">
                <h2 className="text-left text-3xl font-semibold">100+</h2>
                <p className="text-left text-sm">Positive Reviews</p>
              </div>
              <div className="bg-gray-200 p-5 rounded-xl">
                <h2 className="text-left text-3xl font-semibold">200+</h2>
                <p className="text-left text-sm">Users</p>
              </div>
            </div>
          </div>

          <div className="sm:w-[35vw] p-6 m-2 bg-[#E7E7E9] rounded-xl">
            <p className="text-left m-2 text-green-600 font-bold">
              Tech and Help
            </p>
            <h1 className="text-2xl font-semibold text-left">
              Tech Used To Create This
            </h1>
            <p className="text-justify text-gray-500">
              By using the redux for state management from using AI to generate Jspdf templates easily to get best results.
            </p>
          </div>

          <div className="sm:w-[35vw] p-6 m-2 bg-[#E7E7E9] rounded-xl">
            <p className="text-left m-2 text-green-600 font-bold">
              Project 
            </p>
            <h1 className="text-2xl font-semibold text-left">
              Created Under Capstone Project
            </h1>
            <p className="text-justify text-gray-500">
              Project planning and develpement started in Nov-2024 and this project is developed as a capstone project by Tushar soni
            </p>
          </div>
        </div>


      </section>
      {/* Team section  */}
      <section className="sm:flex  justify-center items-center mt-24">
        <div className="p-12 m-2 shadow-xl border rounded-xl">
          <h1 className="text-left m-2 text-green-600 font-bold">
            Meet the team
          </h1>
          <p className="text-left text-4xl font-semibold">
            Meet our hardworking team
          </p>

          {/* Team Photos  */}

          <div data-aos="fade-up" className="grid sm:grid-cols-3 grid-cols-1 text-center mt-10">
        
            {team_imgs.map(({ name, img, position }) => (
            
              <Card
                key={name}
                sx={{
                  position: "relative",
                  borderRadius: "20px",
                  m: 2,
                  zIndex:-10,
                  "&:hover .hover-box": { opacity: 1 },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ objectFit: "cover"}}
                  image={img}
                  alt="image"
                />

                <Box
                  className="hover-box"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                >
                  <div>
                    <h4 className="text-3xl font-semibold text-white">
                      {name}
                    </h4>
                    <h3 className="text-2xl text-gray-400">{position}</h3>
                  </div>
                </Box>
              </Card>
            ))}
          </div>
        </div>
      </section>
 
      {/* Reviews  */}

      <section className="items-center p-10 w-full">
      <h1 className="text-5xl font-bold text-center m-2 mb-4">Testimonials </h1>
        
        {displayedReviews.map(({ id, name, review, avatar, star }) => (
          <div
            key={id}
            className="bg-gray-200 text-justify p-2 m-2 mb-2 rounded-2xl"
          >
            <div className="sm:flex sm:w-full p-2">
              <h4 className="p-2 mr-3">{avatar}</h4>
              <div className="text-wrap">
                <h2 className="p-2">{review}</h2>
              </div>
            </div>
            <div className="  mt-2 p-2 items-center ">
              <h2 className="mr-2 text-2xl font-semibold">{name}</h2>
              <div className="flex">
                <Rating name="half-rating" defaultValue={star} precision={0.5} readOnly />
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Component */}

      </section>
      <div className="flex justify-center items-center mb-5">
      <Pagination
          sx={{
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "#E5E7EB",
            },
            "& .Mui-selected": {
              backgroundColor: "black",
              color: "white"
            }
          }}
          count={totalPages}
          page={page}
          onChange={handleChange}
          color="primary"
          className="mt-4"
        />
        </div>
        </div>
      <FabScroll />
      <Footer />
      
      
    </>
  );
}

export default About;
