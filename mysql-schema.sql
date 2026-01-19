-- MySQL Database Schema for AI Resume Builder
-- Run this SQL in your MySQL client (phpMyAdmin, MySQL Workbench, or command line)

-- Create database
CREATE DATABASE IF NOT EXISTS resume_builder;
USE resume_builder;

-- Table: users
-- Stores user authentication information
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  date_of_birth DATE,
  auth_provider ENUM('local', 'google') NOT NULL DEFAULT 'local',
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_google_id (google_id),
  INDEX idx_email (email),
  INDEX idx_auth_provider (auth_provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resumes
-- Stores resume data for each user
CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
  template_style ENUM('professional', 'modern', 'minimal') NOT NULL DEFAULT 'professional',
  target_role VARCHAR(255) DEFAULT '',
  personal_info JSON NOT NULL,
  professional_summary TEXT,
  work_experience JSON NOT NULL,
  education JSON NOT NULL,
  skills JSON NOT NULL,
  certifications JSON NOT NULL,
  projects JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_resume (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ai_suggestions
-- Stores AI-generated suggestions for resumes
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  section VARCHAR(100) NOT NULL,
  original_text TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  reason TEXT NOT NULL,
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  INDEX idx_resume_id (resume_id),
  INDEX idx_applied (applied)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments for documentation
ALTER TABLE users COMMENT = 'Stores user authentication information';
ALTER TABLE resumes COMMENT = 'Stores resume data for authenticated users';
ALTER TABLE ai_suggestions COMMENT = 'Stores AI-generated suggestions for improving resumes';

