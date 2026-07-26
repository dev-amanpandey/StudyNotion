import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  DELETE_PROFILE_API,
  CHANGE_PASSWORD_API,
} = endpoints

const authConfig = (token) => ({
  Authorization: `Bearer ${token}`,
})

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating display picture...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          ...authConfig(token),
        }
      )

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Unable to update image")
      }

      toast.success("Display picture updated successfully")
      if (response?.data?.data) {
        dispatch(setUser(response.data.data))
        localStorage.setItem("user", JSON.stringify(response.data.data))
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Could not update display picture"
      )
    }
    toast.dismiss(toastId)
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        formData,
        {
          ...authConfig(token),
        }
      )

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Unable to update profile")
      }

      const updatedUser = response?.data?.user
      if (!updatedUser) {
        const storedUser = JSON.parse(localStorage.getItem("user")) || {}
        const profileDetails = response?.data?.profileDetails
        if (!profileDetails) {
          throw new Error("Updated user data was not returned")
        }

        // Supports a server that has not yet been restarted after the API
        // response was upgraded to return the complete user object.
        const legacyUpdatedUser = {
          ...storedUser,
          additionalDetails: profileDetails,
        }
        dispatch(setUser(legacyUpdatedUser))
        localStorage.setItem("user", JSON.stringify(legacyUpdatedUser))
        toast.success("Profile updated successfully")
        return legacyUpdatedUser
      }

      dispatch(setUser(updatedUser))
      localStorage.setItem("user", JSON.stringify(updatedUser))
      toast.success("Profile updated successfully")
      return updatedUser
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Could not update profile"
      )
      return null
    } finally {
      toast.dismiss(toastId)
    }
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting account...")
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_PROFILE_API,
        null,
        {
          ...authConfig(token),
        }
      )

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Unable to delete account")
      }

      dispatch(setUser(null))
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      toast.success("Account deleted successfully")
      navigate("/")
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Could not delete account"
      )
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, data) {
  const toastId = toast.loading("Updating password...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, data, {
      ...authConfig(token),
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unable to change password")
    }

    toast.success("Password updated successfully")
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Could not change password"
    )
  }
  toast.dismiss(toastId)
}
