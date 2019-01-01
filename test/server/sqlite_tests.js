const sqlite3 = require('sqlite3');

const db = new sqlite3.Database("./tests/db/contacts.db");

db.serialize(function() {
    db.all(`SELECT * FROM contacts`, function(err, rows) {
        console.log("PROCESS ROWS: ");
        if (err) console.log(`ERROR: ${err.message}`);
        else rows.forEach(function(row, index) { console.log(`Index ${index}: ${row.first_name} ${row.last_name} at age ${row.age} available at phone number ${row.phone_number}.`)});
    });

    db.each(`SELECT * FROM contacts`, function(err, row) {
        console.log(`PROCESS ROW: `);
        if (err) console.log(`ERROR: ${err.message}`);
        else (row.ID % 2 === 0) ? console.log(`Index ${row.ID}: ${row.first_name} ${row.last_name} at age ${row.age} available at phone number ${row.phone_number}.`) : '';
    });
});