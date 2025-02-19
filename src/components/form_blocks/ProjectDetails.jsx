import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addFields,
  removeFields,
  updateFields,
} from "../../state_templates/templateSlice";

function ProjectDetails() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const projectDetails = useSelector(
    (state) => state.resumeBuilder.form_data.projectDetails
  );
  const dispatch = useDispatch();

  const handleAddField = (arrState) => {
    const newField = {
      projectName: "",
      techStack: "",
      projectLink: "",
      year: "",
    };
    dispatch(addFields({ arrState, newField }));
  };

  const handleInputChange = (index, field, value, arrState) => {
    dispatch(updateFields({ index, field, value, arrState }));
    setValue(`${arrState}.${index}.${field}`, value);
  };

  useEffect(() => {
    console.log(projectDetails);
  }, [projectDetails]);

  const handleDelete = (id, arrState) => {
    dispatch(removeFields({ id, arrState }));
  };

  return (
    <>
      <h1 className="mb-7 text-5xl font-semibold ml-2">Project Details</h1>
      {projectDetails.map((detail, index) => (
        <div key={detail.id}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`projectDetails.${index}.projectName`}
              >
                Project Name
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border w-min rounded-xl text-gray-700"
                name={`projectDetails.${index}.projectName`}
                type="text"
                placeholder="Enter name..."
                {...register(`projectDetails.${index}.projectName`, {
                  required: false,
                  maxLength: 30,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0 || "Enter a valid input";
                  },
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "projectName",
                      e.target.value,
                      "projectDetails"
                    ),
                })}
              />
              {errors.projectDetails?.[index]?.projectName && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`projectDetails.${index}.techStack`}
              >
                Tech Stack
              </label>
              <input
              
                data-testid="tech-stack"
                className="outline-none mt-1 p-3 flex items-center border w-min rounded-xl text-gray-700"
                name={`projectDetails.${index}.techStack`}
                type="text"
                placeholder="Javscript,Redux,React"
                {...register(`projectDetails.${index}.techStack`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0;
                  },
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "techStack",
                      e.target.value,
                      "projectDetails"
                    ),
                })}
              />
              {errors.projectDetails?.[index]?.techStack && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`projectDetails.${index}.projectLink`}
              >
                Project Link
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border w-min rounded-xl text-gray-700"
                name={`projectDetails.${index}.projectLink`}
                type="text"
                placeholder="Add Link..."
                {...register(`projectDetails.${index}.projectLink`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0 || "Enter a valid input";
                  },
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "projectLink",
                      e.target.value,
                      "projectDetails"
                    ),
                })}
              />
              {errors.projectDetails?.[index]?.projectLink && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`projectDetails.${index}.year`}
              >
                Year
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border w-min rounded-xl text-gray-700"
                name={`projectDetails.${index}.year`}
                type="text"
                placeholder="Mar-2024"
                {...register(`projectDetails.${index}.year`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0 || "Enter a valid input";
                  },
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "year",
                      e.target.value,
                      "projectDetails"
                    ),
                })}
              />
              {errors.projectDetails?.[index]?.year && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>
          </div>

          {projectDetails.length > 1 && (
            <button
              type="button"
              onClick={() => handleDelete(detail.id, "projectDetails")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-red-500 py-1 px-2 text-white rounded-md"
            >
              <i className="ri-delete-bin-6-line"></i>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => handleAddField("projectDetails")}
        className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-black py-1 px-2 text-white text-md rounded-xl"
      >
        + Add field
      </button>
    </>
  );
}

export default ProjectDetails;
