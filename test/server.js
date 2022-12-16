const express = require("express");
const path = require("path");
const axios = require('axios');
const { readFileSync } = require("fs");
const jwt = require('json-web-token');
const app = express();
const sqlite3 = require('sqlite3');
const server = require("https").createServer({
    cert: readFileSync(path.join(__dirname, "/ssl/cert.pem")),
    key: readFileSync(path.join(__dirname, "/ssl/key.pem"))
}, app);

const db = new sqlite3.Database(path.join(__dirname, "database.db"));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS userinfo (msnv INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, fullname TEXT, role TEXT, picture TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS tasks (taskid INTEGER PRIMARY KEY AUTOINCREMENT, jobname TEXT, start TEXT, end TEXT, description TEXT, assignEmail TEXT, workerEmail TEXT, location TEXT, status TEXT)");
    db.run("INSERT or IGNORE INTO userinfo(email, fullname, role, picture) VALUES (?,?,?,?)", ["binh.nguyen288@hcmut.edu.vn", "Bình Nguyễn Thế", "backofficer", "https://lh3.googleusercontent.com/a/AEdFTp5y1U79SgAUua4YXm0yX2JnW-Z4XoHHgHZ6L18z=s96-c"]);
});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json())

io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
});


async function getDistanceMatrix(points) {
    const { data } = await axios.get('https://rsapi.goong.io/DistanceMatrix', {
        params: {
            origins: points.join('|'),
            destinations: points.join('|'),
            vehicle: 'truck',
            api_key: 'kUaBX9nRKvgbg8oJa325vHuvd9aArxoJmRBiHIlM'
        }
    });
    const nPoints = points.length;
    let distance_matrix = new Float32Array(nPoints ** 2);
    for (let i = 0; i < nPoints; ++i) {
        for (let j = 0; j < nPoints; ++j) {
            distance_matrix[i * nPoints + j] = data.rows[i].elements[j].distance.value;
        }
    }
    return distance_matrix;
}

const JWT_SECRET = "uwc2 is da best";
const CLIENT_ID = '126370380117-jot44828cqfii06v3narofen8s2q5h51.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const googleAuthUrl = `${new URLSearchParams({
    redirect_uri: 'https://uwc.ddns.net/login/callback',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code"    
}).toString()}&code=`;
app.get('/login/callback', async (req, res) => {
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', googleAuthUrl + req.query.code, {
            headers: { 'Accept-Encoding': ''}
        });
        const jsonstr = Buffer.from(data.id_token.split('.')[1], "base64url").toString("utf-8");
        const { name, picture, email } = JSON.parse(jsonstr);
        
        db.run("INSERT or IGNORE INTO userinfo(email, fullname, role, picture) VALUES (?,?,?,?)", [email, name, "janitor", picture], (err) => {
            if (err) return;
            
            const { error, value } = jwt.encode(JWT_SECRET, JSON.stringify({ email }));
            if (error) throw error;
            res.cookie("info", value, {
                maxAge: 3600 * 1000,
                secure: true,
                httpOnly: true
            }).redirect(`/?${new URLSearchParams({
                picture,
                name,
            }).toString()}`);
        });
       
        
    } catch (e) {
        console.log(e);
    }
});
const nativeAddon = require(path.join(__dirname, '/build/Release/nativeAddon'));
app.get("/api/optimalRoute", async (req, res) => {

    db.all("SELECT * FROM tasks", async (err, data) => {
        if (err) {
            res.end("error");
            return;
        }
        const points = ["10.7590557,106.658573", ...data.filter(v => v.status === "completed").map(v => v.location.split(";")[0])];
        const dist = await getDistanceMatrix(points);
        const ret = nativeAddon.shortestRoute(dist, points.length).split(',');
        res.json([ret[0], ret[1], ret[2], ...ret.slice(3).map(v => points[v])]);
    });
    
});

app.post("/api/assignTask", async (req, res) => {
    const {jobname, start, end, description, location, workerEmail, assignEmail} = req.body;
    const insertParams = [jobname, start, end, description, location, workerEmail, assignEmail, "incompleted"];
    if (insertParams.some(v => v === undefined)) {
        res.end("error");
        return;
    }
    db.run("INSERT INTO tasks(jobname,start,end,description,location,workerEmail,assignEmail,status) VALUES (?,?,?,?,?,?,?,?)",
           insertParams, (err) => {
        
        err ? res.end("error") : res.end();
    });
});

app.get("/api/getUsersInfo", async (req, res) => {
    db.all("SELECT * FROM userinfo", (err, rows) => {
        err ? res.end("error") : res.json(rows);
    });
});

app.get("/api/getTasks", async (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        err ? res.end("error") : res.json(rows);
    });
});


app.get("/api/completeTask", async (req, res) => {
    db.run('UPDATE tasks SET status="completed" WHERE taskid=?', [parseInt(req.query.taskid)], (err) => {
        err ? res.end("error") : res.end();
    });
})

server.listen(5000);

