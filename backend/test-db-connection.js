// Quick database connection test script
// Run: node test-db-connection.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Handle empty password string properly
const dbPassword = process.env.DB_PASSWORD === "" ? "" : (process.env.DB_PASSWORD || "");

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: dbPassword,
  database: process.env.DB_NAME || 'resume_builder',
};

console.log('🔍 Testing database connection...');
console.log(`Host: ${config.host}`);
console.log(`User: ${config.user}`);
console.log(`Database: ${config.database}`);
console.log(`Password: ${config.password ? '***' : '(empty)'}\n`);

async function testConnection() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SHOW TABLES');
    console.log(`\n📊 Tables found: ${rows.length}`);
    rows.forEach(row => {
      console.log(`   - ${Object.values(row)[0]}`);
    });
    
    await connection.end();
    console.log('\n✅ Database is ready to use!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error: ${error.message}\n`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Issue: Wrong username or password');
      console.error('   Fix: Update DB_PASSWORD in backend/.env\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Issue: Database does not exist');
      console.error('   Fix: Run: mysql -u root -p < mysql-schema.sql\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Issue: MySQL server is not running');
      console.error('   Fix: Start MySQL service or XAMPP/WAMP\n');
    } else {
      console.error('💡 Check your database configuration in backend/.env\n');
    }
    
    process.exit(1);
  }
}

testConnection();
