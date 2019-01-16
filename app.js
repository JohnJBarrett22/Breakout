const http = require('http');
const express = require('express');
const app  = express();
const path = require('path');

let sitePath = process.argv[2] || "client";
let port = 7777;
let address = "http://localhost:";

let gameRoute = path.join(__dirname, sitePath);
gameRoute = path.normalize(gameRoute);

console.log(gameRoute);
console.log(sitePath);
console.log(express);

app.use(function(req, res, next) {
	console.log(req.url);
	next();
});

app.use(express.static(gameRoute));

app.listen(port, noArgs => {
    console.log(`Server running at: ${address}${port}`);
});