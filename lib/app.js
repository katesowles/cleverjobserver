'use strict';

const express = require('express');
const app = express();
const positions = require('./routes/positions');
const companies = require('./routes/companies');
const contacts = require('./routes/contacts');
const users = require('./routes/users');
const errorhandler = require('./errorhandler');
const path = require( 'path' );
const publicPath = path.resolve( __dirname, '../public' );
const indexHtml = path.resolve( __dirname, '../index.html' );
const checkAuth = require('../auth/checkAuth')();

module.exports = app
.use(express.static(publicPath))
.get('/', (req,res) => res.sendFile(indexHtml))
.use('/api/auth', auth)
.use('/api/positions', positions)
.use('/api/companies', companies)
.use('/api/contacts', contacts)
.use('/api/users', checkAuth, users)
.use(errorhandler)
;
