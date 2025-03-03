# Quill defined errors
includes errors, Why they occurred, and sometimes a possible solution

# Type Errors!

## InvalidType ```QJSErrorCodes.InvalidType```
> error occurs when an invalid type is detected! 
> - @output ```The type of ${prop} Must be a ${must}```
>
> Possible solutions:
>   1) Make The Type of the variable match the proper one.

## InvalidPasswordType ```QJSErrorCodes.InvalidPasswordType```
> Error occurs when the password is not a string
> - @output ```The ${Password} must be the type of String```

## InvalidUsernameType ```QJSErrorCodes.InvalidUsernameType```
> Error occurs when the password is not a string
> - @output ```The ${Username} must be the type of String```

---

# Client Errors

## clientInvalidOption ```QJSErrorCodes.ClientInvalidOption```
> error occurs when the client is initialized with a option that is not valid.
> - @output ```The option "${Option}" is not a valid option.```
>
> Possible solutions:
>   1) Remove option and try again
>   2) Check spelling and try again

## clientInvalidDriver ```QJSErrorCodes.clientInvalidDriver```
> Error occurs when the client try's to initialize with a driver that dose not exist.
> - @output ```The ${Driver} option must be one of ${Valid Drivers}```
>
> Possible solutions:
>   1) Check you have the browser installed on your machine.
>   2) Make Shure the first letter is lowercase.

## clientMissingDriver ```QJSErrorCodes.clientMisingDriver```
> Error occurs when the driver option was not provided as it is required.
> - @output ```The ${driver} option is requierd and must be one of ${Valid drivers}```
>
> Possible solutions:
>   1) Add the driver option
>   2) if added already check to see if it is one of the supported drivers.

## LoginCaptchaDetected ```QJSErrorCodes.LoginCaptchaDetected```
> Error occurs when a Re-Capta is detected
> - @output ```Captcha Detected! You must Either Solve it yourself, (or) Install a Captcha Solver Plugin if one ever comes out.```
>
> Possible solutions:
>   1) Use quill with "headless mode" set to false and when it gets to that point solve it yourself. NOTE: this has not been tested and is not guarantied to work
>   2) Login to account on another device or try on a different network. for example a HotSpot.

## LoginGatwayDetected ```QJSErrorCodes.LoginGatwayDetected```
> Error occurs when twitter detects unusual activity on your account and prevents you from logging in
> - @output ```Twitter has detected unusual activity on your account, and has prevented the bot from logging in.```
>
> Possible solutions:
>   1) Use a Vpn or Proxy. "NOT TESTED"
>   2) Wait a day or two for twitter to let you in. 

## UsernameNotFound ```QJSErrorCodes.UsernameNotFound```
> Error occurs when twitter did not recognize the inputted username as a valid username.
> - @output ```the username ${client.username} Is not registerd with twitter```
>
> Possible solutions:
>   1) Put the @ symbol in your twitter handle
>   2) Use your display name instead of your twitter handle.

## PasswordNotFound ```QJSErrorCodes.PasswordNotFound```    
> Error occurs when the password inputted is not the wright one for the account.
> - @output ```the password ${password} Is incorect for this account```
>
> Possible solutions:
>   1) Use the rite password.



