const express = require('express');
const router = express.Router();
const {readFile, writeFile} = require('fs').promises;
const {join} = require("path");
const multer  = require('multer');
const upload = multer();

router.post('/', upload.single('avatar'), async (req, res) => {
    const projectDataJSON = await readFile(`./data/${req.body.projectId}/data.json`);
    const projectData = JSON.parse(projectDataJSON);
    let memberId;
    let imageToSavePath;
    if (req.body.mode === "create") {
        const teamMembersCount = projectData.projectMembers.length;
        if (teamMembersCount === 0) {
            memberId = 0;
        } else {
            memberId = projectData.projectMembers[teamMembersCount - 1].memberId + 1;
        }
        imageToSavePath = `./data/${projectData.projectId}/img/face_member_${memberId}.${req.body.fileExtension}`;
        projectData.projectMembers.push({
            memberId,
            memberName: req.body.memberName,
            memberTasks: [],
            memberIsLeader: false,
            memberImageURL: `http://localhost:3636/getimage/${projectData.projectId}/face_member_${memberId}.${req.body.fileExtension}`,
        });
    }

    if (req.body.mode === "edit") {
        memberId = parseInt(req.body.memberToEditId);
        const index = projectData.projectMembers.findIndex(member => member.memberId === memberId);
        let avatarId = projectData.projectMembers[index].memberImage_ID;
        console.log(avatarId);
        if (avatarId === undefined) {
            avatarId = 0;
        } else {
            avatarId++;
        }
        projectData.projectMembers[index].memberName = req.body.memberName;
        imageToSavePath = `./data/${projectData.projectId}/img/face_member_${memberId}_${avatarId}.${req.body.fileExtension}`;
        projectData.projectMembers[index].memberImageURL = `http://localhost:3636/getimage/${projectData.projectId}/face_member_${memberId}_${avatarId}.${req.body.fileExtension}`;
    }
    await writeFile(imageToSavePath, req.file.buffer)
    await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));

    const response = JSON.stringify({
        creationSuccess: true,
        projectMembers: projectData.projectMembers,
    })
    res.send(response)
});


module.exports = router;
