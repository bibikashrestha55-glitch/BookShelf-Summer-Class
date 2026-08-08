import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBook from "./pages/AddBook";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import EditBook from "./pages/EditBook";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-100">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/books/:id/edit" element={<EditBook />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
