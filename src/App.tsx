import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import ProductList from "./pages/ProductListPage";
import Cart from "./pages/CartPage";
import Navbar from "./pages/NavbarPage";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};

export default App;
