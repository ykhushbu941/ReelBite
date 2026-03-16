const express = require('express');
const router = express.Router();

/* POST /api/food/ [protected]*/
router.post('/', (req, res) => {
    res.send("Food route working");
});

module.exports = router;