const express = require('express');
const mysql = require('mysql'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "nodedatabase.c256u2eiu1ya.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Bukai9531",
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




app.post('/add', (req, res) => {
    // Accept both camelCase and PascalCase keys
    const body = req.body;
    console.log('Incoming body:', body);
    const UserID = body.UserID 
    const FirstName = body.FirstName  
    const LastName = body.LastName 
    const Address = body.Address  
    const PhoneNumber = body.PhoneNumber  
    const sql = `INSERT INTO Users (FirstName, LastName, Address, PhoneNumber) VALUES ( ?, ?, ?, ?)`;
    db.query(sql, [FirstName, LastName, Address, PhoneNumber], function (err, data) {
        if (err) {
            console.log("No Result", err);
            return res.status(500).json({ error: "Insert failed", details: err });
        } else {
            console.log("Success");
            return res.status(201).json({ message: "Insert successful", data });
        }
    });
});


// Delete user by UserID
app.delete('/delete/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM Users WHERE UserID = ?';
    db.query(sql, [userId], function (err, data) {
        if (err) {
            console.log('Delete failed', err);
            return res.status(500).json({ error: 'Delete failed', details: err });
        } else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('Delete successful');
            return res.status(200).json({ message: 'Delete successful' });
        }
    });
});

// Update user by UserID
app.patch('/update/:id', (req, res) => {
    const userId = req.params.id;
    const body = req.body;
    console.log('Incoming body:', body);
    // Build dynamic SQL for only provided fields
    const fields = [];
    const values = [];
    if (body.FirstName !== undefined) {
        fields.push('FirstName = ?');
        values.push(body.FirstName);
    }
    if (body.LastName !== undefined) {
        fields.push('LastName = ?');
        values.push(body.LastName);
    }
    if (body.Address !== undefined) {
        fields.push('Address = ?');
        values.push(body.Address);
    }
    if (body.PhoneNumber !== undefined) {
        fields.push('PhoneNumber = ?');
        values.push(body.PhoneNumber);
    }
    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }
    const sql = `UPDATE Users SET ${fields.join(', ')} WHERE UserID = ?`;
    values.push(userId);
    db.query(sql, values, function (err, data) {
        if (err) {
            console.log('Update failed', err);
            return res.status(500).json({ error: 'Update failed', details: err });
        } else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('Update successful');
            return res.status(200).json({ message: 'Update successful' });
        }
    });
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


