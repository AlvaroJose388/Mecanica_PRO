-- Paso 1: Renombrar la columna si aún no lo has hecho.
-- Si ya lo hiciste, puedes ignorar este comando.
ALTER TABLE users RENAME COLUMN "passwordHash" TO password_hash;

-- Paso 2: Actualizar la contraseña con el hash correcto para '123456'
UPDATE users 
SET password_hash = '$2a$10$wOD.1b47h2c/4i5JqSPO8e3y3e9Y.V..i.wV.5Xz.zM.o5Q.F.B.q' 
WHERE email = 'luisdanielherreraperez@gmail.com';
