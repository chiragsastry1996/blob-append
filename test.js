// var fs = require('fs');
// var csv = require('fast-csv');
// var csvWriter = require('csv-write-stream');

// var writer = csvWriter()
// writer = csvWriter({sendHeaders: false});
// writer.pipe(fs.createWriteStream('out.csv', {flags: 'a'}))
// writer.write(fs.createReadStream('out.csv')
// .pipe(csv.parse({ headers: false })))
// writer.end()

// console.log(fs.createReadStream('out.csv')
// .pipe(csv.parse({ headers: true })));


// var fs = require('fs');
// var csvWriter = require('csv-write-stream')

// var writer = csvWriter()
// writer.pipe(fs.createWriteStream('out.csv'))
// writer.write({hello: "world", foo: "bar", baz: "taco"})
// writer.end()

// --------------------------------------------------------------------------------------------------------

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
        {id: 'hello', title: 'hello'},
        {id: 'foo', title: 'foo'},
        {id: 'baz', title: 'baz'}
    ]
});

const records = [
    {hello: "world", foo: "bar", baz: "taco"},
    {hello: "woasdfrld", foo: "basdfar", baz: "taadfadfco"},
    {hello: "woasdfrld", foo: "basdfar", baz: "taadfadfco"},
    {hello: "woasdfrld", foo: "basdfar", baz: "taadfadfco"}
];

csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });