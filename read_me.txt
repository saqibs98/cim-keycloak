************** NPM FOR KEYCLOAK AUTHENTICATION AND AUTHORIZATION ******************

1. run npm init
2. sudo npm install nodemon
3. 
* To install this npm run "sudo npm install cim-keycloak"

    It will create a folder in your directory called "node_modules" in which all the modules(dependancies required to run cim-keycloak) are present including 'cim-keycloak'

* This module needs 2 files in your root directory to run smoothly. Following are the file names:

            1. keycloak.json
            2. nodemon.json

    Structure of keycloak.json is given below:

                {
                    "realm": "**********",
                    "auth-server-url": "http://"host_address:port"/auth/",
                    "ssl-required": "external",
                    "resource": "resource-name",
                    "verify-token-audience": true,
                    "credentials": {
                    "secret": "client_secret"
                    },
                    "confidential-port": 0,
                    "policy-enforcer": {}
                }

            This file can be downloaded from the keycloak.  // realm/client/installation/select format/ -


    Structure of nodemon.json is given below:


                {
                    "env": {
                        "CLIENT_ID":"client-name",
                        "CLIENT_SECRET":"*********************",
                        "GRANT_TYPE":"password",
                        "HOST":"host name",
                        "PORT":"port no",
                        "REALM":"realm name"
                    }
                }


You can use ask keycloak to authenticate user by making a function call.
UserAuthentication is a function defined in "./node_modules/cim-keycloak/index"
    This function will take 2 parameters. First is :username, sencond is :password



Following is a demo code to get the user authenticate from keycloak.


//   D.E.M.O   A.U.T.H.E.N.T.I.C.A.T.I.O.N

var user = require('./node_modules/cim-keycloak/index');

user.userAuthentication('agent1','agent1').then((e)=>{
  console.log("Response from Keycloak: (You will recieve an object) " + e.data);
}).catch( (er)=>{
  console.log("401 - User does not exist in keycloak : " + er);
})

