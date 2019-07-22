const express = require("express");
const router = express();
const path = require('path')
const excelToJson =  require('convert-excel-to-json')
const fs = require('fs')
const multer  = require('multer')
const sql = require("mssql");

const light_controller = require("./controller/light_controller")

// router.get("/create", light_controller.create)
router.get("/get", light_controller.get)
router.get("/update", light_controller.update)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // console.log(file);
      cb(null, file.originalname)
    }
  })
   
var upload = multer({ storage: storage })

router.post("/upload/excel", upload.single('excel'), async(req, res) => {
    
    const file = req.file.originalname;
    //
    const result = excelToJson({
        sourceFile : `public/uploads/${file}`
    })
    var query = 'INSERT INTO reports ('
    let sheet = Object.keys(result)[0];
    let arr = result[sheet];

    for (let i = 0; i < arr.length; i++) {
        if(i === 0){
            Object.keys(arr[i]).forEach((key) => {
                query = query.concat(`"${arr[i][key]}", `)
                
            })
            query = query.substring(0, query.length - 2);
            query = query.concat(') VALUES (')
        } else {
            Object.keys(arr[i]).forEach((key) => {
                query = query.concat(`'${arr[i][key]}', `)
                
            })
            query = query.substring(0, query.length - 2);
            if(i == arr.length-1){
                query = query.concat(')')
            } else {
                query = query.concat('),(')
            }
        }
       
        
    }
    // query = query.concat(')')
    console.log(query);
    
    try {
        var data = await sql.query(query)
    } catch (error) {
        console.log(error);
        
    }
   return res.send(data)
   
    
})

// router.get('/', async(req, res) => {
//     var result = await sql.query(
//         "SELECT * FROM reports"
//       );
//       console.log(result);
//       return res.send(result)
      
// })
module.exports = router;