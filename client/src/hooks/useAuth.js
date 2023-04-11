import { useContext } from "react";
import { AuthContext } from "../Context/jwtAuthContext";

export const useAuth = () => useContext(AuthContext);