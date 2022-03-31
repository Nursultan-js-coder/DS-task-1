const fs = require("fs");
const path = require("path");
const {createLogger, transports, format} = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            filename: './logs/all-logs.log',
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new transports.Console(),
    ]
});

function directorySizeControllerMiddleware(req, res, next) {
    const dirPath = path.join(__dirname, "files");
    if (fs.statSync(dirPath).size.valueOf() > 10000) {
        process.stdout.write("Maximum size is exceeded (10MB):\n");
    }
    // process.stdout.write(`file created at: ${new Date().toLocaleDateString()}`)
    next();
}

module.exports = logger;


// module.exports = {
//     directorySizeControllerMiddleware,
// }
