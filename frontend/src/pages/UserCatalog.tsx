import { useUserCatalog } from '../hooks/useUserCatalog';
import { formatVND } from '../utils/format';
import './UserCatalog.css';

export default function UserCatalog() {
  const {
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
  } = useUserCatalog();

  return (
    <div className="catalog-container">
      <h2>Danh sách sản phẩm</h2>
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="card product-card">
            <div>
              <h3>{p.name}</h3>
              <p className="product-description">{p.description}</p>
              <p className="product-price">{formatVND(p.price)}</p>
            </div>
            
            <div className="stock-info">
              {p.stock > 0 ? (
                <>
                  <p>Số lượng: <strong>{p.stock}</strong> sản phẩm</p>  
                  <button className="btn btn-primary" onClick={() => addToCart(p)} style={{ width: '100%' }}>
                    Thêm vào giỏ hàng
                  </button>
                </>
              ) : (
                <button className="btn" disabled style={{ width: '100%', backgroundColor: '#fff', color: 'var(--secondary-color)', border: '1px solid var(--secondary-color)', cursor: 'not-allowed' }}>
                  Hết hàng
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <button className="floating-cart-btn" onClick={toggleCart} title="Xem giỏ hàng">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="cart-overlay" onClick={toggleCart} />
          <div className="cart-sidebar">
            <div className="cart-header">
              <h2 style={{ margin: 0 }}>🛒 Giỏ hàng</h2>
              <button className="close-button" onClick={toggleCart}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Chưa có sản phẩm nào</p>
                <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Hãy thêm sản phẩm vào giỏ nhé!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ul style={{ padding: 0, listStyle: 'none', margin: 0, flex: 1 }}>
                  {cart.map(item => (
                    <li key={item.id} className="cart-item">
                      <div className="cart-item-header">
                        <div className="cart-item-info">
                          <strong>{item.name}</strong>
                          <span className="cart-item-price">{formatVND(item.price)}</span>
                        </div>
                        <button 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#ccc' }} 
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="quantity-control">
                          <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <strong style={{ fontSize: '1.1rem' }}>
                          {formatVND(item.price * item.quantity)}
                        </strong>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="cart-footer">
                  <div className="total-row">
                    <span className="total-label">Tổng thanh toán:</span>
                    <span className="total-price">{formatVND(cartTotal)}</span>
                  </div>
                  <button className="btn btn-primary checkout-btn" onClick={submitOrder}>
                    Thanh toán ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
