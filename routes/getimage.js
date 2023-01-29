const express = require('express');
const router = express.Router();
const {readFile, writeFile,  mkdir, copyFile} = require('fs').promises;
const {join} = require("path");


router.get('/:id/:fileName', async (req, res) => {
    const requestedId = req.params.id;
    const requestedFileName = req.params.fileName;

    try {
        res.sendFile(`/${requestedId}/img/${requestedFileName}`, {
            root: join(__dirname, '../data')
        })
    } catch (e) {
        console.log('jest catch')
        res.sendFile(`/template/face_member_0`, {
            root: join(__dirname, '../data')
        })
    }

});


module.exports = router;
