const { GetPleskSSID } = require('./pleskLogin')
const { createAccount } = require('./pleskCreateMailAccount')
const { getRoundcubeAccessToken } = require('./roundcubeLogin')
const { configForwardEmail } = require('./roundcubeConfig')

const main = async () => {
    const pleskSSID = await GetPleskSSID('https://webmail.schooldot.app:8443/login_up.php', 'user', 'password')

    const testUsername = '12345'
    const defaultRandomedPassword = 'b9uwoj4rjal3'
    const testForwardEmail = 'something@example.com'

    const create = await createAccount('https://webmail.schooldot.app:8443/smb/email-address/create/domainId/19', pleskSSID, testUsername, defaultRandomedPassword)

    const roundcubeAccessToken = await getRoundcubeAccessToken('https://webmail.schooldot.app/?_task=login', create.email, create.password)
    

    const configForawrd = await configForwardEmail('https://webmail.schooldot.app/', roundcubeAccessToken, testForwardEmail)

    console.log(configForawrd)
}

main()