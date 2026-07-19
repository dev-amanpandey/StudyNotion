import React from "react"

const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-8 text-richblack-5 shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-yellow-50">
          Contact Us
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Talk to our team</h2>
      </div>

      <div className="flex flex-col gap-4 text-richblack-200">
        <div>
          <p className="text-sm text-richblack-400">Email</p>
          <p className="text-lg">support@studynotion.com</p>
        </div>
        <div>
          <p className="text-sm text-richblack-400">Phone</p>
          <p className="text-lg">+91 12345 67890</p>
        </div>
        <div>
          <p className="text-sm text-richblack-400">Address</p>
          <p className="text-lg">
            StudyNotion HQ, Innovation Park, Bengaluru, India
          </p>
        </div>
      </div>

      <p className="text-sm leading-6 text-richblack-300">
        We usually respond within one business day. If you are reaching out
        about admissions, partnerships, or support, include a few details so we
        can route your message quickly.
      </p>
    </div>
  )
}

export default ContactDetails