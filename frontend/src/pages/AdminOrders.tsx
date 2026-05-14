import { useState, useEffect } from 'react';
import api from '../api';
import { formatVND } from '../utils/format';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th>Tổng số tiền</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {o.items.map((item, index) => (
                    <li key={index}>{item.productName} (x{item.quantity})</li>
                  ))}
                </ul>
              </td>
              <td><span style={{ padding: '0.4rem 0.8rem', background: o.status === 'COMPLETED' ? 'var(--primary-color)' : 'var(--accent-color)', color: '#fff', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{o.status}</span></td>
              <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              <td style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>{formatVND(o.totalAmount)}</td>
            </tr>
          ))}
      </tbody>
    </table>
    </div >
  );
}
