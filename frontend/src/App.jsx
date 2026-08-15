import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBook from "./pages/AddBook";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import EditBook from "./pages/EditBook";
import Dashboard from "./pages/Dashboard";
import BookShelfAI from "./pages/BookShelfAI";

function App() {
  return (
    <BrowserRouter>
      <div className="luxury-shell">
        <Navbar />

        <main className="luxury-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <BookShelfAI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/add"
              element={
                <ProtectedRoute>
                  <AddBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute>
                  <EditBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
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
