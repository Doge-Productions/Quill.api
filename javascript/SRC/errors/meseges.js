'use strict';

const QJSErrorCodes = require('./ErrorCodes');

const Messages = {
    [QJSErrorCodes.CustomError]: (prop) => `Error: ${prop}`,
    [QJSErrorCodes.PageCode404]: (prop) => `A comonent returend with an error code of 404. | detailed info: ${prop}`,

    [QJSErrorCodes.InvalidType]: (prop, must) => `The type of ${prop} Must be a ${must}`,
    [QJSErrorCodes.InvalidPasswordType]: (prop, must) => `The ${prop} option must be a ${must}`,
    [QJSErrorCodes.InvalidUsernameType]: (prop, must) => `The ${prop} option must be a ${must}`,

    [QJSErrorCodes.ClientInvalidOption]: (prop, must) => `The ${prop} option must be ${must}`,
    [QJSErrorCodes.clientMisingDriver]: (prop, must) => `The ${prop} option is requierd and must be of type ${must}`,
    [QJSErrorCodes.clientInvalidDriver]: (prop, must) => `The ${prop} option must be one of ${must}`,

    
    [QJSErrorCodes.LoginCaptchaDetected]: () => `Captcha Detected! You must Either Solve it yourself, (or) Install a Captcha Solver Plugin if one ever comes out.`,
    [QJSErrorCodes.LoginGatwayDetected]: (must) => `Twitter has detected unusual activity on your account, and has prevented the bot from logging in. TRY: ${must}`,
    [QJSErrorCodes.UsernameNotFound]: (prop, must) => `the username ${prop} Is not registerd with twitter . QPosition ${must}`,
    [QJSErrorCodes.PasswordNotFound]: (prop, must) => `the password ${prop} Is incorect for this account. QPosition ${must}`,

    [QJSErrorCodes.CookiesSaveError]: (prop, error) => `The cookies ${prop} could not be saved to a json file.\n\nOBJECT RETURN ERR: ${error}`,
    [QJSErrorCodes.CookiesReadError]: (prop, error) => `The cookies file at ${prop} could not be read.\n\nOBJECT RETURN ERR: ${error}`,
    [QJSErrorCodes.CookiesSSProp]: (prop) => `The cookies ${prop} has a sameSite property, which is not supported by the cookies manager. Please delete the cookies.json file and regenarate it.`,
    [QJSErrorCodes.CookiesLeekError]: (prop, after, exit) => `Cookies not found for the given username: ${prop} | ${after}. !If the given username returns with undifined ignore this and deleat the cookies file and retry!=> \x1b[31m Please contact a developer about this as it could be a serious security vulnerability allowing unauthorized access into your accounts! \x1b[0m Exit: ${exit}`, //<-- error for prosses crashig ass the anti leek code is running. causing a memory leak with all of your cookies and login information.

    [QJSErrorCodes.TweetTextAddError]: (prop, error) => `The text ${prop} could not be added to the tweet.\n\nOBJECT RETURN ERR: ${error}`,
    [QJSErrorCodes.TweetAlredySentError]: (prop) => `The tweet ${prop} has already been sent.`, //<-- Error Use Get Text method to get the error.
    [QJSErrorCodes.TweetSendRecivedError]: (prop, error) => `The tweet ${prop} could not be sent.\n\nOBJECT RETURN ERR: ${error}`, //<-- Error Use Get Text method to get the error.
}

module.exports = Messages;