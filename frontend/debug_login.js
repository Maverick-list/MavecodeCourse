const axios = require('axios');

const AUTH_API = 'https://api.mavecode.my.id/api';
const credential = 'fake_credential_token_for_testing';

console.log('Testing Google Login Endpoint URL:', `${AUTH_API}/auth/google`);

axios.post(`${AUTH_API}/auth/google`, { token: credential })
    .then(res => {
        console.log('SUCCESS:', res.data);
    })
    .catch(err => {
        if (err.response) {
            console.log('SERVER RESPONSE STATUS:', err.response.status);
            console.log('SERVER RESPONSE DATA:', err.response.data);
            if (err.response.status === 404) {
                console.error('ERROR: 404 Not Found - The endpoint URL is incorrect or the server is not handling this route.');
            } else if (err.response.status === 400) {
                console.log('SUCCESS (Technically): The server was reached and rejected the fake token (expected behavior).');
                console.log('This confirms the URL https://api.mavecode.my.id/api/auth/google exists and is active.');
            }
        } else {
            console.error('NETWORK ERROR:', err.message);
        }
    });
