import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { useAuth } from "./useAuth";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const auth = useAuth();
    return (_jsx(AuthContext.Provider, { value: auth, children: children }));
}
export const useAuthContext = () => useContext(AuthContext);
