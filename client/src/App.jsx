// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BikeDetail from './pages/BikeDetail';
import Checkout from './pages/Checkout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bike-detail/:id" element={<BikeDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/history" element={<h2>Admin History Page</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;