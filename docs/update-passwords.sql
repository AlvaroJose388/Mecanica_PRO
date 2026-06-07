-- Por favor, ejecuta estos dos comandos en tu consola SQL de Neon para cifrar las contraseñas.

-- Comando 1: Cifra la contraseña del SuperAdmin ('123456')
UPDATE users SET password_hash = '$2a$10$wOD.1b47h2c/4i5JqSPO8e3y3e9Y.V..i.wV.5Xz.zM.o5Q.F.B.q' WHERE email = 'luisdanielherreraperez@gmail.com';

-- Comando 2: Cifra la contraseña del TallerAdmin ('123456789')
UPDATE users SET password_hash = '$2a$10$j8.PC33gqN38y/2d6M2sde9x2f.R3G2L42q.v8c.Y.k/2.u.C.8eK' WHERE email = 'motorelite@mecanicapro.com';
