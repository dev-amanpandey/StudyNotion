import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (!add) {
      setValue("title", modalData?.title ?? "")
      setValue("timeDuration", modalData?.timeDuration ?? "")
      setValue("description", modalData?.description ?? "")
    }
  }, [add, modalData, setValue])

  const closeModal = () => setModalData(null)

  const updateCourse = (updatedSection) => {
    const updatedCourseContent = course.courseContent.map((section) =>
      section._id === updatedSection._id ? updatedSection : section
    )
    dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
  }

  const onSubmit = async (data) => {
    if (view) {
      closeModal()
      return
    }

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("timeDuration", data.timeDuration)
    formData.append("description", data.description)

    if (data.videoFile) {
      formData.append("videoFile", data.videoFile)
    }

    if (add) {
      formData.append("sectionId", modalData)
    } else {
      formData.append("sectionId", modalData?.sectionId)
      formData.append("subSectionId", modalData?._id)
    }

    const result = add
      ? await createSubSection(formData, token)
      : await updateSubSection(formData, token)

    if (result) {
      updateCourse(result)
      closeModal()
    }
  }

  const heading = add ? "Add Lecture" : view ? "Lecture Details" : "Edit Lecture"

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">{heading}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="title">
              Lecture Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="title"
              disabled={view}
              placeholder="Enter lecture title"
              {...register("title", { required: true })}
              className="form-style w-full"
            />
            {errors.title && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="timeDuration">
              Lecture Duration <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="timeDuration"
              disabled={view}
              placeholder="Enter lecture duration"
              {...register("timeDuration", { required: true })}
              className="form-style w-full"
            />
            {errors.timeDuration && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture duration is required
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="description">
              Lecture Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="description"
              disabled={view}
              placeholder="Enter lecture description"
              {...register("description", { required: true })}
              className="form-style min-h-[120px] w-full resize-x-none"
            />
            {errors.description && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture description is required
              </span>
            )}
          </div>

          <Upload
            name="videoFile"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData?.videoUrl : null}
            editData={edit ? modalData?.videoUrl : null}
            required={!edit && !view}
          />

          <div className="flex items-center justify-end gap-x-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md bg-richblack-600 px-5 py-2 font-semibold text-richblack-25"
            >
              Cancel
            </button>
            {!view && <IconBtn type="submit" text={add ? "Save Lecture" : "Update Lecture"} />}
          </div>
        </form>
      </div>
    </div>
  )
}