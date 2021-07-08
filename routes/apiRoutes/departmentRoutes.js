const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const checkInput = require('../../utils/checkInput');

// get command that retrieves all the departments in the database
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;
  
    db.query(sql, (err, rows) => {
      if(err){
        res.status(500).json({error: err.message});
        return;
      }
      res.json({
        message: 'success',
        data: rows
      })
    })
});

