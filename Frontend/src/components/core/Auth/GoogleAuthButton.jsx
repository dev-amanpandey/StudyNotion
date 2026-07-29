import { GoogleLogin } from "@react-oauth/google"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { googleLogin } from "../../../services/operations/authAPI"

function GoogleAuthButton({ accountType }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

  if (!clientId) {
    return null
  }

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-richblack-700" />
        <span className="text-xs uppercase tracking-wider text-richblack-300">or</span>
        <span className="h-px flex-1 bg-richblack-700" />
      </div>
      <div className="flex justify-center rounded-[8px] bg-white py-1 transition-shadow hover:shadow-md">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              toast.error("Google did not return a sign-in credential")
              return
            }
            dispatch(googleLogin(credentialResponse.credential, navigate, accountType))
          }}
          onError={() => toast.error("Google sign-in was cancelled or could not be completed")}
          text="continue_with"
          theme="outline"
          shape="rectangular"
          width="300"
        />
      </div>
    </div>
  )
}

export default GoogleAuthButton
