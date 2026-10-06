import { useEffect, useRef, useState } from "react"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
  required = true,
  accept,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedPdfTypes = [
        "application/pdf",
        "application/x-pdf",
        "application/octet-stream",
        "",
      ]
      const isPdf = /\.pdf$/i.test(file.name) && allowedPdfTypes.includes(file.type)
      if (accept?.includes("pdf") && !isPdf) {
        event.target.value = ""
        return
      }
      previewFile(file)
      setSelectedFile(file)
      setValue(name, file, { shouldDirty: true, shouldValidate: true })
    }
  }

  useEffect(() => {
    register(name, { required })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, required])

  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {required && !viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className="flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 bg-richblack-700"
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {video ? (
              <video
                controls
                className="h-full w-full rounded-md object-cover"
                src={previewSource}
              />
            ) : accept?.includes("pdf") ? (
              <a href={previewSource} target="_blank" rel="noreferrer" className="text-yellow-50 underline">
                {selectedFile
                  ? `${selectedFile.name} selected (save the lecture to upload)`
                  : "View saved lecture notes"}
              </a>
            ) : (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-6"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              id={name}
              name={name}
              type="file"
              accept={accept ?? (video ? "video/*" : "image/*")}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop a {accept?.includes("pdf") ? "PDF" : video ? "video" : "image"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            {!accept?.includes("pdf") && (
              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
              </ul>
            )}
          </div>
        )}
      </div>
      {errors[name] && required && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
