import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const About = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>ABOUT</h1>
      <p>{user.email}</p>
      <NavLink to="/planning/dashboard">Dashbaord</NavLink>
    </div>
  );
};

export default About;
