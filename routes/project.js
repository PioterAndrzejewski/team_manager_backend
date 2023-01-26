const express = require('express');
const router = express.Router();
const {readFile, writeFile,  mkdir, copyFile} = require('fs').promises;

const PROJECTS_LIST_FILE = './data/projectsList.txt'

const checkProjectId = async (requestedId) => {
    const projectsListDataFromFile = await readFile(PROJECTS_LIST_FILE, 'utf8');
    const projectsList = JSON.parse(projectsListDataFromFile);

    if (projectsList.some(project => project.projectId === requestedId)) {
        return {projectExists: true, message: "Project exists"};
    }
    return {projectExists: false, message: "There is no project under such ID"};
}

router.get('/:id', async (req, res) => {
    const requestedId = parseInt(req.params.id);
    let requestValidation = await checkProjectId(requestedId);
    console.log(requestValidation)
    if (!requestValidation.projectExists) {
        const response = JSON.stringify({
            projectExists: requestValidation.projectExists,
            redirect: "/",
            message: requestValidation.message,
        });
        res.end(response)
        return;
    }

    const response = JSON.stringify({

    })
    res.end(response)
});


module.exports = router;
