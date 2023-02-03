const express = require('express');
const router = express.Router();
const {join} = require("path");

const {readProjectsList, checkProjectId} = require('../utils/projectsList')

const generateProjectDataPath = (requestedId) => {
    return `/${requestedId}/data.json`
}

router.get('/:id', async (req, res) => {
    const requestedId = parseInt(req.params.id);
    const projectsList = await readProjectsList();
    let projectIdValidation = await checkProjectId(projectsList, requestedId);
    if (projectIdValidation.projectDoesntExist) {
        const response = JSON.stringify(projectIdValidation);
        res.end(response)
        return;
    }

    const projectDataPath = generateProjectDataPath(requestedId);
    res.sendFile(projectDataPath, {
        root: join(__dirname, '../data')
    })
});


module.exports = router;
