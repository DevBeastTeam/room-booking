-- ==============================================================================
-- Monarch Pass Apartments - Complete MySQL Database Schema (001_initial_schema.sql)
-- Database Name: roombookingdb
-- Engine: InnoDB, Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Contact Inquiries & Prospect Messages
CREATE TABLE IF NOT EXISTS `inquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `tracking_id` VARCHAR(32) NOT NULL UNIQUE,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(64) DEFAULT NULL,
    `preferred_bedroom` VARCHAR(64) DEFAULT 'Any',
    `move_in_date` VARCHAR(64) DEFAULT NULL,
    `category` VARCHAR(100) DEFAULT 'General Inquiry',
    `message` TEXT DEFAULT NULL,
    `status` ENUM('new', 'in-progress', 'resolved', 'archived') DEFAULT 'new',
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_inq_email` (`email`),
    INDEX `idx_inq_status` (`status`),
    INDEX `idx_inq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tour Bookings & Appointments
CREATE TABLE IF NOT EXISTS `tours` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `tracking_id` VARCHAR(32) NOT NULL UNIQUE,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(64) NOT NULL,
    `preferred_bedroom` VARCHAR(64) DEFAULT NULL,
    `preferred_unit` VARCHAR(64) DEFAULT NULL,
    `tour_date` DATE NOT NULL,
    `tour_time` VARCHAR(32) NOT NULL,
    `tour_type` ENUM('in-person', 'virtual-video', 'self-guided') DEFAULT 'in-person',
    `comments` TEXT DEFAULT NULL,
    `status` ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_tour_date` (`tour_date`),
    INDEX `idx_tour_email` (`email`),
    INDEX `idx_tour_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Floor Plans Specifications & Lease Terms
CREATE TABLE IF NOT EXISTS `floor_plans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(64) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `beds` INT NOT NULL DEFAULT 1,
    `baths` DECIMAL(3,1) NOT NULL DEFAULT 1.0,
    `sqft` INT NOT NULL DEFAULT 600,
    `total_units` INT NOT NULL DEFAULT 20,
    `occupied_units` INT NOT NULL DEFAULT 0,
    `price_12m` INT NOT NULL DEFAULT 898,
    `price_10m` INT NOT NULL DEFAULT 950,
    `price_6m` INT NOT NULL DEFAULT 1020,
    `deposit` INT NOT NULL DEFAULT 250,
    `description` TEXT DEFAULT NULL,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_fp_beds` (`beds`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Individual Units Inventory & Occupancy
CREATE TABLE IF NOT EXISTS `units` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `unit_number` VARCHAR(32) NOT NULL UNIQUE,
    `floor_plan_slug` VARCHAR(64) NOT NULL,
    `beds` INT NOT NULL DEFAULT 1,
    `floor` INT NOT NULL DEFAULT 1,
    `sqft` INT NOT NULL DEFAULT 600,
    `rent` INT NOT NULL DEFAULT 898,
    `status` ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    `tenant_name` VARCHAR(191) DEFAULT NULL,
    `move_in_date` DATE DEFAULT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_unit_status` (`status`),
    INDEX `idx_unit_plan` (`floor_plan_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Maintenance Requests & Resident Work Orders
CREATE TABLE IF NOT EXISTS `maintenance_tickets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` VARCHAR(32) NOT NULL UNIQUE,
    `unit_number` VARCHAR(32) NOT NULL,
    `tenant_name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` ENUM('HVAC', 'Plumbing', 'Electrical', 'Appliance', 'Exterior', 'Turnover', 'General') DEFAULT 'General',
    `priority` ENUM('Low', 'Medium', 'High', 'Emergency') DEFAULT 'Medium',
    `status` ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    `notes` TEXT DEFAULT NULL,
    `date_submitted` VARCHAR(64) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_maint_unit` (`unit_number`),
    INDEX `idx_maint_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Rental Applications
CREATE TABLE IF NOT EXISTS `applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `app_id` VARCHAR(32) NOT NULL UNIQUE,
    `applicant_name` VARCHAR(191) NOT NULL,
    `floor_plan_slug` VARCHAR(64) NOT NULL,
    `unit_number` VARCHAR(32) DEFAULT NULL,
    `income` VARCHAR(64) DEFAULT NULL,
    `credit_score` INT DEFAULT NULL,
    `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    `date_submitted` VARCHAR(64) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_app_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Dynamic Site Settings & CMS Info
CREATE TABLE IF NOT EXISTS `site_settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` LONGTEXT NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Theme Customizer & Color Palettes
CREATE TABLE IF NOT EXISTS `theme_config` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `theme_key` VARCHAR(100) NOT NULL UNIQUE,
    `theme_data` LONGTEXT NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Paddle Payment Gateway Transactions & Orders
CREATE TABLE IF NOT EXISTS `transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `txn_id` VARCHAR(64) NOT NULL UNIQUE,
    `paddle_order_id` VARCHAR(64) DEFAULT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_phone` VARCHAR(64) DEFAULT NULL,
    `item_type` ENUM('application_fee', 'holding_deposit', 'rent_payment') NOT NULL DEFAULT 'holding_deposit',
    `item_name` VARCHAR(191) NOT NULL,
    `unit_number` VARCHAR(32) DEFAULT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(8) DEFAULT 'USD',
    `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    `paddle_checkout_url` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_txn_status` (`status`),
    INDEX `idx_txn_email` (`user_email`),
    INDEX `idx_txn_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
