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
const axios = require('axios')
const qs = require('querystring');
const { resolve } = require('path');
const { rejects } = require('assert');

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

    const userAuthentication = (user_name,user_password) => {

      return new Promise((resolve, reject) => {

        const requestBody = {
          username: user_name ,
          password: user_password ,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: process.env.GRANT_TYPE,          
        }
        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
        
      const x={
        realm_name : process.env.REALM,
        port: process.env.PORT,
        host: process.env.HOST
      }
      const URL =  'http://'+x.host+':'+x.port+'/auth/realms/'+x.realm_name+'/protocol/openid-connect/token'

        //  T.O.K.E.N   R.E.Q.U.E.S.T   # 1   ( P.E.R.M.I.S.S.I.O.N.S   N.O.T    I.N.C.L.U.D.E.D)   
        
        axios.post(URL, qs.stringify(requestBody), config)
          .then((response) => {
            if(response.data.access_token){
              var requestBody1 = {
                grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
                audience: process.env.CLIENT_ID
              }
              token = response.data.access_token;
              
              const config1 = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json',
                  'Authorization' : 'Bearer '+ token,
                }
              }

        //  T.O.K.E.N   R.E.Q.U.E.S.T   # 2   (A.C.C.E.S.S   T.O.K.E.N   W.I.T.H   P.E.R.M.I.S.S.I.O.N.S)    

            axios.post(URL, qs.stringify(requestBody1), config1)
                  .then((responses) => {
                token = responses.data.access_token;
                var requestBody2 = {
                  client_id: process.env.CLIENT_ID,
                  client_secret: process.env.CLIENT_SECRET, 
                  token: token,
                  grant_type: process.env.GRANT_TYPE 
                }
                const config3 = {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                  }
                }
        //    I.N.T.R.O.S.P.E.C.T.I.O.N
                    axios.post(URL+'/introspect', qs.stringify(requestBody2), config3)
                    .then((responsess) => {
                      responsess.data.access_token=token;
                     // console.log("/////Introspection ",responsess);
                      resolve(responsess);

                    })
                    .catch((er) => {
                      reject(er);
                    })
              })
              .catch((er) => {
                reject(er);
              })
      
            }
          })
          .catch((err) => {
            reject(err);
          })
        });
      }
 
      module.exports= {userAuthentication};


      // F.U.N.C.T.I.O.N   C.A.L.L.I.N.G
  userAuthentication('agent1','agent1').then((e)=>{
    console.log("result : ///// " + e.data);
  }).catch( (er)=>{
    console.log("reject error : " + er);
  })
