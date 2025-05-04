import React from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addFields,
  removeFields,
  updateFields,
} from "../../features/templateSlice";

function OtherDetails() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  
  const skills = useSelector((state) => state.resumeBuilder.form_data.skills);
  const certification = useSelector((state) => state.resumeBuilder.form_data.certification)

  console.log(certification)
  const dispatch = useDispatch();


  const handleSkillAdd = (arrState) => {
    const newField = {
      skillName: "",
    };
    dispatch(addFields({ arrState, newField }));
  };

  const handleCertiAdd = (arrState) => {
    const newField = {
      certiName: "",
      year: ""
    };

    dispatch(addFields({arrState, newField}))
  }


  const handleInputChange = (index, field, value, arrState) => {
    dispatch(updateFields({ index, field, value, arrState }));
    setValue(`${arrState}.${index}.${field}`, value);
  };

  const handleDelete = (id, arrState) => {
    dispatch(removeFields({ id, arrState }));
  };

  return (
    <>{/* skill section */}

      <h1 className="mb-7 text-4xl font-semibold ml-2 mt-3">Skills Details</h1>
      {skills.map((detail, index) => (
        <div key={detail.id}>
          <div className="grid grid-cols-2 sm:grid-cols-1">

            <div className="p-2 ml-2 flex items-center gap-4">
            <div>
              <label
                className="text-black font-bold text-md"
                htmlFor={`skills.${index}.skillName`}
              >
                Skill
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md rounded-xl text-gray-700"
                name={`skills.${index}.skillName`}
                type="text"
                placeholder="Enter skill..."
                {...register(`skills.${index}.skillName`, {
                  required: true,
                  maxLength: 30,
                  validate: (value) =>
                    value.trim().length > 0 || "at least add one skill",
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "skillName",
                      e.target.value,
                      "skills"
                    ),
                  })}
                  />
              {errors.skills?.[index]?.skillName && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Atleast add one skill
                </p>
              )}
              </div>

            <div>

            {skills.length > 1 && (
              <button
              type="button"
              onClick={() => handleDelete(detail.id, "skills")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-red-500 py-1 px-2 text-white rounded-md"
              >
              <i className="ri-delete-bin-6-line"></i>
            </button>
          )}
          </div>
            </div>
          </div>


        </div>
      ))}

      <button
        type="button"
        onClick={() => handleSkillAdd("skills")}
        className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-black py-1 px-2 text-white text-md rounded-xl"
      >
        + Add field
      </button>


      {/* *New* Certification section  */}

      <h1 className="mb-7 text-4xl font-semibold ml-2 mt-6">Certification / Course </h1>

      {certification.map((detail, index) => (
        <div key={detail.id}>
          <div className="grid grid-cols-2 sm:grid-cols-1">
            <div className="p-2 ml-2 grid grid-cols-1 sm:flex items-center gap-6">
              <div>
              <label
                className="text-black font-bold text-md"
                htmlFor={`certification.${index}.certiName`}
              >
                Certification
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md rounded-xl text-gray-700"
                name={`certification.${index}.certiName`}
                type="text"
                placeholder="Enter here..."
                {...register(`certification.${index}.certiName`, {
                  required: false,
                  maxLength: 50,
                  validate: (value) =>
                    value.trim().length > 0 || "at least add one skill",
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "certiName",
                      e.target.value,
                      "certification"
                    ),
                })}
              />
              {errors.certification?.[index]?.certiName && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Please Add Something here
                </p>
              )}
            </div>

            <div>
            <label
                className="text-black font-bold text-md"
                htmlFor={`certification.${index}.year`}
              >
                Year
              </label>
              <input  
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`certification.${index}.year`}
                type="text"
                placeholder="Mar-2024"
                {...register(`certification.${index}.year`, {
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
                      "certification"
                    ),
                })}
                {...errors.certification?.[index]?.year && (
                  <p className="text-red-400 mt-1">
                    <i className="mr-1 ri-alert-line"></i>Enter a valid input
                  </p>
                )}
              />
              </div>
            </div>
          </div>

          <button
        type="button"
        onClick={() => handleCertiAdd("certification")}
        className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-black py-1 px-2 text-white text-md rounded-xl"
      >
        + Add field
      </button>

          {certification.length > 1 && (
            <button
              type="button"
              onClick={() => handleDelete(detail.id, "certification")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-red-500 py-1 px-2 text-white rounded-md"
            >
              <i className="ri-delete-bin-6-line"></i>
            </button>
          )}
        </div>
      ))}






    </>
  );
}

export default OtherDetails;
