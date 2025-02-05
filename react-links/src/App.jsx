import { Routes, Route, Link } from "react-router-dom";
import LinkList from "./components/LinkList";
import LinkDetail from "./components/LinkDetail";

function App() {
  return (
    <div className="cont">
      <h1>Gestor de Enlaces</h1>
      <nav>
        <Link to="/">Inicio</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LinkList />} />
        <Route path="/link/:id" element={<LinkDetail />} />
      </Routes>
    </div>
  );
}

export default App;
