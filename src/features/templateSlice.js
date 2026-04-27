import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  form_data: {
    personalDetails: [
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        linkedin: "",
        about: "",
        github: "",
        portfolio: "",
        id: 1,
      },
    ],
    educationDetails: [
      {
        collegeName: "",
        course: "",
        location: "",
        year: "",
        id: 1,
      },
    ],
    experienceDetails: [
      {
        companyName: "",
        role: "",
        location: "",
        year: "",
        description: "",
        id: 1,
      },
    ],
    projectDetails: [
      {
        projectName: "",
        techStack: "",
        year: "",
        projectLink: "",
        description: "",
        id: 1,
      },
    ],
    skills: [
      { skillName: "", category: "", id: 1 },
    ],
    certification: [
      { certiName: "", year: "", id: 1 },
    ],
    selected_template: null,
    sectionOrder: ["description", "education", "projects", "experience", "skills"],
  },
  editingResume: null, // { documentId, fileId } when editing an existing resume
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
    // sets the entire form data
    setFormData: (state, action) => {
      state.form_data = {
        ...state.form_data,
        ...action.payload
      };
    },
    // sets the resume being edited (pass { documentId, fileId } or null to clear)
    setEditingResume: (state, action) => {
      state.editingResume = action.payload;
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
  setFormData,
  setEditingResume,
} = resumeBuilder.actions;

export default resumeBuilder.reducer;
