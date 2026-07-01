// Run this once to create your admin account:
// node scripts/createAdmin.js

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const USERNAME = 'admin';
const PASSWORD = 'Admin@123'; // Change this to your preferred password

async function createAdmin() {
    try {
        const hash = await bcrypt.hash(PASSWORD, 10);
        await pool.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = $2',
            [USERNAME, hash]
        );
        console.log(`✅ Admin account created!`);
        console.log(`   Username: ${USERNAME}`);
        console.log(`   Password: ${PASSWORD}`);
        console.log(`   Login at: http://localhost:3000/admin/login`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
        process.exit(1);
    }
}

createAdmin();
