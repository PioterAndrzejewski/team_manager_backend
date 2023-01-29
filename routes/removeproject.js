const express = require('express');
const router = express.Router();
const {readFile, writeFile,  mkdir, copyFile, rm} = require('fs').promises;
const {join, dirname, basename, extname, normalize, resolve} = require('path');
const multer  = require('multer');
const getFile = multer();

const safeJoin = require('../utils/safeJoin')

const PROJECTS_LIST_FILE = './data/projectsList.json'


router.post('/', getFile.none(), async (req, res) => {
    console.log(req.body)

    const projectsListDataFromFile = await readFile(PROJECTS_LIST_FILE, 'utf8');
    const projectsList = JSON.parse(projectsListDataFromFile);
    const updatedProjectsList = projectsList.filter(project => project.projectId !== parseInt(req.body.projectId));
    const newProjectsListJSON = JSON.stringify(updatedProjectsList);
    await writeFile(PROJECTS_LIST_FILE, newProjectsListJSON);


    const projectPath = safeJoin(dirname(__dirname), `./data/${req.body.projectId}/`);
    console.log(projectPath)
    rm(projectPath, { recursive: true, force: true });

    const response = JSON.stringify({
        success: true,
    })
    res.end(response)
});

module.exports = router;
