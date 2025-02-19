import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addFields,
  removeFields,
  updateFields,
} from "../../state_templates/templateSlice";

function ExperinceDetails() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const experienceDetails = useSelector(
    (state) => state.resumeBuilder.form_data.experienceDetails
  );
  const dispatch = useDispatch();

  const handleAddField = (arrState) => {
    const newField = {
      companyName: "",
      role: "",
      location: "",
      year: "",
      description: "",
    };
    dispatch(addFields({ arrState, newField }));
  };

  const handleInputChange = (index, field, value, arrState) => {
    dispatch(updateFields({ index, field, value, arrState }));
    setValue(`${arrState}.${index}.${field}`, value);
  };

  useEffect(() => {
    console.log(experienceDetails);
  }, [experienceDetails]);

  const handleDelete = (id, arrState) => {
    dispatch(removeFields({ id, arrState }));
  };

  return (
    <>
      <h1 className="mb-7 text-5xl font-semibold ml-2">Experince Details</h1>
      {experienceDetails.map((detail, index) => (
        <div key={detail.id}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`experienceDetails.${index}.companyName`}
              >
                Company Name
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`experienceDetails.${index}.companyName`}
                type="text"
                placeholder="Enter name..."
                {...register(`experienceDetails.${index}.companyName`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0;
                  },
                  maxLength: 30,
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "companyName",
                      e.target.value,
                      "experienceDetails"
                    ),
                })}
              />
              {errors.experienceDetails?.[index]?.companyName && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`experienceDetails.${index}.role`}
              >
                Role
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`experienceDetails.${index}.role`}
                type="text"
                placeholder="Enter role name..."
                {...register(`experienceDetails.${index}.role`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0;
                  },
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "role",
                      e.target.value,
                      "experienceDetails"
                    ),
                })}
              />
              {errors.experienceDetails?.[index]?.role && (
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
                htmlFor={`experienceDetails.${index}.location`}
              >
                Location
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`experienceDetails.${index}.location`}
                type="text"
                placeholder="Enter location..."
                {...register(`experienceDetails.${index}.location`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0;
                  },
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "location",
                      e.target.value,
                      "experienceDetails"
                    ),
                })}
              />
              {errors.experienceDetails?.[index]?.location && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`experienceDetails.${index}.year`}
              >
                Year
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`experienceDetails.${index}.year`}
                type="text"
                placeholder="2023-2025"
                {...register(`experienceDetails.${index}.year`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0;
                  },
                  onChange: (e) =>
                    handleInputChange(index, "year", e.target.value,"experienceDetails"),
                })}
              />
              {errors.experienceDetails?.[index]?.year && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`experienceDetails.${index}.description`}
              >
                Description
              </label>
              <textarea
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-full rounded-xl text-gray-700"
                name={`experienceDetails.${index}.description`}
                type="text"
                placeholder="Enter description"
                {...register(`experienceDetails.${index}.description`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0;
                  },
                  onChange: (e) =>
                    handleInputChange(index, "description", e.target.value,"experienceDetails"),
                })}
              />
              {errors.experienceDetails?.[index]?.description && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Enter a valid input
                </p>
              )}
            </div>
          </div>

          {experienceDetails.length > 1 && (
            <button
              type="button"
              onClick={() => handleDelete(detail.id, "experienceDetails")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-red-500 py-1 px-2 text-white rounded-md"
            >
              <i className="ri-delete-bin-6-line"></i>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => handleAddField("experienceDetails")}
        className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 border mx-2 mt-5 bg-black py-1 px-2 text-white text-md rounded-xl"
      >
        + Add field
      </button>
    </>
  );
}

export default ExperinceDetails;
