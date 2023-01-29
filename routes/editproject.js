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
    let updatedProjectsList;
    let response;

    if(req.body.mode === "remove") {
        updatedProjectsList = projectsList.filter(project => project.projectId !== parseInt(req.body.projectId));
        const projectPath = safeJoin(dirname(__dirname), `./data/${req.body.projectId}/`);
        rm(projectPath, { recursive: true, force: true });
        response = JSON.stringify({
            success: true,
            action: "remove",
        })
    }

    if(req.body.mode === "edit") {
        projectIndex = projectsList.findIndex(project => project.projectId === req.body.projectId);
        updatedProjectsList = projectsList.map(project => {
            if (project.projectId === req.body.projectId) {
                project.projectName = req.body.newProjectName;
            }
            return project;
        })

        const projectDataJSON = await readFile(`./data/${req.body.projectId}/data.json`);
        const projectData = JSON.parse(projectDataJSON);
        projectData.projectName = req.body.newProjectName;
        await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));

        response = JSON.stringify({
            success: true,
            action: "edit",
            newProjectName: projectData.projectName,
        })
    }

    const newProjectsListJSON = JSON.stringify(updatedProjectsList);
    await writeFile(PROJECTS_LIST_FILE, newProjectsListJSON);

    res.end(response)
});
module.exports = router;
