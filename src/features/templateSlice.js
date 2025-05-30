import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

// setting the initial state

const initialState = {
  form_data: {
    personalDetails: [
      {
        firstName: "Tushar",
        lastName: "Soni",
        email: "tushargsoni17@gmail.com",
        phoneNumber: "9327584894",
        linkedin: "https://www.linkedin.com/in/tushar-soni-b0426022b",
        about: `I’m a Front-End Developer who loves building smooth, high-performance web experiences. I work mainly with React, JavaScript, and modern UI tools like MUI. I’m especially excited about real-time features and creating interfaces that feel intuitive, fast, and just work beautifully. Always learning, always refining. I aim to build user experiences that truly stand out.`,
        id: 1,
      },
    ],
    educationDetails: [
      {
        collegeName: "Sacsma College of Commerce",
        course: "Bachelor of Commerce - Bcom",
        location: "Surat",
        year: "2020-2024",
        id: 1,
      },
      {
        collegeName: "Woolf",
        course: "Masters in Computer Science - Software Engineering",
        location: "USA",
        year: "2024 - 2026",
        id: 2,
      },
    ],
    experienceDetails: [
      {
        companyName: "Jay Air Systems Private Limited",
        role: "Data Entry Operator",
        location: "Surat",
        year: "May-2023 - Apr-2025",
        description: `Generating daily sales and service reports to
provide realtime insights to respective
departments.Developed a VBA module with
ChatGPT that automates reporting tasks, saving
approximately 1 hour of daily manual work.Creating monthly dashboard reports segmented by salesperson to track performance metrics and identify growth opportunities.`,
        id: 1,
      },
            {
        companyName: "Jay Air Systems Private Limited",
        role: "Data Entry Operator",
        location: "Surat",
        year: "May-2023 - Apr-2025",
        description: `Generating daily sales and service reports to
provide realtime insights to respective
departments.Developed a VBA module with
ChatGPT that automates reporting tasks, saving
approximately 1 hour of daily manual work.Creating monthly dashboard reports segmented by salesperson to track performance metrics and identify growth opportunities.`,
        id: 1,
      },
    ],
    projectDetails: [
      {
        projectName: "Order Ease - QR Food Ordering System",
        techStack: "React, Redux, Tailwind, Radix UI, Material UI, Firebase Firestore",
        year: "May-2025",
        projectLink: "https://order-ease-xi.vercel.app",
        id: 1,
      },
    ],
    skills: [{ skillName: "HTML", id: 1 }, { skillName: "Javascript", id: 1 }, { skillName: "CSS", id: 1 }, { skillName: "React", id: 1 }, { skillName: "Redux", id: 1 }, { skillName: "Tailwind", id: 1 }, { skillName: "Material UI", id: 1 },],
    certification: [{ certiName: "", year: "", id: 1 }],
    selected_template: null,
  },
};

const resumeBuilder = createSlice({
  name: "resumeBuilder",
  initialState,
  reducers: {
    // Get the selected template from user
    catch_template: (state, action) => {
      state.form_data.selected_template = action.payload;
    },
    // update personal details section
    updatePersonalDetails: (state, action) => {
      const { index, field, value, arrState } = action.payload;
      state.form_data[arrState][index] = {
        ...state.form_data[arrState][index],
        [field]: value,
      };
    },
    // updates other details sections
    updateFields: (state, action) => {
      const { index, field, value, arrState } = action.payload;
      state.form_data[arrState][index] = {
        ...state.form_data[arrState][index],
        [field]: value,
      };
    },
    // adds feilds as required by user
    addFields: (state, action) => {
      const { arrState, newField } = action.payload;
      state.form_data[arrState] = [
        ...state.form_data[arrState],
        { ...newField, id: nanoid() },
      ];
    },
    // deletes feilds as required by user
    removeFields: (state, action) => {
      const { id, arrState } = action.payload;
      state.form_data[arrState] = state.form_data[arrState].filter(
        (data) => data.id !== id
      );
    },
    // resets the data entered.
    resetFormData: (state) => {
      state.form_data = initialState.form_data;
    },
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
