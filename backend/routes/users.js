var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.send('respond with a resource');
});
// router.post('/', function(req, res, next) {
//   if(req.body){
//     console.log(req.body);
//     res.send(req.body);
//     return;
//   }
//   res.send('post');
// });

// router.post('/',upload.single('sdfsdf'),(req,res)=>{
//   console.log(req.body);
//   console.log(req.file);
//   res.send('hello');
// });
router.post('/',(req,res)=>{
  console.log(req.body);
  console.log(req.files);
  res.send('hello');
});
module.exports = router;
