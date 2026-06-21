// Router import
import {BrowserRouter, Routes, Route} from "react-router-dom";
// layout import
import Layout from "./layouts/Layout";
// Pages import
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import AddBlog from "./pages/AddBlog";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// Auth import
import Login from "./auth/Login";
import Register from "./auth/Register";
// Route guard import
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
 return (
  <>
  <BrowserRouter>
  <Routes>
   <Route path ="/" element={<Layout />}>
     <Route path ="" element={<Home />}/>
     <Route path ="about" element={<About />}/>
     <Route path ="blogs" element={<Blogs />}/>
     <Route path ="blog/:id" element={<BlogDetail />}/>
     <Route path ="addblog" element={<ProtectedRoute><AddBlog /></ProtectedRoute>}/>
     <Route path ="edit-blog/:id" element={<ProtectedRoute><AddBlog /></ProtectedRoute>}/>
     <Route path ="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
     <Route path ="login" element={<Login />}/>
     <Route path ="register" element={<Register/>}/>
     <Route path ="*" element={<NotFound />}/>
   </Route>  
  </Routes>
  </BrowserRouter>
  </>
 )
}

export default App;

