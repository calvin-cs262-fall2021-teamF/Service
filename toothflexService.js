/**
 * This module implements a REST-inspired webservice for the Monopoly DB.
 * The database is hosted on ElephantSQL.
 *
 * Currently, the service supports the player table only.
 *
 * To guard against SQL injection attacks, this code uses pg-promise's built-in
 * variable escaping. This prevents a client from issuing this URL:
 *     https://cs262-monopoly-service.herokuapp.com/players/1%3BDELETE%20FROM%20PlayerGame%3BDELETE%20FROM%20Player
 * which would delete records in the PlayerGame and then the Player tables.
 * In particular, we don't use JS template strings because it doesn't filter
 * client-supplied values properly.
 *
 * TODO: Consider using Prepared Statements.
 *      https://vitaly-t.github.io/pg-promise/PreparedStatement.html
 *
 * @author: kvlinden
 * @date: Summer, 2020
 */

// Set up the database connection.
const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/users", readUsers);
router.get("/users/:id", readUser);
router.get("/auth/:email/:password", authenticateUser);
router.get("/brushLogs", readBrushLogs);
router.put("/users/:id/freq/:freq", updateFreqGoal);
router.put("/users/:id/time/:time", updateTimeGoal);
router.put("/users/:id/username/:username", updateUsername);
router.put("/users/:id/name/:name", updateName);
router.put("/users/:id/email/:email", updateEmail);
router.put("/users/:id/password/:password", updatePassword);
// router.put("brushLogs/:id", addNewLog);

app.use(router);
app.use(errorHandler);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function errorHandler(err, req, res) {
    if (app.get('env') === "development") {
        console.log(err);
    }
    res.sendStatus(err.status || 500);
}

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

function readHelloMessage(req, res) {
    res.send('Hello, welcome to ToothFlex service!');
}

function readUsers(req, res, next) {
    db.many("SELECT * FROM Users")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readUser(req, res, next) {
    db.one("SELECT * FROM Users WHERE id=${id}", req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}

function readBrushLogs(req, res, next) {
    db.many("SELECT * FROM Logs", req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}

function authenticateUser(req, res, next) {
    db.one("SELECT * FROM Users WHERE email=${email} AND password=${password}", req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}

function updateFreqGoal(req, res, next) {
    db.oneOrNone('UPDATE Users SET freqGoal=${freq} WHERE id=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateTimeGoal(req, res, next) {
    db.oneOrNone('UPDATE Users SET timeGoal=${time} WHERE id=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateName(req, res, next) {
    db.one('UPDATE Users SET name=${name} WHERE id=${id} RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function updateUsername(req, res, next) {
    db.one('UPDATE Users SET username=${username} WHERE id=${id} RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}
function updateEmail(req, res, next) {
    db.one('UPDATE Users SET email=${email} WHERE id=${id} RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function updatePassword(req, res, next) {
    db.one('UPDATE Users SET password=${password} WHERE id=${id} RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function addNewLog(req, res, next) {
    db.oneOrNone('INSERT INTO Logs (ID, userID, brushDate, duration) VALUES (?, ?, ?)', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}