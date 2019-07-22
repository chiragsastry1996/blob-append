const sql = require('mssql')
const mongoose = require("mongoose")
const dbConfig = {
  server: "volvosubstrack.database.windows.net", // Use your SQL server name
  database: "master-data", // Database to connect to
  user: "volvosubstrack", // Use your username
  password: "volvo@123", // Use your password
  // Since we're on Windows Azure, we need to set the following options
  options: {
        encrypt: true
    }
 };


sql.connect(dbConfig).then(() => {
  console.log('database connected');
}).catch((e) => {
  console.log(e);
})

mongoose.connect("mongodb://volvo-warehouse:OgHuTPLpfmmdIcOuWi5uXILCYrvVNikgEAyE6dfdpUbggAwR8XlODPk26jjxuojVbnYdEqseIEEPcpvQbANDUg%3D%3D@volvo-warehouse.documents.azure.com:10255/?ssl=true").then(() => {
  console.log('mongo connected');
  
}).catch((e) => {
  console.log(e);
  
})