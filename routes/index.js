const express = require('express');
const router = express.Router();
const axios = require('axios')
const querystring = require('querystring');
const https = require("https");

/* DynamicDNS Logic. */
router.get('/', function (req, res, next) {
    if(!req.headers.authorization){
        res.json({
            ERROR: "Basic Auth not included. SELF DESTRUCT SEQUENCE INITIATED!"
        });
        return;
    }
    const basicAuth = (req.headers.authorization.split(' '))[1]
    const [username, password] = new Buffer.from(basicAuth, 'base64').toString('utf8').split(':');

    //Admin Credentials
    const hst_hostname = req.query.hostname;
    const hst_port = parseInt(req.query.port);
    const hst_username = username;
    const hst_password = password;
    const hst_returncode = 'yes';
    const hst_command = 'v-change-dns-record';
    const user = req.query.user;
    const domain = req.query.domain;
    const id = req.query.id;
    const record = req.query.record;
    const type = req.query.type;
    const ip = req.query.ip || req.headers['x-forwarded-for'];
    const priority = req.query.priority || '';
    const restartDNSServer = req.query.restartDNSServer || 'yes';
    const ttl = req.query.ttl || '60';

    if(!hst_hostname){
        res.json({
            ERROR: "Hestia hostname not found. You must include a hostname to connect through"
        });
    }
    if(!hst_port){
        res.json({
            ERROR: "Hestia port not found. You must include a port to connect through"
        });
    }
    if(!user){
        res.json({
            ERROR: "User not found. You must include a user to update your dns record"
        });
    }
    if(!domain){
        res.json({
            ERROR: "Domain not found. You must include a domain to update your dns record"
        });
    }
    if(!id){
        res.json({
            ERROR: "ID not found. You must include an id to update your dns record"
        });
    }
    if(!record){
        res.json({
            ERROR: "Record not found. You must include a record to update your dns record"
        });
    }
    if(!type){
        res.json({
            ERROR: "Type not found. You must include a type for your dns record"
        });
    }
    if(!ip){
        res.json({
            ERROR: "IP not found. You must include an IP address"
        });
    }

    const data_json = {
        'user': hst_username,
        'password': hst_password,
        'returncode': hst_returncode,
        'cmd': hst_command,
        'arg1': user,
        'arg2': domain,
        'arg3': id,
        'arg4': record,
        'arg5': type,
        'arg6': ip,
        'arg7': priority,
        'arg8': restartDNSServer,
        'arg9': ttl
    }

    const data = querystring.stringify(data_json)

    const axiosAgent = new https.Agent({family: 4});

    axios.post('https://' + hst_hostname + ':' + hst_port + '/api/', data, { httpsAgent: axiosAgent})
        .then(function (response) {
            if(response.data===0||response.data===4){
                res.json({
                    success: 'ok',
                    ip: ip
                });
                return;
            } else {
                res.json({
                    ERROR: response.data
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            res.json({
                ERROR: error
            });
        });
});

module.exports = router;
