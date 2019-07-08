const express = require("express");
const router = express();
const path = require('path')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var azure = require('azure-storage');
var blobService = azure.createBlobService();
const csv = require('csvtojson')
// var jsonexport = require('jsonexport');
const fs = require('fs')
const multer  = require('multer')

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

router.get('/', async (req, res) => {

});


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