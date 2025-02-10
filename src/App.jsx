// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../src/services/firebase/firebaseConfig";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./middleware/ProtectedRoute";
import About from "./components/About";
function App() {
  // const collectionName = "ppm";
  // const data = {
  //   id: 222,
  //   name: "gitpages",
  // };

  // const createDocument = async (data) => {
  //   try {
  //     const docRef = await addDoc(collection(db, collectionName), data);
  //     console.log("Documento agregado con ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error al agregar documento: ", e);
  //   }
  // };
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/planning" element={<Login />} />
          <Route
            path="/planning/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planning/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
