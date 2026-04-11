import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="fixed top-0 w-full bg-black text-white flex justify-between p-3 z-50">
      <h1 className="font-bold">ReelBite 🍔</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}