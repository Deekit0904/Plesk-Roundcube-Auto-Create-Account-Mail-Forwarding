const axios = require('axios');
const https = require('https');
const { getRoundCubeToken } = require('./roundcubeLogin')

const configForwardEmail = async (endpoint, accessToken, ForwardedMail) => {
    try {
        const token = await getRoundCubeToken(String(endpoint), accessToken);

        const _token = String(token._token).split('">')[0];
    
        const formEncoded = new URLSearchParams();
        formEncoded.append('_token', _token);
        formEncoded.append('_task', 'settings');
        formEncoded.append('_action', 'plugin.managesieve-save');
        formEncoded.append('_framed', '1');
        formEncoded.append('_fid', '');
        formEncoded.append('_name', 'Forward');
        formEncoded.append('_enabled', '1');
        formEncoded.append('_join', 'any');
        formEncoded.append('_header[0]', 'subject');
        formEncoded.append('_custom_header[0][]', '');
        formEncoded.append('_custom_var[0][]', '');
        formEncoded.append('_rule_date_part[0]', 'date');
        formEncoded.append('_rule_message[0]', 'duplicate');
        formEncoded.append('_rule_op[0]', 'contains');
        formEncoded.append('_rule_target[0][]', '');
        formEncoded.append('_rule_size_op[0]', 'over');
        formEncoded.append('_rule_size_target[0]', '');
        formEncoded.append('_rule_size_item[0]', '');
        formEncoded.append('_rule_spamtest_op[0]', '');
        formEncoded.append('_rule_spamtest_target[0]', '1');
        formEncoded.append('_rule_mod[0]', '');
        formEncoded.append('_rule_mod_type[0]', 'all');
        formEncoded.append('_rule_comp[0]', '');
        formEncoded.append('_rule_mime_part[0]', '');
        formEncoded.append('_rule_mime_type[0]', '');
        formEncoded.append('_rule_mime_param[0][]', '');
        formEncoded.append('rule_trans[0]', 'text');
        formEncoded.append('_rule_trans_type[0]', '');
        formEncoded.append('_rule_date_header[0]', '');
        formEncoded.append('_rule_index[0]', '');
        formEncoded.append('_rule_duplicate_handle[0]', '');
        formEncoded.append('_rule_duplicate_header[0]', '');
        formEncoded.append('_rule_duplicate_uniqueid[0]', '');
        formEncoded.append('_rule_duplicate_seconds[0]', '');
        formEncoded.append('_action_type[0]', 'redirect_copy');
        formEncoded.append('_action_target[0]', ForwardedMail);
        formEncoded.append('_action_target_area[0]', '');
        formEncoded.append('_action_reason[0]', '');
        formEncoded.append('_action_subject[0]', '');
        formEncoded.append('_action_from[0]', '');
        formEncoded.append('_action_addresses[0][]', '');
        formEncoded.append('_action_interval[0]', '');
        formEncoded.append('_action_flags[0][]', '');
        formEncoded.append('_action_varname[0]', '');
        formEncoded.append('_action_varvalue[0]', '');
        formEncoded.append('_action_notifymethod[0]', 'mailto');
        formEncoded.append('_action_notifytarget[0]', '');
        formEncoded.append('_action_notifymessage[0]', '');
        formEncoded.append('_action_notifyfrom[0]', '');
        formEncoded.append('_action_notifyimportance[0]', '2');
        formEncoded.append('_action_notifyoption[0][]', '');
        formEncoded.append('_action_mailbox[0]', 'INBOX');
        
        const response = await axios({
            method: 'POST',
            url: endpoint,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Length': formEncoded.length,
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Referer': endpoint,
                'Cookie':accessToken
            },
            maxRedirects: 0,
            validateStatus: null,
            //ignore SSL certificate
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            data: formEncoded
        })
    
        return response.status === 200 ? {
            status: 'success',
            message: 'Configured Forwarding email successfully'
        } : {
            status: 'error',
            message: 'Failed to configure Forwarding email'
        }
    } catch (e) {
        throw new Error(e)
    }
    // try {
    // } catch (e) {
    //     throw new Error(e)
    // }
}

module.exports = {
    configForwardEmail
}