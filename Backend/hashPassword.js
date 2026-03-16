const bcrypt = require("bcryptjs");

async function run() {
  const password = process.argv[2];

  if (!password) {
    console.log('Usage: node hashPassword.js "YourPasswordHere"');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

run();