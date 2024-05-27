import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProductDetails from './components/ProductDetails';
import MyOrders from './components/MyOrders';
import OrderDetails from './components/OrderDetails';
import NewOrder from './pages/NewOrder';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/*" element={<Shop />} />
        <Route path="/shop/product/*" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/neworder" element={<NewOrder />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<MyOrders />} />
        <Route path="/profile/orders/*" element={<OrderDetails />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
