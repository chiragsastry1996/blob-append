const express = require("express");
const router = express();
const path = require('path')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var azure = require('azure-storage');
var blobService = azure.createBlobService();
const csv = require('csvtojson')
const excelToJson =  require('convert-excel-to-json')
const fs = require('fs')
const multer  = require('multer')
const sql = require("mssql");

// const csvWriter = createCsvWriter({
//     path: csvFilePath,
//     header: [
//         {id: 'hello', title: 'hello'},
//         {id: 'foo', title: 'foo'},
//         {id: 'baz', title: 'baz'}
//     ]
// });


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

router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file.originalname;
    let csvFilePath = `public/uploads/${file}`
    const jsonArray = await csv().fromFile(csvFilePath);
   
    await downloadBlob('reports', 'test.csv')
    csvFilePath = `public/uploads/out.csv`
    const jsonArray2 = await csv().fromFile(csvFilePath);
    const final = jsonArray2.concat(jsonArray)
    
    const csvWriter = createCsvWriter({
        path: 'public/test.csv',
        header: [
            {id: 'Start Date', title: 'Start Date'},
            {id: 'Start Time', title: 'Start Time'},
        ]
    });


    
    await csvWriter.writeRecords(final) 
 
    
    try {
        await uploadLocalFile('reports', `public/test.csv`)
    } catch (error) {
        console.log(error);
    }
    res.send('ok')
    
})

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

router.get('/', async(req, res) => {
    var result = await sql.query(
        "SELECT * FROM reports"
      );
      console.log(result);
      return res.send(result)
      
})

// const listBlobs =  (containerName) => {
//     return new Promise((resolve, reject) => {
//         blobService.listBlobsSegmented(containerName, null, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve({ message: `${data.entries.length} blobs in '${containerName}'`, blobs: data.entries });
//             }
//         });
//     });
// };

const uploadLocalFile = async (containerName, filePath) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = path.basename(filePath);
        blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Local file "${filePath}" is uploaded` });
            }
        });
    });
};



const downloadBlob =  async (containerName, blobName) => {
    // const dowloadFilePath = path.resolve('./' + blobName.replace('.txt', '.downloaded.txt'));
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(containerName, blobName, (err, data) => {
            if (err) {
                
            } else {
                fs.writeFile('public/uploads/out.csv', data, (err, result) => {
                    if(err){
                        reject(err);
                        
                    }
                    console.log('ok');
                    
                })
                resolve({ message: `Blob downloaded"`, text: data });
            }
        });
    });
};

module.exports = router;