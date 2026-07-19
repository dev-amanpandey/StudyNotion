import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/common/ContactPage/ContactDetails"
import ContactForm from "../components/common/ContactPage/ContactForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <section className="mx-auto my-20 w-11/12 max-w-maxContent rounded-2xl border border-richblack-700 bg-richblack-800/50 px-5 py-12 text-white shadow-xl md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-50">
            Learner stories
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Reviews from other learners
          </h1>
          <p className="mt-4 text-richblack-300">
            See how StudyNotion is helping learners build skills with confidence.
          </p>
        </div>
        <ReviewSlider />
      </section>
      <Footer />
    </div>
  )
}

export default Contact
