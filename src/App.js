import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Loginpage from "./pages/login/Loginpage";
import Registerpage from "./pages/register/Registerpage";
import Navbar from "./components/Navbar";
import Profile from "./pages/profile/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchResults from "./pages/search/searchpage";
import AdminCategoryDashboard from "./pages/admin/AdminCategory";
import CategoryDetail from "./pages/category/CategoryDetail";
import AdminCategoryList from "./pages/admin/AdminPanel";
import Book from "./pages/book/Book";
import AdminBooked from "./pages/admin/AdminBooked";
import PaymentPage from "./pages/payment/Payment";
import AdminPage from "./pages/admin/AdminPage";
import TopCharts from "./pages/category/TopCharts";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/admin/category" element={<AdminCategoryDashboard />} />
        <Route path="/admin/list" element={<AdminCategoryList />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/book/bookeduser" element={<Book />} />
        <Route path="/book/adminbook" element={<AdminBooked />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/charts" element={<TopCharts />} />
      </Routes>
    </Router>
  );
}

export default App;
