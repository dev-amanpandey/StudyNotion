import React from "react"
import ContactUsForm from "../../common/ContactPage/ContactUsForm";

const ContactFormSection = ()=>{
    return (
        <div className="w-full max-w-3xl rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-xl md:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-50">Contact us</p>
            <h1 className="text-3xl font-semibold text-richblack-5">Get in touch</h1>
            <p className="mt-3 max-w-2xl leading-7 text-richblack-300">
                Have a question, idea, or need a little help? Send us a message and our team will be glad to help.
            </p>
            <div className="mt-8">
                <ContactUsForm/>
            </div>

        </div>
    )
}

export default ContactFormSection
