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

// delete command that will delete the department from the database
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if(err) {
        res.json({error: err.message});
        return
      }
      else if (!result.affectedRows){
        res.json({message: 'Department not found.'})
      }
      else {
        res.json({
          message: 'Department successfully deleted.',
          changes: result.affectedRows,
          id: req.params.id
        })
      }
    })
})

