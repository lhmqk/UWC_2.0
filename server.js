const querystring = require('query-string');
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const axios = require('axios');

const server = require("https").createServer({
    cert: fs.readFileSync(path.join(__dirname, "ssl/cert.pem")),
    key: fs.readFileSync(path.join(__dirname, "ssl/key.pem"))
}, app);

app.use(express.static(path.join(__dirname, 'public')));

const { CLIENT_SECRET, JWT_SECRET } = require('./config')
const CLIENT_ID = '126370380117-jot44828cqfii06v3narofen8s2q5h51.apps.googleusercontent.com';


const googleLoginRedirect = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&prompt=select_account&redirect_uri=https%3A%2F%2Fuwc.ddns.net%2Flogin%2Fcallback&response_type=code&scope=profile`;
const googleAuthUrl = `${querystring.stringify({
    redirect_uri: 'https://uwc.ddns.net/login/callback',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code"    
})}&code=`;

const jwt = require('json-web-token');
app.get('/login', (req, res) => res.redirect(googleLoginRedirect))
app.get('/login/callback', async (req, res) => {
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', googleAuthUrl + req.query.code, {
            headers: { 'Accept-Encoding': ''}
        });
        const {
            sub: id,
            name: name,
            picture: picture
        } = JSON.parse(Buffer.from(data.id_token.split('.')[1], "base64url").toString("utf-8"));
        const { error, value } = jwt.encode(JWT_SECRET, JSON.stringify({ id, name, picture }));
        if (error) throw error;
        res.cookie("info", value, {
            maxAge: 3600 * 1000
        }).redirect(`/home.html?${querystring.stringify({
            picture,
            name,
        })}`);
    } catch (e) {
        console.log(e);
    }
});



server.listen(8080);

