const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());  // Middleware to parse JSON bodies
const logFilePath = './logs/browser.log';

// Ensure the logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}
app.post('/log', (req, res) => {
    const { message, optionalParams } = req.body;
    const logEntry = `${new Date().toISOString()} - ${message} ${JSON.stringify(optionalParams)}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log', err);
            return res.status(500).send('Failed to log message');
        }
        res.send('Log received');
    });
});
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Redefine console.log to write to both the console and the log file
const originalConsoleLog = console.log;
console.log = function(message, ...optionalParams) {
    const formattedMessage = `${new Date().toISOString()} - ${message} ${optionalParams.map(param => JSON.stringify(param)).join(' ')}\n`;
    originalConsoleLog(message, ...optionalParams);  // Keep the original console output
    logStream.write(formattedMessage);  // Write to the log file
};


// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
    console.log('Home Page Accessed');
});

app.get('/visualizing', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'visualizing.html'));
    console.log('Open Visualizing');
});
app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'calendar_year.html'));
    console.log('Open Calendar');
});
app.get('/video', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'video.html'));
    console.log('Open Video');
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




// Ensure that the streams are closed when the application exits
process.on('exit', () => {
    logFile.end();
    errorFile.end();
});
