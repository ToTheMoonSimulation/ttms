var express = require('express');
var router = express.Router();

router.get('/',(req, res,next) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
  });
  
module.exports = router;