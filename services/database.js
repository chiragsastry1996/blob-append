const sql = require('mssql')
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
