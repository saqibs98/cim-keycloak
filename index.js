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

  //module.exports.log = function () { 
    const userAuthentication = () =>  {
      //----------------------------
        const requestBody = {
          username: "agent1",//req.body.username,
          password: "agent1",//req.body.password,
          client_id: "Bank",//process.env.CLIENT_ID || "Bank",
          client_secret: '2e991b1c-d340-437d-91a2-620465c51a4e', //process.env.CLIENT_SECRET || '2e991b1c-d340-437d-91a2-620465c51a4e',
          grant_type:  'password' //process.env.GRANT_TYPE || 'password'
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
            //console.log("/////Access Token: "+(response.data.access_token));
            if(response.data.access_token){
              var requestBody2 = {
                grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
                audience: "Bank",//process.env.CLIENT_ID || "Bank",
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
                  client_id: "Bank",//process.env.CLIENT_ID || "Bank",,
                  client_secret: '2e991b1c-d340-437d-91a2-620465c51a4e', //process.env.CLIENT_SECRET || '2e991b1c-d340-437d-91a2-620465c51a4e',
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
                      ///////////////////////////////////////////////////////////console.log("/////Introspection ",responses);
                      return responsess.data;
                     // res.send({data:responses.data});
                    })
                    .catch((er) => {
                      console.log(er);
                      res.status(err.response.status).send({ error: "------------Intro Error--------"});
                    })
      
              // responses.data.access_token=token;
                //console.log("///// RPT  ",responses);
                //res.send({data:responses.data});
                //return responses.data;
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
        };

        exports.userAuthentication=userAuthentication;