const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');



const createProjectRouter = require('./routes/createProject');
const projectRouter = require('./routes/project');
const getImageRouter = require('./routes/getimage');
const addMemberRouter = require('./routes/addmember');
const removeMemberRouter = require('./routes/removemember');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use('/createProject', createProjectRouter);
app.use('/project', projectRouter);
app.use('/getimage', getImageRouter);
app.use('/addmember', addMemberRouter);
app.use('/removemember', removeMemberRouter);

module.exports = app;
