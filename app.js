const express = require('express');

const app = express();

const { projects } = require('./data.json');

app.set('views', 'views');
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    console.log(projects);
    res.render('index', { projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Viewing project with id ${id}`);
    if (projects[id]) {
        const project = projects[id];
        res.render('project', { project });
    } else {
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
        console.log('Global error handler called', { err });

        if (err.status === 404) {
            res.status(404);
            res.render('not-found', { err });
        } else {
            err.message = err.message || 'Oops! Something went wrong.';
            res.status(err.status || 500);
            res.render('error', { err });
        }
    }
});

app.listen(3081, () => {
    console.log('The application is running on localhost:3000!');
});