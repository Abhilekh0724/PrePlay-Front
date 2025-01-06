// // context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Example function to fetch user data
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch('/api/auth/me'); // Endpoint to get logged-in user
//         const data = await response.json();
//         setUser(data.user);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
