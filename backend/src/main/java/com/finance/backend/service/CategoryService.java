package com.finance.backend.service;

import com.finance.backend.model.Category;
import com.finance.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        seedCategories();
    }

    public List<Category> seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category(null, "Food", "Utensils", "#f87171"));
            categoryRepository.save(new Category(null, "Health", "Activity", "#4ade80"));
            categoryRepository.save(new Category(null, "Shopping", "ShoppingBag", "#6366f1"));
            categoryRepository.save(new Category(null, "Transport", "Car", "#fbbf24"));
            categoryRepository.save(new Category(null, "Entertainment", "Film", "#a855f7"));
            categoryRepository.save(new Category(null, "Other", "Circle", "#94a3b8"));
        }
        return categoryRepository.findAll();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
    
    public Category updateCategory(Long id, Category details) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(details.getName());
        category.setIcon(details.getIcon());
        category.setColor(details.getColor());
        return categoryRepository.save(category);
    }
}
