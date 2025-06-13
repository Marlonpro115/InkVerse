-- Crear base de datos
CREATE DATABASE IF NOT EXISTS db_library;
USE db_library;

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

-- Tabla de autores
CREATE TABLE IF NOT EXISTS authors (
  id_author INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id_category INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  state TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de editoriales
CREATE TABLE IF NOT EXISTS publishers (
  id_publisher INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- Tabla de libros
CREATE TABLE IF NOT EXISTS books (
  id_book INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  isbn CHAR(13) UNIQUE,
  year_published SMALLINT, -- Cambiado de YEAR a SMALLINT para permitir años históricos
  num_pages INT,
  cover_image VARCHAR(255),
  description TEXT,
  total_quantity INT DEFAULT 0,
  id_publisher INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  state TINYINT(1) DEFAULT 1,
  FOREIGN KEY (id_publisher) REFERENCES publishers(id_publisher) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla intermedia para libros y autores (muchos a muchos)
CREATE TABLE IF NOT EXISTS book_authors (
  id_book INT NOT NULL,
  id_author INT NOT NULL,
  PRIMARY KEY (id_book, id_author),
  FOREIGN KEY (id_book) REFERENCES books(id_book) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_author) REFERENCES authors(id_author) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla intermedia para libros y categorías (muchos a muchos)
CREATE TABLE IF NOT EXISTS book_categories (
  id_book INT NOT NULL,
  id_category INT NOT NULL,
  PRIMARY KEY (id_book, id_category),
  FOREIGN KEY (id_book) REFERENCES books(id_book) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_category) REFERENCES categories(id_category) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de préstamos
CREATE TABLE IF NOT EXISTS book_loans (
  id_loan INT AUTO_INCREMENT PRIMARY KEY,
  id_book INT NOT NULL,
  id_user INT,
  loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_date DATETIME,
  return_date DATETIME,
  returned TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_book) REFERENCES books(id_book) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS book_sales (
  id_sale INT AUTO_INCREMENT PRIMARY KEY,
  id_book INT NOT NULL,
  id_user INT,
  sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(5,2) DEFAULT 0.00,
  FOREIGN KEY (id_book) REFERENCES books(id_book) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;