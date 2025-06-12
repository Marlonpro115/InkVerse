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

CREATE TABLE IF NOT EXISTS roles (
  id_role INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('user', 'admin', 'librarian', 'author') UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id INT PRIMARY KEY,
  admin_level ENUM('super', 'moderator') DEFAULT 'moderator',
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS librarian_profiles (
  user_id INT PRIMARY KEY,
  work_shift ENUM('morning', 'afternoon', 'night'),
  hire_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS author_profiles (
  user_id INT PRIMARY KEY,
  biography TEXT,
  website VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS client_profiles (
  user_id INT PRIMARY KEY,
  membership_type ENUM('basic', 'premium') DEFAULT 'basic',
  points INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles (solo una vez)
INSERT INTO roles (name) VALUES ('user'), ('admin'), ('librarian'), ('author')
  ON DUPLICATE KEY UPDATE name = name;

-- Insertar usuarios de ejemplo (ahora con role_id)
-- Suponiendo que los ids de roles son: user=1, admin=2, librarian=3, author=4
INSERT INTO users (first_name, middle_name, last_name, second_last_name, username, document_type, document_number, birth_date, email, password, role_id, created_at)
VALUES
('Marlon', 'Agusto', 'Perez', 'Hernandez', 'Marlonpro115', 'CC', '1104257462', '2004-12-16', 'marlonperezhe@gmail.com', '23124477', 2, CURRENT_TIMESTAMP),
('Ana', NULL, 'García', 'López', 'anagarcia', 'CC', '1104257463', '1990-05-10', 'ana.garcia@email.com', 'password123', 1, CURRENT_TIMESTAMP),
('Luis', 'Fernando', 'Martínez', NULL, 'luisfm', 'TI', '1104257464', '1985-08-22', 'luis.martinez@email.com', 'password456', 1, CURRENT_TIMESTAMP);

-- Ejemplo de perfiles extendidos (opcional)
INSERT INTO admin_profiles (user_id, admin_level) VALUES (1, 'super');
INSERT INTO user_profiles (user_id, phone, address, profile_picture) VALUES
  (1, '3001234567', 'Calle 1 #2-3', NULL),
  (2, '3007654321', 'Carrera 4 #5-6', NULL),
  (3, '3012345678', 'Avenida 7 #8-9', NULL);