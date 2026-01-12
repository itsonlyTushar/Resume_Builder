import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addFields,
  removeFields,
  updateFields,
} from "../../features/templateSlice";
import { sanitizeInput } from "../../utils/helpers";

function EducationDetails() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const educationDetails = useSelector(
    (state) => state.resumeBuilder.form_data.educationDetails
  );
  
  const dispatch = useDispatch();

  // after several attempts to updating redux state this method of conntecting redux and react-hook-form implemented
  const handleInputChange = useCallback((index, field, value, arrState) => {
    const sanitizedValue = sanitizeInput(value);
    dispatch(updateFields({ index, field, value: sanitizedValue, arrState }));
    setValue(`${arrState}.${index}.${field}`, sanitizedValue);
  }, [dispatch, setValue]);
  
  const handleAddField = useCallback((arrState) => {
    const newField = {
      collegeName: "",
      course: "",
      location: "",
      year: "",
    };
    dispatch(addFields({ arrState, newField }));
  }, [dispatch]);

  const handleDelete = useCallback((id, arrState) => {
    dispatch(removeFields({ id, arrState }));
  }, [dispatch]);

  return (
    <>
      <h1 className="mb-7 text-5xl font-semibold ml-2">Education Details</h1>
      {educationDetails.map((detail, index) => (
        <div key={detail.id}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`educationDetails.${index}.collegeName`}
              >
                College Name
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center bg-white border border-gray-300 hover:border-gray-400 w-min rounded-xl text-black transition-colors"
                name={`educationDetails.${index}.collegeName`}
                type="text"
                placeholder="Enter college..."
                {...register(`educationDetails.${index}.collegeName`, {
                  required: true,
                  validate: (value) =>
                    value.trim().length > 0 || "phone number cannot be empty",
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "collegeName",
                      e.target.value,
                      "educationDetails"
                    ),
                })}
              />
              {errors.educationDetails?.[index]?.collegeName && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>College name is required
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`educationDetails.${index}.course`}
              >
                Course
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center bg-white border border-gray-300 hover:border-gray-400 w-min rounded-xl text-black transition-colors"
                name={`educationDetails.${index}.course`}
                type="text"
                
                placeholder="Enter course name..."
                {...register(`educationDetails.${index}.course`, {
                  required: true,
                  validate: (value) =>
                    value.trim().length > 0 || "phone number cannot be empty",
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "course",
                      e.target.value,
                      "educationDetails"
                    ),
                })}
              />
              {errors.educationDetails?.[index]?.course && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i> {errors.educationDetails[index].course.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`educationDetails.${index}.location`}
              >
                Location
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center bg-white border border-gray-300 hover:border-gray-400 w-min rounded-xl text-black transition-colors"
                name={`educationDetails.${index}.location`}
                type="text"
                placeholder="Enter location..."
                {...register(`educationDetails.${index}.location`, {
                  required: true,
                  validate: (value) =>
                    value.trim().length > 0 || "phone number cannot be empty",
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "location",
                      e.target.value,
                      "educationDetails"
                    ),
                })}
              />
              {errors.educationDetails?.[index]?.location && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Location is required
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`educationDetails.${index}.year`}
              >
                Year
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center bg-white border border-gray-300 hover:border-gray-400 w-min rounded-xl text-black transition-colors"
                name={`educationDetails.${index}.year`}
                type="text"
                placeholder="2023-2025"
                {...register(`educationDetails.${index}.year`, {
                  required: true,
                  validate: (value) =>
                    value.trim().length > 0 || "phone number cannot be empty",
                  onChange: (e) =>
                    handleInputChange(
                      index,
                      "year",
                      e.target.value,
                      "educationDetails"
                    ),
                })}
              />
              {errors.educationDetails?.[index]?.year && (
                <p className="text-red-400 mt-1">
                  <i className="mr-1 ri-alert-line"></i>Year is required
                </p>
              )}
            </div>
          </div>

          {educationDetails.length > 1 && (
            <button
              type="button"
              onClick={() => handleDelete(detail.id, "educationDetails")}
              className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 mx-2 mt-5 bg-red-500 py-1 px-2 text-white rounded-md"
            >
              <i class="ri-delete-bin-6-line"></i>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => handleAddField("educationDetails")}
        className="transition-all hover:shadow-lg shadow-xl ease-in-out delay-50 hover:-translate-y-0 hover:scale-110 mx-2 mt-5 bg-black py-1 px-2 text-white text-md rounded-xl"
      >
        + Add field
      </button>
    </>
  );
}

export default EducationDetails;
