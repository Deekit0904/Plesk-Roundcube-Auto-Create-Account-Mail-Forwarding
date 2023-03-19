const axios = require('axios')
const https = require('https')
const FormData = require('form-data')

const getPleskToken = async (endpoint, pleskSSID) => {
    
    try {
        const response = await axios({
            method: 'get',
            url: endpoint,
            headers: {
                'Cache-Control': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                ...(pleskSSID && { Cookie: pleskSSID })
            },
            //ignore SSL certificate
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        const data = response.data;

        //extrac token from <meta name="forgery_protection_token" id="forgery_protection_token" content="5f1da97665e8f3e82c5993ad94b27797">
        const token = data.match(/<meta name="forgery_protection_token" id="forgery_protection_token" content="(.*)">/)[1]

        return token
    } catch (e) {
        throw new Error(e)
    }
}


const GetPleskSSID = async (endpoint, user, password) => {

    try {

        let formdata = new FormData();
        formdata.append('login_name', user);
        formdata.append('passwd', password);
        formdata.append('locale_id', 'default');

        const getToken = await getPleskToken(endpoint)

        const response = await axios({
            method: 'post',
            url:  endpoint,   //'https://webmail.schooldot.app:8443/login_up.php',
            headers: {
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Forgery-Protection-Token': getToken,
                'Referer': endpoint,
                ...formdata.getHeaders()
            },
            data: formdata,
            //ignore SSL certificate
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        if (response.headers['set-cookie']) {
            return response.headers['set-cookie'][0].split(';')[0]
        } else {
            throw new Error('No cookie found')
        }
    } catch (e) {
        throw new Error(e)
    }

}

module.exports = {
    GetPleskSSID: GetPleskSSID,
    getPleskToken: getPleskToken
}