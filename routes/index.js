
const express = require('express');
////console.log(process.env);

const path = require('path');
const router = express.Router();

const { spawn } = require('child_process');
const axios = require('axios');
const cron = require('node-cron');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});



// GET /date - Return current date
router.get('/date', (req, res) => {
  const now = new Date();
  res.json({ date: now.toISOString() });
});

// POST /reverse - Accepts a name and returns it reversed
router.post('/reverse', express.json(), (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid name' });
  }

  const reversed = name.split('').reverse().join('');
  return res.json({ original: name, reversed });
});

// PUT /catfact - Fetch and return a cat fact



module.exports = router;


