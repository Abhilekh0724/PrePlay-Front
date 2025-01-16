import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faSearch,
  faHome,
  faBookmark,
  faStore,
  faChartLine,
  faCog,
  faClipboardList,
  faGamepad,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from 'bootstrap';
import Logo from './Logo';

const bgColor = "#0a0a0a";

const sidebarStyle = {
  position: "fixed",
  top: "0",
  left: 0,
  width: "260px",
  height: "100vh",
  backgroundColor: bgColor,
  borderRight: "none",
  zIndex: 1010,
  padding: "70px 0 0 0",
  color: "#fff",
  transition: "all 0.3s ease"
};

const sidebarLinkStyle = {
  color: "#fff",
  padding: "15px 20px",
  display: "block",
  textDecoration: "none",
  margin: "5px 15px",
  transition: "all 0.3s ease",
  textAlign: "left",
  backgroundColor: "transparent",
  border: "none"
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [searchQuery, setSearchQuery] = useState("");

  const showNavbar = location.pathname !== "/login" && location.pathname !== "/register";

  useEffect(() => {
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new Dropdown(dropdownToggleEl));

    return () => {
      dropdownList.forEach(dropdown => dropdown?.dispose?.());
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleHoverEnter = (e) => {
    e.target.style.backgroundColor = "#00ff00";
    e.target.style.color = "#000";
    e.target.style.borderColor = "#00ff00";
  };

  const handleHoverLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#fff";
    e.target.style.borderColor = "#333";
  };

  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.isAdmin === true;
  };

  const renderDropdownMenu = () => {
    if (!user) return null;

    return (
      <div className="dropdown">
        <button
          className="btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#fff"
          }}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          <FontAwesomeIcon icon={faUser} className="me-2" />
          {`${user.firstName} ${user.lastName}`}
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          style={{
            backgroundColor: "#000",
            border: "1px solid #333"
          }}
        >
          <li>
            <Link 
              className="dropdown-item" 
              to="/profile" 
              style={{ color: "#fff" }}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Profile
            </Link>
          </li>

          {isAdmin() && (
            <>
              <li>
                <Link 
                  className="dropdown-item" 
                  to="/admin" 
                  style={{ color: "#fff" }}
                  onMouseEnter={handleHoverEnter}
                  onMouseLeave={handleHoverLeave}
                >
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link 
                  className="dropdown-item" 
                  to="/admin-booked" 
                  style={{ color: "#fff" }}
                  onMouseEnter={handleHoverEnter}
                  onMouseLeave={handleHoverLeave}
                >
                  <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                  Admin Booked
                </Link>
              </li>
              <li>
                <Link 
                  className="dropdown-item" 
                  to="/admin-category" 
                  style={{ color: "#fff" }}
                  onMouseEnter={handleHoverEnter}
                  onMouseLeave={handleHoverLeave}
                >
                  <FontAwesomeIcon icon={faGamepad} className="me-2" />
                  Admin Category
                </Link>
              </li>
            </>
          )}

          <li><hr className="dropdown-divider" style={{ borderColor: "#333" }} /></li>
          <li>
            <button 
              className="dropdown-item" 
              onClick={handleLogout}
              style={{ color: "#fff" }}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {showNavbar && (
        <div className="navbar-container">
          <nav className="navbar navbar-dark fixed-top" style={{
            height: "70px",
            backgroundColor: bgColor,
            borderBottom: "none",
            zIndex: 1030,
            padding: 0
          }}>
            <div className="container-fluid d-flex justify-content-between align-items-center" 
              style={{ padding: "0 20px", backgroundColor: bgColor }}>
              <Link to="/" className="navbar-brand" style={{ margin: 0 }}>
                <Logo width="150px" />
              </Link>

              <form className="d-flex" style={{ flex: 1, margin: "0 30px" }} onSubmit={handleSearch}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "20px 0 0 20px",
                    color: '#fff',
                    padding: "10px 20px"
                  }}
                />
                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderLeft: "none",
                    borderRadius: "0 20px 20px 0",
                    color: '#999',
                    padding: "10px 20px"
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#00ff00";
                    e.target.style.color = "#000";
                    e.target.style.borderColor = "#00ff00";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "#1a1a1a";
                    e.target.style.color = "#999";
                    e.target.style.borderColor = "#333";
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>

              <div className="d-flex align-items-center">
                {user ? (
                  <>
                    {renderDropdownMenu()}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="btn"
                    style={{
                      backgroundColor: "#00ff00",
                      color: "#000",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      fontWeight: "bold"
                    }}
                    onMouseEnter={e => {
                      e.target.style.backgroundColor = "#00cc00";
                    }}
                    onMouseLeave={e => {
                      e.target.style.backgroundColor = "#00ff00";
                    }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </nav>

          <div style={{ ...sidebarStyle, backgroundColor: bgColor }}>
            <ul className="nav flex-column" style={{ margin: 0, padding: "10px", borderTop: "none", backgroundColor: bgColor }}>
              {[
                { to: "/", icon: faHome, text: "Home" },
                { to: "/prebook", icon: faBookmark, text: "Pre-Book" },
                { to: "/buy", icon: faShoppingCart, text: "Buy" },
                { to: "/store", icon: faStore, text: "Store" },
                { to: "/charts", icon: faChartLine, text: "Top Charts" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    style={sidebarLinkStyle}
                    onMouseEnter={handleHoverEnter}
                    onMouseLeave={handleHoverLeave}
                  >
                    <FontAwesomeIcon icon={item.icon} className="me-2" />
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
