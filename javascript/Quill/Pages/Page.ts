import TwitterClient from "../TwitterClient";
import DriverCreation from "../DriverCreation";
import { WebDriver, IWebDriverOptionsCookie } from "selenium-webdriver";
import { PageType } from "../Pages";
import { List } from "../tools";

/**
 * The base class for all pages
 */
export abstract class Page
{
    /** The cookies used to login
    */
    public cookies?: string;
    /** The driver used to interact with the page
    */
    public driver?: WebDriver;
    /** The type of page this will function as 
    */
    public pageType?: PageType;
    /** The client that this page hosted on
    */
    public client?: TwitterClient;
    /** The base url for the page
    */
    public baceUrl?: string;
    /** If the page is currently sleeping
    */
    public sleeping: boolean = false;

    protected constructor(client: TwitterClient)
    {
        this.cookies = client.cookies;
        this.driver = DriverCreation.CreateNew();
        this.pageType = PageType.None;
        this.client = client;
        this.init();
    }

    /** this will initialize the page
     * @remarks Is Asyncronous
     */
    protected async init(): Promise<void> {
        this.driver?.navigate().to("https://x.com");

        var savedCookie: List<CustomCookie> = JSON.parse(this.cookies!);

        for (let cookie of savedCookie)
        {
            var customCookie = new CustomCookie(cookie);
            var seleniumCookie = customCookie.toSeleniumCookie();
            this.driver?.manage().addCookie(seleniumCookie);
        }

        this.driver?.navigate().to("https://x.com");
        await this.driver?.wait(async () => (await this.driver?.getCurrentUrl()) === "https://x.com", 10000);

    }

    /** this will reload the page
     * @returns {void}
     */
    public reload(): void
    {
        if (this.driver?.getCurrentUrl() != null)
                this.driver?.navigate().refresh();
    }

    /** this will return the page to the base url
     * @remarks this will not log the user out 
     * @remarks Is Asyncronous
     */
    public async returnToBase(): Promise<void>
    {
        if (this.driver?.getCurrentUrl() != null)
            this.driver?.navigate().to(this.baceUrl!);
    }

    /** this will close the webdriver and remove this page from the client
     * @Remarks Is Asyncronous
     */
    public async close(): Promise<void>
    {
        try{
            if (this.client?.pages.contains(this))
                this.client.pages.remove(this);
            if (this.driver != null)
                this.driver.quit();
        }
        catch
        {
            // do nothing
        }    
    }

    /** this will close the webdriver while keeping this class alive
     * @remarks this will allow the page to be reopened without having to relogin
     * @remarks Is Asyncronous
     */
    public async sleep(): Promise<void>
    {
        this.sleeping = true;
    }

    public async awakeDriver(): Promise<void>
    {
        this.sleeping = false;
        this.init();
        this.driver?.navigate().to(this.baceUrl!);
    }

    /** Deconstructor for the Page class 
     * @remarks Is Asyncronous
    */
    public async destroy(): Promise<void> {
        await this.close();
        this.cookies = undefined;
        this.driver = undefined;
        this.pageType = undefined;
        this.client = undefined;
        this.baceUrl = undefined;
    }
    
}
    
class CustomCookie
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