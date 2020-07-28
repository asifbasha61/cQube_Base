const router = require('express').Router();
const bcrypt = require('bcrypt');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const axios = require('axios');
const qs = require('querystring');

const dotenv = require('dotenv');
dotenv.config();

var requestData = {
    username: process.env.KEYCLOAK_USER,
    password: process.env.PASSWORD,
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID
}

router.post('/', async function (req, res) {
    try {
        logger.info('---Create user api ---');

        var url = `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`;
        var response = await axios.post(url, qs.stringify(requestData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        var access_token = response.data.access_token;

        var usersUrl = "http://localhost:8080/auth/admin/realms/cQube/users";
        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + " " + access_token
        }

        var userDetails = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            credentials: [
                {
                    type: "password",
                    value: req.body.cnfpass,
                    temporary: false
                }
            ],
            enabled: "true"
        };

        axios.post(usersUrl, userDetails, { headers: headers }).then(resp => {
            res.status(201).json({ msg: "User Created" });
        }).catch(error => {
            res.status(409).json({ errMsg: error.response.data.errorMessage });
        })


    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }

});

router.post('/getAllUsers', async (req, res) => {
    try {
        logger.info('---Create user api ---');

        var url = `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`;
        var response = await axios.post(url, qs.stringify(requestData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        var access_token = response.data.access_token;

        var usersUrl = "http://localhost:8080/auth/admin/realms/cQube/users";
        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + " " + access_token
        }

        var users = await axios.get(usersUrl, { headers: headers });
        var user = users.data.find(o => o.email == req.body.email && o.username == req.body.username);
        res.status(200).json({ id: user.id });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

router.get('/roles', async (req, res) => {
    try {
        logger.info('---get roles api ---');

        var url = `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`;
        var response = await axios.post(url, qs.stringify(requestData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        var access_token = response.data.access_token;

        var usersUrl = "http://localhost:8080/auth/admin/realms/cQube/roles";
        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + " " + access_token
        }
        axios.get(usersUrl, { headers: headers }).then(resp => {
            res.status(201).json({ roles: resp.data });
        }).catch(error => {
            res.status(409).json({ errMsg: error.response.data.errorMessage });
        })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/setRoles', async (req, res) => {
    try {
        logger.info('---set roles api ---');
        ;

        var url = `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`;
        var response = await axios.post(url, qs.stringify(requestData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        var access_token = response.data.access_token;

        var userId = req.body.userId;
        var usersUrl = `http://localhost:8080/auth/admin/realms/cQube/users/${userId}/role-mappings/realm`;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + " " + access_token
        }
        var roleDetails = [
            {
                id: "c70bbc49-9531-42eb-8f61-e243074e3b02",
                name: "admin"
            }
        ];

        axios.post(usersUrl, roleDetails, { headers: headers }).then(resp => {
            res.status(201).json({ msg: "Role assigned" });
        }).catch(error => {
            res.status(409).json({ errMsg: error.response.data.errorMessage });
        })

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

module.exports = router;