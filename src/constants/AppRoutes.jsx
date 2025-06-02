import SignIn from "../auth/SignIn.jsx";
import SignUp from "../auth/SignUp.jsx";
import Landing from "../pages/Landing.jsx";
import Templates from "../components/Templates/Templates.jsx";
import Builder from "../components/Builder/Builder.jsx";
import User from "../components/UserPage/User.jsx";
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import Contact from "../pages/Contact.jsx";
import Preview from "../components/PreviewPage/Preview.jsx";
import NotFound from "../pages/NotFound.jsx";
import About from "../pages/About.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ScrollTop } from "../utils/helpers.js";

const ProtectedRoutesWrapper = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Landing />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutesWrapper />}>
          <Route path="/select_template" element={<Templates />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/user" element={<User />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollTop />
    </Router>
  );
}

export default AppRoutes;
