import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LinkList from "../components/LinkList";
import LinkDetail from "../components/LinkDetail";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LinkList />} />
        <Route path="/link/:id" element={<LinkDetail />} />
      </Routes>
    </Router>
  );
}
