import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

const toDateInputValue = (value) => {
  if (!value) return ""
  const dayFirstDate = typeof value === "string" && value.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (dayFirstDate) {
    return `${dayFirstDate[3]}-${dayFirstDate[2]}-${dayFirstDate[1]}`
  }
  const parsedDate = new Date(value)
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().slice(0, 10)
}

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    values: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      dateOfBirth: toDateInputValue(user?.additionalDetails?.dateOfBirth),
      gender: user?.additionalDetails?.gender ?? "",
      contactNumber: user?.additionalDetails?.contactNumber ?? "",
      about: user?.additionalDetails?.about ?? "",
    },
  })

  const submitProfileForm = async (data) => {
    await dispatch(updateProfile(token, data))
  }

  const fieldClass = "form-style w-full"
  const labelClass = "text-richblack-25 font-medium"

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "Please enter your first name." }}
              render={({ field }) => <input {...field} id="firstName" type="text" placeholder="Enter first name" className={fieldClass} />}
            />
            {errors.firstName && <span className="-mt-1 text-[12px] text-yellow-100">{errors.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className={labelClass}>Last Name</label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Please enter your last name." }}
              render={({ field }) => <input {...field} id="lastName" type="text" placeholder="Enter last name" className={fieldClass} />}
            />
            {errors.lastName && <span className="-mt-1 text-[12px] text-yellow-100">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{ max: { value: new Date().toISOString().slice(0, 10), message: "Date of Birth cannot be in the future." } }}
              render={({ field }) => <input {...field} id="dateOfBirth" type="date" className={fieldClass} />}
            />
            {errors.dateOfBirth && <span className="-mt-1 text-[12px] text-yellow-100">{errors.dateOfBirth.message}</span>}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className={labelClass}>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select {...field} id="gender" className={fieldClass}>
                  <option value="">Select gender</option>
                  {genders.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
                </select>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contactNumber" className={labelClass}>Contact Number</label>
            <Controller
              name="contactNumber"
              control={control}
              rules={{
                validate: (value) => !value || (value.length >= 10 && value.length <= 12) || "Invalid Contact Number",
              }}
              render={({ field }) => <input {...field} id="contactNumber" type="tel" placeholder="Enter contact number" className={fieldClass} />}
            />
            {errors.contactNumber && <span className="-mt-1 text-[12px] text-yellow-100">{errors.contactNumber.message}</span>}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className={labelClass}>About</label>
            <Controller
              name="about"
              control={control}
              render={({ field }) => <textarea {...field} id="about" placeholder="Enter bio details" className={`${fieldClass} min-h-[100px] resize-y`} />}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => navigate("/dashboard/my-profile")} className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50">
          Cancel
        </button>
        <IconBtn type="submit" text={isSubmitting ? "Saving..." : "Save"} disabled={isSubmitting} />
      </div>
    </form>
  )
}
