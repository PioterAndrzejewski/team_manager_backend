const {normalize, resolve} = require("path")

function safeJoin(base, target) {
    const targetPath = "." + normalize('/' + target);
    return resolve(base, targetPath)
}

module.exports = safeJoin;