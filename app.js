'use strict'
// imports
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");

// core variables
var app = express()
// public directory location
// absolute path returned from __dirname
var srcPath = path.join(__dirname, 'public');
var assetPath = path.join(__dirname, 'public/assets');

// static load of javascript modules
// all files copied to client
app.use(express.static(srcPath));

// load favicon icon
app.use(favicon(path.join(assetPath, '/favicon.ico')));

module.exports = app;
