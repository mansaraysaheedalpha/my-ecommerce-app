import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import ProductList from "./pages/ProductListPage";
import Cart from "./pages/CartPage";
import MainLayout from "./components/Layout/MainLayout";
import NotFound from "./pages/NotFoundPage";
import ProductDetails from "./pages/ProductDetailsPage";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
