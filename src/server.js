const express = require('express');
const { Pool } = require('pg');
const routes = require('./routes');

const app = express();

app.use('/', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});