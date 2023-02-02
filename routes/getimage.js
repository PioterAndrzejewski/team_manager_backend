const express = require('express');
const router = express.Router();
const {join} = require("path");

const TEMPLATE_FACE_IMAGE_URL = `/template/face_member_0`

router.get('/:id/:fileName', async (req, res) => {
    const projectId = req.params.id;
    const requestedFileName = req.params.fileName;
    const requestedImgFilePath = `/${projectId}/img/${requestedFileName}`;

    try {
        res.sendFile(requestedImgFilePath, {
            root: join(__dirname, '../data')
        })
    } catch (e) {
        res.sendFile(TEMPLATE_FACE_IMAGE_URL, {
            root: join(__dirname, '../data')
        })
    }

});


module.exports = router;
