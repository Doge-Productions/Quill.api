'use strict';
const fs = require('fs'); // <-- File System for cookies --
const { QuillJsTypeError, ErrorCodes, QuillJsError } = require('../errors/index.js'); //<-- Import Error System --
const { resolve } = require('path');

/**
 * Saves all exported cookies into local storage .json file. | MAKE SHURE TO LOOK THIS CODE OVER IF YOU DID NOT DOWNLODE QUILL FROM THE OFICHIAL NPM OR GITHUB REPOSITORY.
 * @param {cookies} cookies The cookies to be saved.
 * @param {path} path the path to the file you want to save them to. Has to be Specified. also a json
 * @param {savename} savename The username of the acc your want to save to
 * @returns <Promise> (resolve, reject)
 */
function Save(cookies, path, savename) {

    return new Promise((resolve, reject) => 
    {
        if(!path) path = 'Saved.json'; //<-- Defaiult file path if one is not specified

        try 
        {
            var jsonObjects = cookies;
            jsonObjects.forEach(function (jsonObject) 
            {
                if (jsonObject.hasOwnProperty("sameSite")) 
                    {
                        delete jsonObject.sameSite;
                    }
            });


            if(fs.existsSync(path)){

                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) {
                        reject(new QuillJsError(ErrorCodes.CookiesReadError, path, err));
                    } else {
                        let existingData = JSON.parse(data);
                        existingData[savename] = jsonObjects;
                        fs.writeFile(path, JSON.stringify(existingData, null, 2), (err) => {
                            if (err) {
                                reject(new QuillJsError(ErrorCodes.CookiesSaveError, jsonObjects, err));
                            } else {
                                resolve();
                            }
                        });
                    }
                });

            } else {

                fs.writeFile(path, "{}", () => { // the exact same but creating the file first insted

                    fs.readFile(path, 'utf8', (err, data) => {
                        if (err) {
                            reject(new QuillJsError(ErrorCodes.CookiesReadError, path, err));
                        } else {
                            let existingData = JSON.parse(data);
                            existingData[savename] = jsonObjects;
                            fs.writeFile(path, JSON.stringify(existingData, null, 2), (err) => {
                                if (err) {
                                    reject(new QuillJsError(ErrorCodes.CookiesSaveError, jsonObjects, err));
                                } else {
                                    resolve();
                                }
                            });
                        }
                    });

                });

            }


        } 
        finally 
        {   
            // resolve();
        }

    });   
}

/*
*Load And imports Cookies From One user only.
*/
function Load(Path, Username, driver){
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path)) {
            resolve(7)
        } else {
            fs.readFile(Path, 'utf8', (err, data) => {

                let cookies = JSON.parse(data);
                let cooks = cookies[Username];
                if (cookies[Username]) {
                    for(let i=0; i < cooks.length; i++){
                        if (cooks[i].hasOwnProperty("sameSite")) 
                        {
                            throw new QuillJsError(ErrorCodes.CookiesSSProp, cookies[i]);
                        } else {
                            driver.manage().addCookie(cooks[i]);
                        }
                    }
                } else {
                    throw new QuillJsError(ErrorCodes.CookiesLeekError, Username, "CookiesManeger: ", 166);
                }

                resolve(cooks);

            });
        }
    });
    
    
}

/**
 * Fully whipes cookies file. for sicurity conshous people.
 * @param {*} path 
 */
function wipeJSON(path)
{
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File is deleted.');
        }
      });
}

/**
 * Checks to see if an obdject existe inside of a given json file.
 * @param {*} path 
 * @param {*} username 
 * @returns 
 */
function objectExists(path, username){

    if(fs.existsSync(path)){
        let data = fs.readFileSync(path, 'utf8');
        var existingData = JSON.parse(data);
    }

    if (!fs.existsSync(path)) {
        return false;
    } else if(existingData.hasOwnProperty(username)){
        return true;
    }

    
}

module.exports = {
    Save,
    Load,
    wipeJSON,
    objectExists,
}