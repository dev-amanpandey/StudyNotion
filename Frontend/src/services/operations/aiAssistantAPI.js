import { apiConnector } from "../apiconnector"
import { aiEndpoints } from "../apis"

const { AI_CHAT_API } = aiEndpoints

export const sendTutorMessage = async (message, token, courseId) => {
  const payload = {
    message,
    ...(courseId ? { courseId } : {}),
  }

  const response = await apiConnector("POST", AI_CHAT_API, payload, {
    Authorization: `Bearer ${token}`,
  })

  if (!response?.data?.success || !response?.data?.data?.aiResponse) {
    throw new Error(response?.data?.message || "The AI tutor did not return a response")
  }

  return response.data.data.aiResponse
}
