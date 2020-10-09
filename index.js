var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var memoryStore = new session.MemoryStore();
var Keycloak = require('keycloak-connect');
const { request, response } = require('express');
var keycloak = new Keycloak({ store: memoryStore })
const { URLSearchParams } = require('url'); 
const fetch = require('node-fetch');
//const myrequest = require('request');
const axios = require('axios')
const qs = require('querystring')

app.use(session({
    secret: 'secret1',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
app.use( keycloak.middleware() )

    app.use(bodyParser.urlencoded({
        extended: true
    }));

app.use(bodyParser.json());
  /*
  module.exports.log = function (msg) { 
    console.log(msg);
  };*/

  module.exports.log = function () { 
    {
      //----------------------------
        const requestBody = {
          username: req.body.username,
          password: req.body.password,
          client_id: process.env.CLIENT_ID || "Course-management",
          client_secret: process.env.CLIENT_SECRET || '3c9b9454-fbe7-41a8-ac7d-e1b42b560d11',
          grant_type: process.env.GRANT_TYPE || 'password'
        }
        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
        //----------------------------
        let token;
        ///// token request 1
      
        axios.post('http://192.168.1.47:8080/auth/realms/university/protocol/openid-connect/token', qs.stringify(requestBody), config)
          .then((response) => {
            console.log("/////Access Token: "+(response.data.access_token));
            if(response.data.access_token){
              var requestBody2 = {
                grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
                audience: process.env.CLIENT_ID || "Course-management",
              }
              token = response.data.access_token;
              
              const config1 = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json',
                  'Authorization' : 'Bearer '+ token,
                }
              }
        ///// RPT request 
              axios.post('http://192.168.1.47:8080/auth/realms/university/protocol/openid-connect/token', qs.stringify(requestBody2), config1)
              .then((responses) => {
                token = responses.data.access_token;
                var requestBody1 = {
                  client_id: process.env.CLIENT_ID || "Course-management",
                  client_secret: process.env.CLIENT_SECRET || '3c9b9454-fbe7-41a8-ac7d-e1b42b560d11',
                  token: token,
                  grant_type: 'password',
                }
                const config3 = {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                  }
                }
                //------------- INTROSPECTION
                    axios.post('http://192.168.1.47:8080/auth/realms/university/protocol/openid-connect/token/introspect', qs.stringify(requestBody1), config3)
                    .then((responsess) => {
                      responsess.data.access_token=token;
                      console.log("/////Introspection ",responses);
                      res.send({data:responses.data});
                    })
                    .catch((er) => {
                      console.log(er);
                      res.status(err.response.status).send({ error: "------------Intro Error--------"});
                    })
      
              // responses.data.access_token=token;
                console.log("///// RPT  ",responses);
                res.send({data:responses.data});
              })
              .catch((er) => {
                console.log(er);
                res.status(err.response.status).send({ error: "-----RPT ERROR-----" });
              })
      
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(err.response.status).send({ error: "T---------token not found" });
          })
        }
  };