-- PaperCraft Database Schema
-- Run this in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS papercraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE papercraft_db;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    plan ENUM('UNSET', 'FREE', 'PAYG', 'MONTHLY', 'ANNUAL', 'ENTERPRISE') DEFAULT 'UNSET',
    plan_variant VARCHAR(50) DEFAULT NULL,
    expires_at DATETIME DEFAULT NULL,
    manual_paper_count INT DEFAULT 0,
    ai_full_paper_usage INT DEFAULT 0,
    ai_question_usage INT DEFAULT 0,
    extra_ai_full_papers INT DEFAULT 0,
    extra_ai_questions INT DEFAULT 0,
    extra_exports INT DEFAULT 0,
    extra_papers_available INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_plan (plan)
) ENGINE=InnoDB;

-- Papers table
CREATE TABLE papers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    exam_name VARCHAR(255),
    subject VARCHAR(255),
    class VARCHAR(50),
    year INT,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- Offers table
CREATE TABLE offers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('PERCENTAGE', 'FIXED') DEFAULT 'PERCENTAGE',
    discount_value DECIMAL(10,2) NOT NULL,
    max_uses INT DEFAULT NULL,
    current_uses INT DEFAULT 0,
    valid_from DATETIME DEFAULT NULL,
    valid_until DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_plans VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Email OTPs table
CREATE TABLE email_otps (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- Audit logs table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    admin_email VARCHAR(255),
    action VARCHAR(100),
    target_id VARCHAR(36),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin (admin_email),
    INDEX idx_action (action)
) ENGINE=InnoDB;

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Payments table (for manual payment tracking)
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'captured',
    plan VARCHAR(50),
    payment_reference VARCHAR(255),
    method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- Insert default admin user (password: admin123)
INSERT INTO users (id, name, email, password, role, plan) VALUES 
(UUID(), 'Admin', 'admin@papercraft.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ENTERPRISE');
