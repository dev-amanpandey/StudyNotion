export const formatDate = (dateString) => {
    // Older Course documents may not have timestamps. A MongoDB ObjectId
    // stores its creation timestamp in the first four bytes, so use it as a
    // backwards-compatible fallback.
    let value = dateString
    if (typeof dateString === "string" && /^[a-f\d]{24}$/i.test(dateString)) {
      value = new Date(parseInt(dateString.slice(0, 8), 16) * 1000)
    }

    const options = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Date unavailable"
    const formattedDate = date.toLocaleDateString("en-US", options)
  
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const period = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    const formattedTime = `${formattedHour}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`
  
    return `${formattedDate} | ${formattedTime}`
  }
