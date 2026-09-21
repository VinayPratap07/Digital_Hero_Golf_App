import { Outlet } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
