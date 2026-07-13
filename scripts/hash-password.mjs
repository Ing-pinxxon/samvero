// Uso: node scripts/hash-password.mjs "tuClaveSegura"
// Imprime el hash bcrypt para pegar en ADMIN_PASSWORD_HASH del .env
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/hash-password.mjs "tuClave"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);
