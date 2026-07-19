import "./App.css";
import {Route, Routes} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Cart from "./components/core/Dashboard/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Settings from "./components/core/Dashboard/Settings";
import AddCourses from "./components/core/Dashboard/AddCourses";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import { ACCOUNT_TYPE } from "./utils/constants";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import ViewCourse from "./pages/ViewCourse";
//import InstructorDashboard from "./pages/InstructorDashboard";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {
  const { user } = useSelector((state) => state.profile);
  // const location = useLocation();
  // const isInstructorDashboard = location.pathname === "/" || location.pathname === "/instructor-dashboard";

  return (
    <div className = "w-screen min-h-screen bg-richblack-900 flex flex-col front-inter">

      {<Navbar/>}
      <Routes>
       {/* <Route path = "/" element = {<InstructorDashboard/>}/>*/}
       { /*<Route path = "/instructor-dashboard" element = {<InstructorDashboard/>}/>*/}
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/catalog/:catalogName" element = {<Catalog/>}/>
        <Route path = "/courses/:courseId" element = {<CourseDetails/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/signup" element = {<Signup/>}/>
        <Route path = "/verify-email" element = {<VerifyEmail/>}/>
        <Route path = "/forgot-password" element = {<ForgotPassword/>}/>
        <Route path = "/reset-password/:id" element = {<UpdatePassword/>}/>
        <Route path = "/update-password/:id" element = {<UpdatePassword/>}/>
        <Route path = "/about" element = {<About/>}/>
        <Route path = "/contact" element = {<Contact/>}/>
        <Route
          path="view-course/:courseId"
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          <Route
            path="section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
        </Route>
        <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/cart" element={<Cart />} />

      {/* <Route path="dashboard/settings" element={<Settings />} />
      <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} /> */}
      {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                 <Route path="dashboard/settings" element={<Settings />} />
      <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
      
                </>
              )
            }
            {
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                <Route path="dashboard/instructor" element={<Instructor />}/>
                 <Route path="dashboard/add-course" element={<AddCourses/>} />
                 {/* <Route path="dashboard/add-courses" element={<AddCourses/>} /> */}
                  <Route path="dashboard/my-courses" element={<MyCourses/>} /> 
                                    <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} /> 
                                    <Route path="dashboard/settings" element={<Settings />} />
                </>
              )
            }



        </Route>
      </Routes>
    </div>
  );
}

export default App;
