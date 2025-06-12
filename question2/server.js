// Required Libraries
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9875;
const cache = new Map();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
