import { inherits } from "util";
import { Stream } from "./tools/index";
import { IWebDriverOptionsCookie } from "selenium-webdriver";
import { List } from "./tools";
import fs from 'fs';

export class CookieHandler extends Stream<CustomCookie>
{
    public savePath: string;
    public cookies: List<CustomCookie>;
    
    constructor(savePath: string)
    {
        super();
        this.savePath = savePath;
        this.cookies = new List<CustomCookie>();
    }

    /**
     * Will send the cookies to a callback function so you can handle them yourself
     * @param callback 
     */
    public sendCookies(callback: (cookies: List<CustomCookie>) => void): void {
        callback(this.cookies);
    }

    /**
     * Will add a cookie to the list of cookies in a file
     * @param cookie
     */
    public async savecookiestofile(): Promise<void> 
    {
        fs.writeFileSync(this.savePath, JSON.stringify(this.cookies));
    }

    /**
     * will load the file contents into the classes cookies object
     * @returns void
     * @see CookieHandler.cookies
     */
    public async loadcookiesfromfile(): Promise<void> 
    {
        if (fs.existsSync(this.savePath))
        {
            var data = fs.readFileSync(this.savePath, 'utf-8');
            var cookies = JSON.parse(data);
            for (let cookie of cookies)
            {
                this.cookies.add(new CustomCookie(cookie));
            }
        }
    }

}

export class CustomCookie
{
    public name!: string;
    public value!: string;
    public path?: string | undefined;
    public domain?: string | undefined;
    public secure?: boolean | undefined;
    public httpOnly?: boolean | undefined;
    public expiry?: Date | number | undefined;
    public sameSite?: string | undefined;

    constructor(cookie?: IWebDriverOptionsCookie)
    {
        if (cookie)
        {
            this.name = cookie.name;
            this.value = cookie.value;
            this.path = cookie.path;
            this.domain = cookie.domain;
            this.secure = cookie.secure;
            this.httpOnly = cookie.httpOnly;
            this.expiry = cookie.expiry;
            this.sameSite = cookie.sameSite;
        }
    }

    toSeleniumCookie(): IWebDriverOptionsCookie 
    {
        return {
            name: this.name,
            value: this.value,
            path: this.path,
            domain: this.domain,
            secure: this.secure,
            httpOnly: this.httpOnly,
            expiry: this.expiry,
            sameSite: this.sameSite
        };   
    }
}