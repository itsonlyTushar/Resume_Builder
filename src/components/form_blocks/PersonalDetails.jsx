import React from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFields,
} from "../../features/templateSlice";

function PersonalDetails() {
  const dispatch = useDispatch();
  const personalDetails = useSelector(
    (state) => state.resumeBuilder.form_data.personalDetails
  );
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleChange = (index, field, value, arrState) => {
    dispatch(updateFields({ index, field, value, arrState }));
  };


  return (
    <>
      <h1 className="mb-7 sm:text-5xl text-3xl font-semibold ml-2">
        Personal Details
      </h1>

      {personalDetails.map((detail, index) => (
        <div key={detail.id}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label  
                className="text-black font-bold text-md"
                htmlFor={`personalDetails.${index}.firstName`}
              >
                First Name
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`personalDetails.${index}.firstName`}
                type="text"
                placeholder="Enter first name..."
                {...register(`personalDetails.${index}.firstName`, {
                  required: true,
                  maxLength: 20,
                  validate: (value) =>
                    value.trim().length > 0 || "First name cannot be empty",
                  onChange: (e) =>
                    handleChange(
                      index,
                      "firstName",
                      e.target.value,
                      "personalDetails"
                    ),
                })}
              />
              {errors.personalDetails?.[index]?.firstName && (
                <p className="text-red-400 mt-1">
                  <i
                    data-cy='red-error'
                    className="mr-1 ri-alert-line"></i>First name is required
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`personalDetails.${index}.lastName`}
              >
                Last Name
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`personalDetails.${index}.lastName`}
                type="text"
                placeholder="Enter last name..."
                {...register(`personalDetails.${index}.lastName`, {
                  required: true,
                  maxLength: 10,
                  validate: (value) =>
                    value.trim().length > 0 || "last name cannot be empty",
                  onChange: (e) =>
                    handleChange(
                      index,
                      "lastName",
                      e.target.value,
                      "personalDetails"
                    ),
                })}
              />
              {errors.personalDetails?.[index]?.lastName && (
                <p className="text-red-400 mt-1">
                  <i
                    data-cy='red-error' 
                    className="mr-1 ri-alert-line"></i>Last name is required
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`personalDetails.${index}.email`}
              >
                Email
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`personalDetails.${index}.email`}
                type="email"
                placeholder="email..."
                {...register(`personalDetails.${index}.email`, {
                  required: {
                    value: true,
                    message: (
                      <p>
                        <i className="mr-1 ri-alert-line"></i>Email is required
                      </p>
                    ),
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "email cannot be empty",
                  onChange: (e) =>
                    handleChange(
                      index,
                      "email",
                      e.target.value,
                      "personalDetails"
                    ),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: (
                      <p>
                        <i className="mr-1 ri-alert-line"></i>Invalid email
                        address
                      </p>
                    ),
                  },
                })}
              />
              {errors.personalDetails?.[index]?.email && (
                <p
                data-cy='red-error' 
                className="text-red-400 mt-1">
                  {errors.personalDetails?.[index]?.email.message}
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`personalDetails.${index}.phoneNumber`}
              >
                Phone Number
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`personalDetails.${index}.phoneNumber`}
                type="text"
                placeholder="number..."
                {...register(`personalDetails.${index}.phoneNumber`, {
                  required: true,
                  
                  validate: (value) =>
                    value.trim().length > 0 || "phone number cannot be empty",
                  onChange: (e) =>
                    handleChange(
                      index,
                      "phoneNumber",
                      e.target.value,
                      "personalDetails"
                    ),
                })}
              />
              {errors.personalDetails?.[index]?.phoneNumber && (
                <p className="text-red-400 mt-1">
                  <i
                    data-cy='red-error' 
                    className="mr-1 ri-alert-line"></i>Contact is required
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`personalDetails.${index}.linkedin`}
              >
                Linkedin
              </label>
              <input
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`personalDetails.${index}.linkedin`}
                type="url"
                placeholder="Enter url..."
                {...register(`personalDetails.${index}.linkedin`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0 || "Enter a valid input";
                  },
                  onChange: (e) =>
                    handleChange(
                      index,
                      "linkedin",
                      e.target.value,
                      "personalDetails"
                    ),
                })}
              />
              {errors.personalDetails?.[index]?.linkedin && (
                <p className="text-red-400 mt-1">
                  <i 
                    data-cy='red-error'
                    className="mr-1 ri-alert-line"></i>Enter a Valid Input
                </p>
              )}
            </div>

            <div className="p-2 ml-2">
              <label
                className="text-black font-bold text-md"
                htmlFor={`personalDetails.${index}.about`}
              >
                About
              </label>
              <textarea
                className="outline-none mt-1 p-3 flex items-center border-none shadow-md w-min rounded-xl text-gray-700"
                name={`personalDetails.${index}.about`}
                type="text"
                placeholder="Something about yourself.."
                {...register(`personalDetails.${index}.about`, {
                  required: false,
                  validate: (value) => {
                    if (value === "") return true;
                    return value.trim().length > 0 || "Enter a valid input";
                  },

                  onChange: (e) =>
                    handleChange(
                      index,
                      "about",
                      e.target.value,
                      "personalDetails"
                    ),
                })}
              />
              {errors.personalDetails?.[index]?.about && (
                <p className="text-red-400 mt-1">
                  <i
                  data-cy='red-error'
                  className="mr-1 ri-alert-line"></i>Enter a Valid Input
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default PersonalDetails;
