import { get } from "http";
import { WebDriver } from "selenium-webdriver";


export abstract class Page
{
    /*
    * The cookies used to login
    */
    public cookies: string = '';

    public driver: WebDriver;

    protected constructor(client: TwitterClient)
    {
        this.cookies = client.cookies;
        this.driver = client.driver;
    }
}