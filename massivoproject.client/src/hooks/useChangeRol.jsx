import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cambiarRolAPrestador, getUserById } from "../api/UserEndpoints";
import useSwalAlert from "./useSwalAlert";

const useChangeRol = (setUserData = null) => {
  const navigate = useNavigate();
  const { showAlert } = useSwalAlert();
  const userId = useSelector((state) => state.auth.userId);

  const handleCambiarRol = async () => {
    try {
      showAlert("¡Tu rol ha sido actualizado a Prestador!", "success");
      await cambiarRolAPrestador();
      if (setUserData) {
        const updatedUser = await getUserById(userId);
        setUserData(updatedUser);
      }
      navigate("/add-vehicle");
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
      alert("Ocurrió un error al cambiar el rol.");
    }
  };

  return handleCambiarRol;
};

export default useChangeRol;
