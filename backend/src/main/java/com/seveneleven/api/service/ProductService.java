package com.seveneleven.api.service;

import com.seveneleven.api.model.Product;
import com.seveneleven.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsDeletedFalse();
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id).filter(p -> !p.isDeleted());
    }

    public Product createProduct(Product product) {
        product.setDeleted(false);
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(updatedProduct.getName());
                    existingProduct.setDescription(updatedProduct.getDescription());
                    existingProduct.setPrice(updatedProduct.getPrice());
                    existingProduct.setStock(updatedProduct.getStock());
                    return productRepository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void softDeleteProduct(String id) {
        productRepository.findById(id).ifPresent(product -> {
            product.setDeleted(true);
            productRepository.save(product);
        });
    }

    public void restoreProduct(String id) {
        productRepository.findById(id).ifPresent(product -> {
            product.setDeleted(false);
            productRepository.save(product);
        });
    }
}
