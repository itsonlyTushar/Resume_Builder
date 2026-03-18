import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  form_data: {
    personalDetails: [
      {
        firstName: "Emily",
        lastName: "Carter",
        email: "emily.carter@email.com",
        phoneNumber: "+1 555 901 2345",
        linkedin: "https://linkedin.com/in/emily-carter",
        about: `Results-driven Digital Marketing Manager with 4+ years of experience leading data-backed campaigns across paid and organic channels. Managed $500K+ annual ad budgets on Google and Meta, consistently achieving 3x+ ROAS. Skilled at turning analytics into growth strategy for B2B and e-commerce brands.`,
        github: "",
        portfolio: "https://emilycarter.co",
        id: 1,
      },
    ],
    educationDetails: [
      {
        collegeName: "University of California, Los Angeles",
        course: "Bachelor of Science in Marketing",
        location: "Los Angeles",
        year: "2017 – 2021",
        id: 1,
      },
    ],
    experienceDetails: [
      {
        companyName: "BrightWave Agency",
        role: "Digital Marketing Manager",
        location: "Remote",
        year: "Jun 2022 – Present",
        description: `Led campaign strategy for 8 B2B and e-commerce clients across Google Ads and Meta, managing $500K+ annual ad spend with an average 3.2x ROAS. Built automated email workflows in HubSpot that grew open rates by 40%. Produced monthly performance reports and collaborated with design teams to refine messaging. Mentored two junior marketers and standardized campaign reporting across the agency.`,
        id: 1,
      },
    ],
    projectDetails: [
      {
        projectName: "Q3 SaaS Growth Campaign",
        techStack: "Google Ads, Meta Ads, HubSpot",
        year: "Q3 2023",
        projectLink: "",
        description: `Designed and executed a full-funnel paid campaign targeting mid-market SaaS buyers. Reduced cost-per-lead by 28% through iterative A/B testing of ad creatives and landing pages. Generated 340 qualified leads in 90 days, exceeding the client's quarterly target by 42%.`,
        id: 1,
      },
      {
        projectName: "Retail Brand Refresh Initiative",
        techStack: "Figma, Mailchimp, Canva",
        year: "Jan 2023",
        projectLink: "",
        description: `Partnered with the design team to reposition a retail client's brand identity across digital touchpoints. Redesigned 12 email templates resulting in a 35% uplift in click-through rates. Launched a refreshed social content calendar that grew organic reach by 60% in three months.`,
        id: 2,
      },
    ],
    skills: [
      { skillName: "Google Ads", category: "", id: 1 },
      { skillName: "Meta Ads", category: "", id: 2 },
      { skillName: "HubSpot", category: "", id: 3 },
      { skillName: "Mailchimp", category: "", id: 4 },
      { skillName: "Google Analytics", category: "", id: 5 },
      { skillName: "SEO & SEM", category: "", id: 6 },
      { skillName: "A/B Testing", category: "", id: 7 },
      { skillName: "Email Marketing", category: "", id: 8 },
      { skillName: "Content Strategy", category: "", id: 9 },
      { skillName: "Social Media Marketing", category: "", id: 10 },
      { skillName: "Figma", category: "", id: 11 },
      { skillName: "Canva", category: "", id: 12 },
      { skillName: "Data Analysis", category: "", id: 13 },
      { skillName: "Campaign Management", category: "", id: 14 },
      { skillName: "Copywriting", category: "", id: 15 },
    ],
    certification: [
      { certiName: "", year: "", id: 1 },
    ],
    selected_template: null,
    sectionOrder: ["description", "education", "projects", "experience", "skills"],
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
    // updates the drag-and-drop section order (developer template)
    updateSectionOrder: (state, action) => {
      state.form_data.sectionOrder = action.payload;
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
  updateSectionOrder,
  resetFormData,
} = resumeBuilder.actions;

export default resumeBuilder.reducer;
