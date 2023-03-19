const axios = require('axios')
const https = require('https')
const { getPleskToken } = require('./pleskLogin')

const createAccount = async (endpoint, pleskToken, user, password) => {
    try {

        const token = await getPleskToken(endpoint, pleskToken);

        const formEncoded = new URLSearchParams();
        //example data general%5BgeneralSection%5D%5Bname%5D=999999&general%5BgeneralSection%5D%5BloginAsUser%5D=0&general%5BgeneralSection%5D%5BloginAsUser%5D=1&general%5BgeneralSection%5D%5BexternalEmail%5D=&general%5BgeneralSection%5D%5Bpassword%5D=randompasswordxd&general-generalSection-password-generate-button=&general-generalSection-password-show-button=&general%5BgeneralSection%5D%5BpasswordConfirmation%5D=randompasswordxd&general%5BgeneralSection%5D%5Bpostbox%5D=0&general%5BgeneralSection%5D%5Bpostbox%5D=1&general%5BgeneralSection%5D%5BmboxQuotaValue%5D=-1&general-generalSection-mboxQuotaValue-selector=default&general%5BgeneralSection%5D%5Bdescription%5D=Username%3A+something&redirect%5BredirectSection%5D%5Benabled%5D=0&redirect%5BredirectSection%5D%5Bremove%5D=0&aliases%5BaliasesSection%5D%5BaliasesForm%5D%5Bc468396%5D%5BaliasName%5D=&aliases%5BaliasesSection%5D%5BaliasesForm%5D%5BdynamicSubFormTemplate%5D%5BaliasName%5D=&autoResponder%5BautoResponderSection%5D%5Benabled%5D=0&autoResponder%5BautoResponderSection%5D%5BcontentType%5D=text%2Fplain&autoResponder%5BautoResponderSection%5D%5Battachments%5D%5BdynamicSubFormTemplate%5D%5Bfile%5D=&autoResponder%5BautoResponderSection%5D%5BendDateEnabled%5D=0&hidden=&forgery_protection_token=83cdeeb9e00e2b62af41bc373b9f64b7
        formEncoded.append('general[generalSection][name]', user);
        formEncoded.append('general[generalSection][loginAsUser]', 0);
        formEncoded.append('general[generalSection][loginAsUser]', 1);
        formEncoded.append('general[generalSection][externalEmail]', '');
        formEncoded.append('general[generalSection][password]', password);
        formEncoded.append('general-generalSection-password-generate-button', '');
        formEncoded.append('general-generalSection-password-show-button', '');
        formEncoded.append('general[generalSection][passwordConfirmation]', password);
        formEncoded.append('general[generalSection][postbox]', 0);
        formEncoded.append('general[generalSection][postbox]', 1);
        formEncoded.append('general[generalSection][mboxQuotaValue]', -1);
        formEncoded.append('general-generalSection-mboxQuotaValue-selector', 'default');
        formEncoded.append('general[generalSection][description]', `Automation Added Username: ${user}`);
        formEncoded.append('redirect[redirectSection][enabled]', 0);
        formEncoded.append('redirect[redirectSection][remove]', 0);
        formEncoded.append('aliases[aliasesSection][aliasesForm][c468396][aliasName]', '');
        formEncoded.append('aliases[aliasesSection][aliasesForm][dynamicSubFormTemplate][aliasName]', '');
        formEncoded.append('autoResponder[autoResponderSection][enabled]', 0);
        formEncoded.append('autoResponder[autoResponderSection][contentType]', 'text/plain');
        formEncoded.append('autoResponder[autoResponderSection][attachments][dynamicSubFormTemplate][file]', '');
        formEncoded.append('autoResponder[autoResponderSection][endDateEnabled]', 0);
        formEncoded.append('hidden', '');
        formEncoded.append('forgery_protection_token', token);
        

        const reponse = await axios({
            method: 'post',
            url: endpoint,
            headers: {
                'Cache-Control': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Forgery-Protection-Token': token,
                'Referer': endpoint,
                'Cookie': pleskToken,
                'Content-Length': formEncoded.length,
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            data: formEncoded,
        })

        if (reponse.data.status === 'success') {
            return {
                status: 'success',
                email: `${user}@schooldot.app`,
                password: password,
            }
        } else {
            throw new Error(reponse.data)
        }
    } catch (e) {
        throw new Error(e.response.data)
    }
}

module.exports = {
    createAccount
}