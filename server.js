const express = require('express')
const app = express()

app.get("/api",(req,res) => {
    res.json({
        "users": ["userone", "usertwo", "userthree"],
    })
})

