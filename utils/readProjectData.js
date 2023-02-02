const {readFile, writeFile} = require('fs').promises;

const readProjectData =async (projectId) => {
    const projectDataJSON = await readFile(`./data/${projectId}/data.json`);
    const projectData = JSON.parse(projectDataJSON);
    return projectData;
}

const writeProjectData =async (projectId, projectData) => {
    await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));
}


module.exports = {readProjectData, writeProjectData}
