-- =========================================================
-- Seguridad Neiva - Esquema de base de datos (versión integrada)
-- Lo usan la API REST (api/), el frontend React (web/) y el módulo Java.
-- Uso:  mysql -u root -p < api/sql/schema.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS seguridad_neiva
    CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE seguridad_neiva;

-- Usuarios de la plataforma. La contraseña se guarda cifrada (hash de bcrypt, 60 caracteres).
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario     INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    correo         VARCHAR(120) NOT NULL UNIQUE,
    contrasena     VARCHAR(255) NOT NULL,
    rol            VARCHAR(30)  NOT NULL DEFAULT 'CIUDADANO',
    fecha_registro DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Incidentes de seguridad reportados por los usuarios.
CREATE TABLE IF NOT EXISTS incidente (
    id_incidente  INT AUTO_INCREMENT PRIMARY KEY,
    tipo          VARCHAR(50)  NOT NULL,
    descripcion   VARCHAR(500) NOT NULL,
    ubicacion     VARCHAR(150) NOT NULL,
    estado        VARCHAR(30)  NOT NULL DEFAULT 'PENDIENTE',
    fecha_reporte DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario    INT          NOT NULL,
    CONSTRAINT fk_incidente_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

-- Usuario de sistema (id 1). El frontend asocia a él los reportes mientras no tiene login.
-- Su contraseña no es un hash válido, así que nadie puede iniciar sesión con esta cuenta.
INSERT IGNORE INTO usuario (id_usuario, nombre, correo, contrasena, rol)
VALUES (1, 'Usuario del sistema', 'sistema@seguridadneiva.local', '!sin-acceso', 'SISTEMA');
