import { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../services/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [invalidUserMessage, setInvalidUserMessage] = useState(null);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    if (user != null) {
      navigate("/planning/dashboard");
    }
  });
  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const sigIn = async (email, passw) => {
    await signInWithEmailAndPassword(auth, email, passw)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        login(user);
        navigate("/planning/dashboard");
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        console.log(error.message);
        setInvalidUserMessage("Invalid User");
        setTimeout(() => {
          setInvalidUserMessage(null);
        }, 5000);
      });
  };

  // Función que se ejecuta al enviar el formulario
  //dardocam@gmail.com
  //dardocam@1234
  const handleSubmit = (values, { setSubmitting }) => {
    // console.log("Datos enviados:", values);
    sigIn(values.email, values.password);
    setSubmitting(false); // Finaliza el estado de envío
  };

  return (
    <div
      className="loginForm"
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "40px",
        border: "1px solid gray",
        borderRadius: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>Login</h2>
      <p style={{ color: "red" }}>{invalidUserMessage}</p>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Campo de correo */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="email">Correo:</label>
              <Field
                id="email"
                name="email"
                type="email"
                style={{
                  display: "block",
                  width: "400px",
                  height: "20px",
                  padding: "8px",
                  borderRadius: "18px",
                }}
              />
              <ErrorMessage
                name="email"
                component="span"
                style={{ color: "red" }}
              />
            </div>

            {/* Campo de contraseña */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="password">Contraseña:</label>
              <Field
                id="password"
                name="password"
                type="password"
                style={{
                  display: "block",
                  width: "400px",
                  height: "20px",
                  padding: "8px",
                  borderRadius: "18px",
                }}
              />
              <ErrorMessage
                name="password"
                component="span"
                style={{ color: "red" }}
              />
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 15px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isSubmitting ? "Enviando..." : "Iniciar sesión"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
