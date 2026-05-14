import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminProducts from './pages/AdminProducts';
import UserCatalog from './pages/UserCatalog';
import AdminOrders from './pages/AdminOrders'; 
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="container">
          <h1 style={{color: 'var(--primary-color)', fontSize: 28, textAlign: 'center'}}>7-Eleven Manager</h1>
          <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <Link to="/">Danh sách sản phẩm (User)</Link>
            <Link to="/admin/products">Quản lý sản phẩm (Admin)</Link>
            <Link to="/admin/orders">Đơn hàng (Admin)</Link>
          </nav>

          <Routes>
            <Route path="/" element={<UserCatalog />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
