-- Crear base de datos
CREATE DATABASE IF NOT EXISTS db_library;
USE db_library;

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
  role ENUM('admin', 'librarian', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL
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

-- Datos de ejemplo para autores
INSERT INTO authors (name, state) VALUES
('Gabriel García Márquez', 1),
('Isabel Allende', 1),
('Mario Vargas Llosa', 1),
('Julio Cortázar', 1),
('Laura Esquivel', 1),
('Carlos Fuentes', 1),
('Jorge Luis Borges', 1),
('J. K. Rowling', 1),
('George Orwell', 1),
('Miguel de Cervantes', 1),
('Jane Austen', 1),
('Antoine de Saint-Exupéry', 1),
('J. R. R. Tolkien', 1),
('Haruki Murakami', 1),
('Carlos Ruiz Zafón', 1),
('Ray Bradbury', 1);

-- Datos de ejemplo para categorías
INSERT INTO categories (name, description, state) VALUES
('Ficción', 'Narrativa de hechos imaginarios.', 1),
('Realismo Mágico', 'Género literario que mezcla lo real y lo fantástico.', 1),
('Novela Histórica', 'Novelas ambientadas en contextos históricos.', 1),
('Ensayo', 'Obras de reflexión y análisis.', 1),
('Poesía', 'Obras en verso.', 1),
('Literatura Fantástica', 'Narraciones de mundos imaginarios.', 1),
('Ciencia Ficción', 'Narrativa basada en avances científicos.', 1),
('Clásicos', 'Obras literarias de gran relevancia histórica.', 1),
('Aventura', 'Narraciones de viajes y hazañas.', 1),
('Infantil', 'Libros para niños y jóvenes.', 1);

-- Datos de ejemplo para editoriales
INSERT INTO publishers (name, state) VALUES
('Editorial Sudamericana', 1),
('Alfaguara', 1),
('Planeta', 1),
('Seix Barral', 1),
('Fondo de Cultura Económica', 1),
('Anagrama', 1),
('Minotauro', 1),
('Salamandra', 1),
('Debolsillo', 1),
('Penguin Books', 1),
('Tusquets', 1);

-- Datos de ejemplo para usuarios
INSERT INTO users (first_name, middle_name, last_name, second_last_name, username, document_type, document_number, birth_date, email, password, role, created_at)
VALUES
('Marlon', 'Agusto', 'Perez', 'Hernandez', 'Marlonpro115', 'CC', '1104257462', '2004-12-16', 'marlonperezhe@gmail.com', '23124477', 'admin', CURRENT_TIMESTAMP),
('Ana', NULL, 'García', 'López', 'anagarcia', 'CC', '1104257463', '1990-05-10', 'ana.garcia@email.com', 'password123', 'user', CURRENT_TIMESTAMP),
('Luis', 'Fernando', 'Martínez', NULL, 'luisfm', 'TI', '1104257464', '1985-08-22', 'luis.martinez@email.com', 'password456', 'user', CURRENT_TIMESTAMP);

-- Datos de ejemplo para libros
INSERT INTO books (name, isbn, year_published, num_pages, description, total_quantity, id_publisher, cover_image, state)
VALUES
('Cien Años de Soledad', '9780307474728', 1967, 417, 'Obra maestra del realismo mágico.', 5, 1, NULL, 1),
('La Casa de los Espíritus', '9780553383805', 1982, 433, 'Novela emblemática de Isabel Allende.', 3, 2, NULL, 1),
('Rayuela', '9788437602215', 1963, 736, 'Novela experimental de Julio Cortázar.', 4, 4, NULL, 1),
('El Aleph', '9788426404187', 1949, 174, 'Colección de cuentos de Borges.', 2, 6, NULL, 1),
('Como Agua para Chocolate', '9780385420174', 1989, 256, 'Novela de realismo mágico y gastronomía.', 6, 5, NULL, 1),
('Harry Potter y la piedra filosofal', '9788478884452', 1997, 256, 'Primer libro de la saga de Harry Potter.', 8, 8, NULL, 1),
('1984', '9780451524935', 1949, 328, 'Distopía clásica sobre un régimen totalitario.', 7, 9, NULL, 1),
('Don Quijote de la Mancha', '9788491050297', 1605, 863, 'Obra cumbre de la literatura española.', 5, 10, NULL, 1),
('Orgullo y Prejuicio', '9788491050298', 1813, 416, 'Novela romántica de Jane Austen.', 6, 11, NULL, 1),
('El Principito', '9780156013987', 1943, 96, 'Fábula poética sobre la vida y la amistad.', 10, 12, NULL, 1),
('El Hobbit', '9788445071413', 1937, 320, 'Aventura fantástica en la Tierra Media.', 7, 13, NULL, 1),
('Kafka en la orilla', '9788483835586', 2002, 656, 'Novela surrealista de Haruki Murakami.', 4, 14, NULL, 1),
('Crónica de una muerte anunciada', '9780307387738', 1981, 120, 'Novela corta de Gabriel García Márquez.', 5, 1, NULL, 1),
('La Sombra del Viento', '9788408172177', 2001, 576, 'Misterio literario en la Barcelona de posguerra.', 6, 2, NULL, 1),
('Fahrenheit 451', '9788497594257', 1953, 256, 'Distopía sobre la censura y los libros prohibidos.', 5, 9, NULL, 1);

-- Libros adicionales para pruebas de carrusel
INSERT INTO books (name, isbn, year_published, num_pages, description, total_quantity, id_publisher, cover_image, state)
VALUES
('El amor en los tiempos del cólera', '9780307389732', 1985, 348, 'Novela de Gabriel García Márquez sobre el amor y el tiempo.', 4, 1, NULL, 1),
('La ciudad y los perros', '9788437602178', 1963, 480, 'Primera novela de Mario Vargas Llosa.', 3, 3, NULL, 1),
('Pedro Páramo', '9789684110083', 1955, 124, 'Novela emblemática de Juan Rulfo.', 5, 5, NULL, 1),
('El túnel', '9788437602338', 1948, 160, 'Novela psicológica de Ernesto Sabato.', 2, 6, NULL, 1),
('Aura', '9789681602369', 1962, 62, 'Novela corta de Carlos Fuentes.', 3, 5, NULL, 1),
('Crónica del pájaro que da cuerda al mundo', '9788498381498', 1994, 928, 'Novela surrealista de Haruki Murakami.', 4, 14, NULL, 1),
('Los juegos del hambre', '9788498675399', 2008, 400, 'Distopía juvenil de Suzanne Collins.', 7, 9, NULL, 1),
('El retrato de Dorian Gray', '9788491050299', 1890, 272, 'Novela gótica de Oscar Wilde.', 6, 11, NULL, 1),
('Mujercitas', '9788491050300', 1868, 480, 'Clásico de Louisa May Alcott.', 5, 11, NULL, 1),
('El guardián entre el centeno', '9780316769488', 1951, 277, 'Novela de J. D. Salinger.', 4, 10, NULL, 1),
('La ladrona de libros', '9786070709930', 2005, 544, 'Novela de Markus Zusak.', 6, 2, NULL, 1),
('El alquimista', '9780061122415', 1988, 208, 'Novela de Paulo Coelho.', 8, 3, NULL, 1),
('El nombre del viento', '9788401352836', 2007, 872, 'Fantasía épica de Patrick Rothfuss.', 7, 13, NULL, 1),
('La tregua', '9788491050317', 1960, 224, 'Novela de Mario Benedetti.', 3, 4, NULL, 1),
('El perfume', '9788497593793', 1985, 288, 'Novela de Patrick Süskind.', 5, 9, NULL, 1);

-- Relación libros-autores
INSERT INTO book_authors (id_book, id_author) VALUES
(1, 1), -- Cien Años de Soledad - Gabriel García Márquez
(2, 2), -- La Casa de los Espíritus - Isabel Allende
(3, 4), -- Rayuela - Julio Cortázar
(4, 7), -- El Aleph - Jorge Luis Borges
(5, 5), -- Como Agua para Chocolate - Laura Esquivel
(6, 8),  -- Harry Potter - J. K. Rowling
(7, 9),  -- 1984 - George Orwell
(8, 10), -- Don Quijote - Miguel de Cervantes
(9, 11), -- Orgullo y Prejuicio - Jane Austen
(10, 12),-- El Principito - Antoine de Saint-Exupéry
(11, 13),-- El Hobbit - J. R. R. Tolkien
(12, 14),-- Kafka en la orilla - Haruki Murakami
(13, 1), -- Crónica de una muerte anunciada - Gabriel García Márquez
(14, 15),-- La Sombra del Viento - Carlos Ruiz Zafón
(15, 16),-- Fahrenheit 451 - Ray Bradbury
(16, 1),  -- El amor en los tiempos del cólera - Gabriel García Márquez
(17, 3),  -- La ciudad y los perros - Mario Vargas Llosa
(18, 17), -- Pedro Páramo - Juan Rulfo (agrega autor si no existe)
(19, 18), -- El túnel - Ernesto Sabato (agrega autor si no existe)
(20, 6),  -- Aura - Carlos Fuentes
(21, 14), -- Crónica del pájaro que da cuerda al mundo - Haruki Murakami
(22, 19), -- Los juegos del hambre - Suzanne Collins (agrega autor si no existe)
(23, 20), -- El retrato de Dorian Gray - Oscar Wilde (agrega autor si no existe)
(24, 21), -- Mujercitas - Louisa May Alcott (agrega autor si no existe)
(25, 22), -- El guardián entre el centeno - J. D. Salinger (agrega autor si no existe)
(26, 23), -- La ladrona de libros - Markus Zusak (agrega autor si no existe)
(27, 24), -- El alquimista - Paulo Coelho (agrega autor si no existe)
(28, 25), -- El nombre del viento - Patrick Rothfuss (agrega autor si no existe)
(29, 26), -- La tregua - Mario Benedetti (agrega autor si no existe)
(30, 27); -- El perfume - Patrick Süskind (agrega autor si no existe)

-- Relación libros-categorías
INSERT INTO book_categories (id_book, id_category) VALUES
(1, 2), -- Realismo Mágico
(2, 2), -- Realismo Mágico
(3, 1), -- Ficción
(4, 6), -- Literatura Fantástica
(5, 2), -- Realismo Mágico
(6, 3),  -- Harry Potter - Novela Histórica (puedes cambiar por Fantástica si lo prefieres)
(6, 6),  -- Harry Potter - Literatura Fantástica
(7, 1),  -- 1984 - Ficción
(7, 7),  -- 1984 - Ciencia Ficción
(8, 1),  -- Don Quijote - Ficción
(8, 8),  -- Don Quijote - Clásicos
(9, 1),  -- Orgullo y Prejuicio - Ficción
(9, 8),  -- Orgullo y Prejuicio - Clásicos
(10, 9), -- El Principito - Infantil
(10, 6), -- El Principito - Literatura Fantástica
(11, 6), -- El Hobbit - Literatura Fantástica
(11, 2), -- El Hobbit - Realismo Mágico
(12, 1), -- Kafka en la orilla - Ficción
(13, 1), -- Crónica de una muerte anunciada - Ficción
(14, 1), -- La Sombra del Viento - Ficción
(15, 7), -- Fahrenheit 451 - Ciencia Ficción
(16, 2),  -- Realismo Mágico
(17, 3),  -- Novela Histórica
(18, 1),  -- Ficción
(19, 1),  -- Ficción
(20, 2),  -- Realismo Mágico
(21, 1),  -- Ficción
(22, 7),  -- Ciencia Ficción
(23, 8),  -- Clásicos
(24, 8),  -- Clásicos
(25, 1),  -- Ficción
(26, 1),  -- Ficción
(27, 6),  -- Literatura Fantástica
(28, 6),  -- Literatura Fantástica
(29, 1),  -- Ficción
(30, 1);  -- Ficción

-- Préstamos y ventas adicionales
INSERT INTO book_loans (id_book, id_user, loan_date, due_date, returned) VALUES
(6, 2, '2024-06-07 09:00:00', '2024-06-21 09:00:00', 0),
(7, 3, '2024-06-08 11:00:00', '2024-06-22 11:00:00', 0),
(8, 1, '2024-06-09 15:00:00', '2024-06-23 15:00:00', 1);

INSERT INTO book_sales (id_book, id_user, sale_date, quantity, price, discount) VALUES
(6, 1, '2024-06-10 13:00:00', 1, 35000, 0),
(7, 2, '2024-06-11 14:00:00', 1, 32000, 5),
(8, 3, '2024-06-12 16:00:00', 2, 40000, 0);

-- Autores adicionales para los nuevos libros (si no existen)
INSERT IGNORE INTO authors (id_author, name, state) VALUES
(17, 'Juan Rulfo', 1),
(18, 'Ernesto Sabato', 1),
(19, 'Suzanne Collins', 1),
(20, 'Oscar Wilde', 1),
(21, 'Louisa May Alcott', 1),
(22, 'J. D. Salinger', 1),
(23, 'Markus Zusak', 1),
(24, 'Paulo Coelho', 1),
(25, 'Patrick Rothfuss', 1),
(26, 'Mario Benedetti', 1),
(27, 'Patrick Süskind', 1);