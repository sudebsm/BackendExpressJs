const express = require('express');
const mysql = require('mysql'); 
const cors = require('cors');

const app = express();
app.use(cors());



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todolist"
}); 

app.get('/api', (req,res) => {
    return res.json({users: ["user1", "user2", "user3"]});
})

app.get('/users', (req,res) => {
  const sql = "Select * from Users" ;
  db.query(sql,(err,data) => {
    if (err) { return res.json(err); }
    return res.json(data);
  })
})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});