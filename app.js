// Require Express
const express = require('express');

const app = express();

// Require projects data
const { projects } = require('./data.json');

// Set up view engine
app.set('views', 'views');
app.set('view engine', 'pug');

// Set up static files
app.use('/static', express.static('public'));

// Set up index route
app.get('/', (req, res) => {
    res.render('index', { projects });
});

// Set up 'about' route
app.get('/about', (req, res) => {
    res.render('about');
});

// Set up projects routes
app.get('/project/:id', (req, res) => {
    const { id } = req.params;
    if (projects[id]) {
        const project = projects[id];
        res.render('project', { project });
    } else {
        // Create a 404 error object if id does not exist
        const err = new Error();
        err.message = `The project you requested does not exist.`
        err.status = 404;
        throw err;
    }
});

// 404 error handler to catch non-existent route requests
app.use((req, res, next) => {
    const err = new Error();
    err.message = 'Page not found!';
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    if (err) {

        if (err.status === 404) {
            res.status(404);
            res.render('page-not-found', { err });
        } else {
            err.message = err.message || 'Oops! Something went wrong.';
            res.status(err.status || 500);
            res.render('error', { err });
        }
        console.log('Global error handler called:', err.message);
    }
});

// Add listener on port 3000
app.listen(3300, () => {
    console.log('The application is running on localhost:3000!');
});
