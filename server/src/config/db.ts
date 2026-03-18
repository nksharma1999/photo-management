import mysql from "mysql2/promise"

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "photo_dashboard",
  connectionLimit: 10
})

export default db