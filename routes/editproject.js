const express = require('express');
const router = express.Router();
const {rm} = require('fs').promises;
const {dirname} = require('path');
const multer  = require('multer');
const getFile = multer();

const safeJoin = require('../utils/safeJoin')
const {readProjectsList, writeProjectsList} = require('../utils/readProjectsList')
const {readProjectData, writeProjectData} = require('../utils/readProjectData')

const removeProject = (projectsList, projectId) => {
    updatedProjectsList = projectsList.filter(project => project.projectId !== parseInt(projectId));
    const projectPath = safeJoin(dirname(__dirname), `./data/${projectId}/`);
    rm(projectPath, { recursive: true, force: true });
}
const updateProjectsList = (projectsList, projectId, newProjectName) => {
    projectIndex = projectsList.findIndex(project => project.projectId === projectId);
    updatedProjectsList = projectsList.map(project => {
        if (project.projectId === projectId) {
            project.projectName = newProjectName;
        }
        return project;
    })
    return updatedProjectsList;
}


router.post('/', getFile.none(), async (req, res) => {
    let updatedProjectsList;
    let response;
    const projectsList = await readProjectsList();

    if(req.body.mode === "remove") {
        updatedProjectsList = removeProject(projectsList,req.body.projectId, req.body.newProjectName);
        response = JSON.stringify({
            success: true,
            action: "remove",
        })
    }
    if(req.body.mode === "edit") {
        updatedProjectsList = updateProjectsList(projectsList, req.body.projectId, req.body.projectName);
        const projectData = await readProjectData(req.body.projectId);
        projectData.projectName = req.body.newProjectName;
        await writeProjectData(req.body.projectId, projectData);
        response = JSON.stringify({
            success: true,
            action: "edit",
            newProjectName: projectData.projectName,
        })
    }

    await writeProjectsList(updatedProjectsList);
    res.end(response)
});
module.exports = router;





