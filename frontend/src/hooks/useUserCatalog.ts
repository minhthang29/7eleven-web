import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNotification } from '../context/NotificationContext';
import { formatVND } from '../utils/format';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export const useUserCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { notify, confirm } = useNotification();

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
      notify('Lỗi khi tải danh sách sản phẩm', 'error');
    }
  }, [notify]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        notify(`Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho.`, 'warning');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock < 1) {
        notify('Sản phẩm đã hết hàng.', 'warning');
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    if (newQuantity > item.stock) {
      notify(`Sản phẩm ${item.name} chỉ còn ${item.stock} trong kho.`, 'warning');
      return;
    }

    setCart(cart.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
  };

  const submitOrder = () => {
    confirm({
      title: 'Xác nhận đặt hàng',
      message: `Bạn có chắc muốn đặt đơn hàng này với tổng cộng ${formatVND(cartTotal)}?`,
      confirmText: 'Đặt hàng ngay',
      cancelText: 'Kiểm tra lại',
      type: 'info',
      onConfirm: async () => {
        const orderItems = cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        const order = {
          items: orderItems,
          totalAmount: cartTotal
        };

        try {
          await api.post('/orders', order);
          notify('Đặt hàng thành công!', 'success');
          setCart([]);
          fetchProducts();
          setIsCartOpen(false);
        } catch (error) {
          console.error('Error placing order', error);
          notify('Lỗi khi đặt hàng.', 'error');
        }
      }
    });
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return {
    products,
    cart,
    isCartOpen,
    totalCartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    submitOrder,
    toggleCart
  };
};
