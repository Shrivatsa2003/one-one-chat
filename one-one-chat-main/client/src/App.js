import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Chaty from "./Pages/Chaty";
import SetAvatar from "./Pages/Avatar";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chaty />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
