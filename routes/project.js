const express = require('express');
const router = express.Router();
const {readFile, writeFile,  mkdir, copyFile} = require('fs').promises;
const {join} = require("path");

const PROJECTS_LIST_FILE = './data/projectsList.json'

const checkProjectId = async (requestedId) => {
    const projectsListDataFromFile = await readFile(PROJECTS_LIST_FILE, 'utf8');
    const projectsList = JSON.parse(projectsListDataFromFile);

    if (projectsList.some(project => project.projectId === requestedId)) {
        return {projectDoesntExist: false, message: "Project exists"};
    }
    return {projectDoesntExist: true, message: "There is no project under such ID"};
}

router.get('/:id', async (req, res) => {
    const requestedId = parseInt(req.params.id);
    let requestValidation = await checkProjectId(requestedId);
    if (requestValidation.projectDoesntExist) {
        const response = JSON.stringify({
            projectExists: requestValidation.projectExists,
            message: requestValidation.message,
        });
        res.end(response)
        return;
    }


    res.sendFile(`/${requestedId}/data.json`, {
        root: join(__dirname, '../data')
    })
});


module.exports = router;
