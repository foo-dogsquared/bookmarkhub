const body_parser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const db = new sqlite3.Database('./tests/db/quotes.db');

const port = 4000;
const quote_table = "quotes";

function init(public_dir = '') {
    app
        .use(body_parser.urlencoded({extended: true}))
        .get('/quote', function(req, res) {
            if (req.query.ID) res.status(503).json({message: `Error in the database. Please try again later.`});
            else {
                db.all(`SELECT * FROM ${quote_table}`, function(err, rows) {
                    const arr = [];
                    if (err) throw `ERROR: ${err.message}`;
                    else {
                        rows.forEach((obj, index) => arr.push(obj));
                        res.status(200).json(arr);
                    }
                })
            }
        })
        .get('/quote/:id', function(req, res) {
            if (req.params.id && parseInt(req.params.id) === Number(req.params.id))
                db.get(`SELECT * FROM ${quote_table} WHERE ID = ?`, [req.params.id], function(err, row) {
                    if (!err && row !== undefined) res.status(200).json(row);
                    else res.status(404).json({message: `Requested ID is above range.`});
                });
            else
                res.status(404).json({message: `${res.statusCode}: ${res.statusMessage}`});
        })
        .post('/quote', function(req, res) {
            console.log(req.body);
            if (req.body.quote !== undefined && req.body.author !== undefined) {
                db.get(`SELECT * FROM ${quote_table} WHERE quote = ? AND author = ?`, [req.body.quote, req.body.author], function(err, row) {
                    if (!row) {
                        db.run(`INSERT INTO ${quote_table} (quote, author) VALUES (?, ?)`, [req.body.quote, req.body.author]);
                        console.log(`Another item has been sucessfully added: ${req.body.quote} & ${req.body.author}.`);
                        res.status(200).json({message: `Sent data was sucessfully added into the database.`, quote: req.body.quote, author: req.body.author});
                    }
                    else
                        res.status(404).json({message: `The sent data is already found in the database`});
                });                
            }
            else res.status(404).json({message: `There's missing values in your request.`});
        })
        .delete(`/quote/:id`, function(req, res) {
            if (req.params.id && parseInt(req.params.id) === Number(req.params.id)) {
                db.run(`DELETE FROM ${quote_table} WHERE ID = ?`, [req.params.id], function(err) {
                    if (err) res.status(404).json({message: `ID given cannot be found.`})
                })
                res.status(200).json({message: `Successfully deleted.`})
            }
        })
        .listen(port, () => console.log(`Port opened at ${port}. You can open with localhost:${port}`))
}

init();
