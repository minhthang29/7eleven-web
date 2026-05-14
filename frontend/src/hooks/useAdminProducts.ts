import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNotification } from '../context/NotificationContext';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  deleted?: boolean;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { notify, confirm } = useNotification();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/products/all');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
      notify('Lỗi khi tải danh sách sản phẩm', 'error');
    }
  }, [notify]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name || form.name.trim().length < 3) {
      newErrors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
    } else {
      const isDuplicate = products.some(p => 
        p.name.toLowerCase() === form.name?.trim().toLowerCase() && p.id !== form.id
      );
      if (isDuplicate) {
        newErrors.name = 'Tên sản phẩm này đã tồn tại';
      }
    }
    
    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }
    
    if (form.stock !== undefined && (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock)))) {
      newErrors.stock = 'Số lượng tồn kho phải là số nguyên không âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notify('Vui lòng kiểm tra lại thông tin nhập vào', 'error');
      return;
    }

    try {
      if (form.id) {
        await api.put(`/products/${form.id}`, form);
        notify('Cập nhật thành công!', 'success');
      } else {
        await api.post('/products', form);
        notify('Thêm mới thành công!', 'success');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product', error);
      notify('Lỗi khi lưu sản phẩm', 'error');
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa sản phẩm này? Thao tác này có thể khôi phục lại sau.',
      confirmText: 'Xóa sản phẩm',
      cancelText: 'Quay lại',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${id}`);
          fetchProducts();
          notify('Đã ngừng sử dụng sản phẩm.', 'success');
        } catch (error) {
          console.error('Error deleting product', error);
          notify('Lỗi khi xóa sản phẩm', 'error');
        }
      }
    });
  };

  const handleRestore = (id: string) => {
    confirm({
      title: 'Khôi phục sản phẩm',
      message: 'Bạn có muốn khôi phục sản phẩm này về trạng thái đang bán không?',
      confirmText: 'Khôi phục ngay',
      cancelText: 'Hủy bỏ',
      type: 'info',
      onConfirm: async () => {
        try {
          await api.patch(`/products/${id}/restore`);
          fetchProducts();
          notify('Đã khôi phục sản phẩm thành công.', 'success');
        } catch (error) {
          console.error('Error restoring product', error);
          notify('Lỗi khi khôi phục sản phẩm.', 'error');
        }
      }
    });
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setModalMode('edit');
  };

  const handleShowDetails = (product: Product) => {
    setForm(product);
    setModalMode('view');
  };

  const openAddModal = () => {
    setForm({});
    setModalMode('add');
  };

  const closeModal = () => {
    setForm({});
    setErrors({});
    setModalMode(null);
  };

  return {
    products,
    modalMode,
    form,
    errors,
    handleChange,
    handleSubmit,
    handleDelete,
    handleRestore,
    handleEdit,
    handleShowDetails,
    openAddModal,
    closeModal
  };
};
