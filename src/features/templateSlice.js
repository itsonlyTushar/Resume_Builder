import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

// setting the initial state

const initialState = {
  form_data: {
    personalDetails: [
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        linkedin: "",
        about: ``,
        id: 1,
      },
    ],
    educationDetails: [
      { collegeName: "", course: "", location: "", year: "", id: 1 },
    ],
    experienceDetails: [
      {
        companyName: "",
        role: "",
        location: "",
        year: "",
        description: ``,
        id: 1,
      },
    ],
    projectDetails: [
      { projectName: "", techStack: "", year: "", projectLink: "", id: 1 },
    ],
    skills: [{ skillName: "", id: 1 }],
    selected_template: 1,
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
