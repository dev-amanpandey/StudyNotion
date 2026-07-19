import React from "react"
import ContactUsForm from "./ContactUsForm"

const ContactForm = () => {
  return (
    <div className="rounded-xl bg-richblack-800 p-8 text-richblack-5 shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
      <h2 className="mb-6 text-3xl font-semibold">Send us a message</h2>
      <ContactUsForm />
    </div>
  )
}

export default ContactForm