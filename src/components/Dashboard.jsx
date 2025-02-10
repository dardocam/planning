import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import GitHubRepoTree from "./GitHubRepoTree";

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  return (
    <>
      <div>
        <h1>Bienvenido al Dashboard</h1>
        <p>Has iniciado sesión correctamente.{user.email}</p>
        <button onClick={logout}>{"Logout"}</button>
        <p></p>
        <NavLink to="/planning/about">About</NavLink>
      </div>
      <div>
        <GitHubRepoTree></GitHubRepoTree>
      </div>
    </>
  );
};

export default Dashboard;
