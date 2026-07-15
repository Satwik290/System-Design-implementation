const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// 3. Two separate connection pools
const masterPool = mysql.createPool({
  host: 'localhost',
  port: 3306, // Master
  user: 'root',
  password: 'rootpassword',
  database: 'app_db'
});

const replicaPool = mysql.createPool({
  host: 'localhost',
  port: 3307, // Replica
  user: 'root',
  password: 'rootpassword',
  database: 'app_db'
});

// 4. Route logic: WRITEs go to Master
app.post('/users', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await masterPool.execute(
      'INSERT INTO users (name) VALUES (?)', 
      [name]
    );
    res.status(201).json({ message: 'User created on Master', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Route logic: READs go to Replica
app.get('/users', async (req, res) => {
  try {
    const [rows] = await replicaPool.execute('SELECT * FROM users');
    res.json({ source: 'Replica', data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Replication API running on port 3000'));