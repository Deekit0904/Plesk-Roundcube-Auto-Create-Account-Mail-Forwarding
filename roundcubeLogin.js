const axios = require('axios');
const https = require('https');

const getRoundCubeToken = async (endpoint, accessToken) => {
    try {
        const response = await axios({
            method: 'get',
            url: endpoint,
            headers: {
                'Cache-Control': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
                ...(accessToken && { Cookie: accessToken })
            },
            //ignore SSL certificate
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        const data = response.data;

        //Extract token from <input type="hidden" name="_token" value="kV0PqxcF24INeu5O43bcMwfdxxoLoBrI">
        const token = data.match(/<input type="hidden" name="_token" value="(.*)">/)[1]

        return {
            _token: token,
            ssid: response.headers['set-cookie'] ? response.headers['set-cookie'][0].split(';')[0] : null
        }
    } catch (e) {
        throw new Error(e)
    }
}

const getRoundcubeAccessToken = async (endpoint, user, password) => {

    const token = await getRoundCubeToken(String(endpoint));
    
    try {
        let formEncoded = new URLSearchParams();

        //_token=kV0PqxcF24INeu5O43bcMwfdxxoLoBrI&_task=login&_action=login&_timezone=Asia%2FBangkok&_url=_user%3Ddeekit0904%2540schooldot.app&_user=999999%40schooldot.app&_pass=randompasswordxd
        formEncoded.append('_token', token._token);
        formEncoded.append('_task', 'login');
        formEncoded.append('_action', 'login');
        formEncoded.append('_timezone', 'Asia/Bangkok');
        formEncoded.append('_user', user);
        formEncoded.append('_url', '?_task=login');
        formEncoded.append('_pass', password);
    
    
        const response = await axios({
            method: 'post',
            url: endpoint,
            headers: {
                'Cache-Control': 'max-age=0',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': formEncoded.length,
                'Referer': String(endpoint),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Cookie': token.ssid
            },
            data: formEncoded,
            maxRedirects: 0,
            validateStatus: null,
            //ignore SSL certificate
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
    
        // return response.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';')
        //return map cookie and remove roundcube_sessauth=-del-;
        return response.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';').replace('roundcube_sessauth=-del-;', '')
    } catch (e) {
        throw new Error(e)
    }

}

module.exports = {
    getRoundCubeToken,
    getRoundcubeAccessToken
}