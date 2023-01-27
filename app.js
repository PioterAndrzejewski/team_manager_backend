const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const createProjectRouter = require('./routes/createproject');
const projectRouter = require('./routes/project');
const getImageRouter = require('./routes/getimage');
const memberRouter = require('./routes/member');
const removeMemberRouter = require('./routes/removemember');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'))


app.use('/createProject', createProjectRouter);
app.use('/project', projectRouter);
app.use('/getimage', getImageRouter);
app.use('/member', memberRouter);
app.use('/removemember', removeMemberRouter);

module.exports = app;
