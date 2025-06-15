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