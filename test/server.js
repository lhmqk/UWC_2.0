const express = require("express");
const path = require("path");
const axios = require('axios');
const querystring = require('query-string');
const { readFileSync } = require("fs");
const jwt = require('json-web-token');

const app = express();
const server = require("https").createServer({
    cert: readFileSync("ssl/cert.pem"),
    key: readFileSync("ssl/key.pem")
}, app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));
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
const googleAuthUrl = `${querystring.stringify({
    redirect_uri: 'https://uwc.ddns.net/login/callback',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code"    
})}&code=`;

app.get('/login/callback', async (req, res) => {
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', googleAuthUrl + req.query.code, {
            headers: { 'Accept-Encoding': ''}
        });
        const jsonstr = Buffer.from(data.id_token.split('.')[1], "base64url").toString("utf-8");
        const {name, picture, email} = JSON.parse(jsonstr);
        const { error, value } = jwt.encode(JWT_SECRET, JSON.stringify({ email }));
        if (error) throw error;
        res.cookie("info", value, {
            maxAge: 3600 * 1000,
            secure: true
        }).redirect(`/?${querystring.stringify({
            picture,
            name,
        })}`);
    } catch (e) {
        console.log(e);
    }
});
const nativeAddon = require('./optimizer/build/Release/nativeAddon');
app.get("/api/optimalRoute", async (req, res) => {
    const { data } = await axios({
        method: "GET",
        url: "http://localhost/api/getTasks.php"
    });
    const points = ["10.7590557,106.658573", ...data.filter(v => v.status === "completed").map(v => v.location.split(";")[0])];
    const dist = await getDistanceMatrix(points);
    const ret = nativeAddon.shortestRoute(dist, points.length).split(',');
    res.json([ret[0], ret[1], ret[2], ...ret.slice(3).map(v => points[v])]);
});

app.post("/api/assignTask", async (req, res) => {
    console.log(req.body);
    const response = await axios({
        method: "POST",
        url: "http://localhost/api/assignTask.php",
        data: req.body
    })

    console.log(response.data);
    res.end();
});

app.get("/api/getUsersInfo", async (req, res) => {
    const response = await axios({
        method: "GET",
        url: "http://localhost/api/getUsersInfo.php"
    });
    res.json(response.data);
});

app.get("/api/getTasks", async (req, res) => {
    const response = await axios({
        method: "GET",
        url: "http://localhost/api/getTasks.php"
    });
    res.json(response.data);
});


app.get("/api/completeTask", async (req, res) => {
    res.end();
    const response = await axios({
        method: "GET",
        url: `http://localhost/api/completeTask.php?taskid=${req.query.taskid}`
    });
    console.log(response.data);
})

server.listen(5000);
