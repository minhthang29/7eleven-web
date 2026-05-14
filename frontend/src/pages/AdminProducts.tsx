import { useAdminProducts } from '../hooks/useAdminProducts';
import { formatVND } from '../utils/format';
import './AdminProducts.css';

export default function AdminProducts() {
  const {
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
  } = useAdminProducts();

  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <h2>Quản lý sản phẩm</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Thêm sản phẩm
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ opacity: p.deleted ? 0.6 : 1 }}>
              <td>{p.name}</td>
              <td>{formatVND(p.price)}</td>
              <td>
                {p.stock === 0 ? (
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Hết hàng</span>
                ) : (
                  p.stock
                )}
              </td>
              <td>
                {p.deleted ? (
                  <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Ngừng bán</span>
                ) : (
                  <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Đang bán</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  {p.deleted ? (
                    <button 
                      className="btn btn-primary btn-small" 
                      onClick={() => handleRestore(p.id)}
                    >
                      Khôi phục
                    </button>
                  ) : (
                    <>
                      <button 
                        className="btn btn-small" 
                        onClick={() => handleShowDetails(p)} 
                        style={{ backgroundColor: '#6c757d', color: '#fff' }}
                      >
                        Chi tiết
                      </button>
                      <button 
                        className="btn btn-primary btn-small" 
                        onClick={() => handleEdit(p)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-danger btn-small" 
                        onClick={() => handleDelete(p.id)}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Chưa có sản phẩm nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalMode && (
        <div className="modal-overlay" onClick={modalMode === 'view' ? closeModal : undefined}>
          <div className="card modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === 'add' ? 'Thêm sản phẩm mới' : 
                 modalMode === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Chi tiết sản phẩm'}
              </h3>
              <button className="close-button" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input 
                  name="name" 
                  value={form.name || ''} 
                  onChange={handleChange} 
                  disabled={modalMode === 'view'}
                  className={modalMode === 'view' ? 'input-view-mode' : (errors.name ? 'input-error' : '')}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  name="description" 
                  value={form.description || ''} 
                  onChange={handleChange} 
                  disabled={modalMode === 'view'}
                  className={modalMode === 'view' ? 'input-view-mode' : ''}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VND)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={form.price || ''} 
                    onChange={handleChange} 
                    disabled={modalMode === 'view'}
                    className={modalMode === 'view' ? 'input-view-mode' : (errors.price ? 'input-error' : '')}
                  />
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label>Tồn kho</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={form.stock || ''} 
                    onChange={handleChange} 
                    disabled={modalMode === 'view'}
                    className={modalMode === 'view' ? 'input-view-mode' : (errors.stock ? 'input-error' : '')}
                  />
                  {errors.stock && <span className="error-text">{errors.stock}</span>}
                </div>
              </div>

              {modalMode === 'view' && (
                <div className="form-group">
                  <label>Trạng thái</label>
                  <div className="status-badge">
                    <span style={{ color: form.deleted ? 'var(--secondary-color)' : 'var(--primary-color)', fontWeight: 'bold' }}>
                      {form.deleted ? 'Ngừng kinh doanh' : 'Đang kinh doanh'}
                    </span>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn" onClick={closeModal} style={{ background: '#f3f4f6', color: '#4b5563' }}>
                  {modalMode === 'view' ? 'Đóng' : 'Hủy'}
                </button>
                {modalMode !== 'view' && (
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
