package com.seveneleven.api.service;

import com.seveneleven.api.model.Order;
import com.seveneleven.api.model.OrderItem;
import com.seveneleven.api.model.Product;
import com.seveneleven.api.repository.OrderRepository;
import com.seveneleven.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + item.getProductId()));

                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
            }
        }
        order.setCreatedAt(LocalDateTime.now());
        if (order.getStatus() == null) {
            order.setStatus("Thành công");
        }
        return orderRepository.save(order);
    }
}
