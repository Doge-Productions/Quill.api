'use strict';

/**
 * @property {'ErrorCodes.customE'} CustomError 

 * @property {'ErrorCodes.InvalidType'} InvalidType
 * @property {'InvalidPasswordType'} InvalidPasswordType
 * @property {'InvalidUsernameType'} InvalidUsernameType

 * @property {'ErrorCodes.PageCode404'} InvalidPageCode404

 * @property {'ClientInvalidOption'} clientInvalidOption
 * @property {'ClientInvalidDriver'} clientInvalidDriver
 * @property {'ClientMisingDriver'} clientMisingDriver

 * @property {'UsernameNotFound'} UsernameNotFound
 * @property {'PasswordNotFound'} PasswordNotFound
 * @property {'LoginCaptchaDetected'} loginCaptchaDetected
 * @property {'LoginGatwayDetected'} LoginGatwayDetected
 *

 * @property {'CookiesSaveError'} CookiesSaveError
 * @property {'CookiesReadError'} CookiesReadError
 * @property {'CookiesSSProp'} CookiesSSProp
 * @property {'CookiesLeekError'} CookiesLeekError // <-- should be completely fixed in the future. only an ishue for the beta.
 
 * @property {'TweetTextAddError'} TweetTextAddError
 * @property {'TweetAlredySentError'} TweetAlredySentError
 * @property {'TweetSendRecivedError'} TweetSendRecivedError
 */
const keys = [
'custom',

'InvalidType',
'InvalidPasswordType',
'InvalidUsernameType',

'PageCode404',

'clientInvalidOption',
'clientInvalidDriver',
'clientMisingDriver',

'UsernameNotFound',
'PasswordNotFound',
'loginCaptchaDetected',
'LoginGatwayDetected',

'CookiesSaveError',
'CookiesReadError',
'CookiesSSProp',
'CookiesLeekError',

'TweetTextAddError',
'TweetAlredySentError',
'TweetSendRecivedError'
];

module.exports = Object.fromEntries(keys.map(key => [key, key]));