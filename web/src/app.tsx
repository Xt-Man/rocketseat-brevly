import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Redirect from "./pages/Redirect";
import { ToastContainer } from "react-toastify";


export function App() {


  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/:shortUrl" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  )
}


