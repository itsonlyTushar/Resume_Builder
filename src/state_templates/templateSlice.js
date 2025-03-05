import { createSlice } from "@reduxjs/toolkit"
import { nanoid } from "@reduxjs/toolkit";

// setting the initial state 

const initialState = 
    {
        form_data : { 
            personalDetails : [{firstName:'Tushar', lastName:'Soni', email:'tushargsoni@outlook.com', phoneNumber:'9327584894', linkedin:'https://www.linkedin.com/in/tushar-soni-b0426022b',about:`Driven Front-End Developer passionate about crafting seamless, high-performance web experiences. I specialize in React, JavaScript, and modern UI frameworks like MUI, with a keen interest in real-time features and AI-powered enhancements.Always learning, optimizing, and pushing the boundaries of front-end development to create user-centric solutions that stand out.`,id:1}],
            educationDetails:[{collegeName:'Woolf', course:'Master in Computer Science', location:'USA', year:'2024-2026',id:1},
                {collegeName:'VNSGU', course:'Bachelor of Commerce', location:'Surat', year:'2020-2024',id:2}
            ],
            experienceDetails: [{companyName:'Jay Air Systems Pvt. Ltd.', role:'Data Entry Operator', location:'Surat', year:'2022-2025', description:`Maintaining and updating the company's CRM system by promptly commissioning machines and ensuring accurate record-keeping.Generating daily sales and service reports to provide real-time insights to respective departments.Developed a VBA module with ChatGPT that automates reporting tasks, saving approximately 1 hour of daily manual work.Implementing data visualization techniques to enhance report clarity and decision-making.`,id:1}],
            projectDetails: [{projectName:'ResuMate - Professional resume builder', techStack:'React,Redux,React Hook Form',year:'Feb-2025', projectLink:'https://resume-builder-delta-peach.vercel.app',id:1},
                {projectName:'Portfolio Site - Personal portfolio site', techStack:'HTML,CSS,JavaScript,React',year:'Aug-2024', projectLink:'https://portfolio-site-six-navy.vercel.app',id:2}
            ],
            skills: [

                {skillName:'HTML' ,id:1},
                {skillName:'CSS' ,id:2},
                {skillName:'JavaScript' ,id:3},
                {skillName:'React' ,id:4},
                {skillName:'Redux' ,id:5},
                {skillName:'React Router' ,id:6},
                {skillName:'Tailwind Css' ,id:7},
                {skillName:'Material UI' ,id:7},




            ], 
            selected_template: 1,
        }   
    }


const resumeBuilder = createSlice({
    name: 'resumeBuilder',
    initialState,
    reducers : {
        // Get the selected template from user
        catch_template : (state,action) => {
            state.form_data.selected_template = action.payload;
        },
        // update personal details section
        updatePersonalDetails: (state, action) => {
            const {index, field, value, arrState} = action.payload;
            state.form_data[arrState][index] = {
                ...state.form_data[arrState][index],
                [field]: value
            }
        },    
        // updates other details sections
        updateFields: (state, action) => {
            const {index,field,value,arrState} = action.payload
            state.form_data[arrState][index] = {
                ...state.form_data[arrState][index],
                [field]:value
            }
        },
        // adds feilds as required by user
        addFields: (state,action) => {
            const {arrState,newField} = action.payload
            state.form_data[arrState] = [
                ...state.form_data[arrState],
                {...newField,id:nanoid()}
            ];
        },
        // deletes feilds as required by user
        removeFields:(state,action) => {
            const {id,arrState} = action.payload
            state.form_data[arrState] = state.form_data[arrState].filter((data)=> data.id !== id)            
        },
        // resets the data entered.
        resetFormData: (state) => {
            state.form_data = initialState.form_data;
        }
       
    },
});

export const {
    catch_template, 
    updatePersonalDetails, 
    updateFields, 
    addFields,
    addExperinceDetails,
    removeFields,
    resetFormData,
} = resumeBuilder.actions;

export default resumeBuilder.reducer;