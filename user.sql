-- Crear tabla de roles primero para evitar problemas de FK
CREATE TABLE IF NOT EXISTS roles (
  id_role INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('user', 'admin', 'librarian', 'author') UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles básicos solo si no existen
INSERT INTO roles (name)
SELECT * FROM (SELECT 'user') AS tmp WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'user') LIMIT 1;
INSERT INTO roles (name)
SELECT * FROM (SELECT 'admin') AS tmp WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin') LIMIT 1;
INSERT INTO roles (name)
SELECT * FROM (SELECT 'librarian') AS tmp WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'librarian') LIMIT 1;
INSERT INTO roles (name)
SELECT * FROM (SELECT 'author') AS tmp WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'author') LIMIT 1;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  second_last_name VARCHAR(50),
  username VARCHAR(50) UNIQUE,
  document_type ENUM('CC', 'TI', 'CE', 'NIT', 'PAS') NOT NULL,
  document_number VARCHAR(20) NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  profile_cover VARCHAR(255),
  membership_type ENUM('basic', 'premium') DEFAULT 'basic',
  points INT DEFAULT 0,
  about VARCHAR(500) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de perfiles de administradores
CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  profile_cover VARCHAR(255),
  admin_level ENUM('super', 'moderator') DEFAULT 'moderator',
  about VARCHAR(500) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de perfiles de bibliotecarios
CREATE TABLE IF NOT EXISTS librarian_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  profile_cover VARCHAR(255),
  work_shift ENUM('morning', 'afternoon', 'night'),
  hire_date DATE,
  about VARCHAR(500) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de perfiles de autores
CREATE TABLE IF NOT EXISTS author_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  profile_cover VARCHAR(255),
  biography TEXT,
  website VARCHAR(255),
  about VARCHAR(500) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;