import { useState } from "react";
import useSwalAlert from "../hooks/useSwalAlert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { showAlert } = useSwalAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:7089/api/authentication/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        showAlert(
          "Si el correo está registrado, se enviará un email para restablecer la contraseña."
        );
      } else {
        showAlert("Ocurrió un error al procesar la solicitud.", "error");
      }
    } catch (error) {
      showAlert("Error de conexión con el servidor", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Recuperar contraseña</h2>
      <input
        type="email"
        placeholder="Ingresá tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default ForgotPassword;
