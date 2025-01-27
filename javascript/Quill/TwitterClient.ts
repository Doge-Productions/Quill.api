import fs from 'fs';
import path, { resolve } from 'path';
import { List } from './tools';
import { PageType, Page } from './Pages';
import { rejects } from 'assert';
import { Actions, WebDriver, until, Builder, By } from 'selenium-webdriver';
import DriverCreation from './DriverCreation';


export default class TwitterClient implements ITwitterClient
{

    /* The username to sign in with
    */
    public username: string;
    public username2: string;
    /* The password used to sign in with
    */
    public password: string;
    /* The cookies used to login with
    */
    public cookies: string;
    public pages: List<Page>;
    

    constructor(); // << SIG
    constructor(username: string, username2: string, password: string, cookies: string); // << SIG
    /*  
    * Wont't actually log you into the client, Just here to save the login information.
    * @param username This will be used first to sign in. This is preferably a username (handle, @) but could also be an email or phone number
    * @param username2 This will be used if prompted with the suspicious activity screen. THIS HAS TO BE DIFFERENT THAN THE FIRST!! This could be an email, phone number, or username (handle, @)
    * @param password The password of the account you want to use.
    * @param cookies The cookies used to login with
    */
    constructor(username?: string, username2?: string, password?: string, cookies?: string) { // << IMPL
        this.username = username || '';
        this.username2 = username2 || '';
        this.password = password || '';
        this.cookies = cookies || '';
        this.pages = new List<Page>();
    }


    
    /** ------ Logs you into the client. ------
     * @param username1 This will be used first to sign in. This is preferably a username (handle, \@) but could also be an email or phone number
     * @param username2 This will be used if prompted with the suspicious activity screen. **THIS HAS TO BE DIFFERENT THAN THE FIRST!!** This could be an email, phone number, or username (handle, \@)
     * @param accountPassword The password of the account you want to use.
     */
    public async Login(): Promise<void>; // << SIG
    public async Login(username1: string, username2: string, accountPassword: string): Promise<void>; // << SIG
    public async Login(username1?: string, username2?: string, accountPassword?: string): Promise<void> { // << IMPL
        if (!username1 && !username2 && !accountPassword) {
            await this.Login(this.username, this.username2, this.password);
            resolve(); // yippe we're done or atleast we waited for the login to be done
        }

        this.username = username1 || '';
        this.password = accountPassword || '';
        var registeredCookies = new Map<string, string>();
        if (fs.existsSync(path.join(__dirname, 'cookies.json'))) 
        {
            try {
                registeredCookies = JSON.parse(fs.readFileSync(path.join(__dirname, 'cookies.json'), 'utf8'));
            } catch (err: string | any) {
                rejects(err); // something went wrong
            }

            if (registeredCookies.has(username1 || this.username)) {
                this.cookies = registeredCookies.get(username1 || this.username) || '';
                if (this.cookies != null)
                    resolve(); // yippe we're done
                else
                    registeredCookies.delete(username1 || this.username);      
            }
        }

        // if we don't have cookies or they are invalid
        var driver: WebDriver | undefined;

        var tries = 0;

        while (tries < 5)
        {
            try
            {
                driver = DriverCreation.CreateNew();
                tries = 5;
            }
            catch
            {
                tries++;
            }
            finally
            {
                if (driver != null)
                    tries = 5;
            }

        }

        if (driver == null)
            return;
        try
        {
            driver?.navigate().to('https://x.com/i/flow/login');
            driver?.navigate().refresh();
            var actions:Actions = new Actions(driver!);
            await driver?.wait(until.elementLocated(By.xpath("//input[@name='text']")), 10000);
            await driver?.wait(until.elementIsEnabled(driver?.findElement(By.xpath("//input[@name='text']"))), 10000);

            var usernameFill = driver?.findElement(By.xpath("//input[@name='text']"));
            await usernameFill.click();
            await usernameFill.sendKeys(username1 || this.username);
            
            var nextBtn = driver?.findElement(By.xpath("//span[contains(text(), 'Next)]"));
            nextBtn.click();

                // \/ Wait untill the password field is visible
            await driver?.wait(until.elementLocated(By.xpath("//input(@name='password']")) || until.elementLocated(By.xpath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]")), 10000);

            if (driver?.findElement(By.xpath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]")) != null)
            {
                // \/ If we are prompted with the suspicious activity screen
                var altInput = driver?.findElement(By.xpath("//input[@name='text']"));
                await altInput.click();
                await altInput.sendKeys(username2 || this.username2);
                
                var nextBtn2 = driver?.findElement(By.xpath("//span[contains(text(),'Next')]"));
                nextBtn2.click();
            }

            await driver?.wait(until.elementLocated(By.xpath("//input[@name='password']")), 10000);
            await driver?.wait(until.elementIsEnabled(driver?.findElement(By.xpath("//input[@name='password']"))), 10000);
            var passwordFill = driver?.findElement(By.xpath("//input[@name='password']"));
            await actions.move({origin: passwordFill});
            await passwordFill.click();
            await passwordFill.sendKeys(accountPassword || this.password);

            await driver?.wait(until.elementLocated(By.css(".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-1dye5f7.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l")), 10000);
            var RealLoginButton = driver?.findElement(By.css(".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-1dye5f7.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l"));
            await RealLoginButton.click();

            this.cookies = JSON.parse(await driver?.manage().getCookies().toString());

            registeredCookies.set(username1 || this.username, this.cookies);
            fs.writeFileSync(path.join(__dirname, 'cookies.json'), JSON.stringify(registeredCookies, null, 2));
        }
        catch (err: string | any)
        {
            rejects(err);
        }
        finally
        {
            if (driver != null)
                driver.quit();
            else
                resolve('Driver is null');
        }
    }
    

    public CreateCompose() :ConposePage
    {
        if (this.pages == null)
            this.pages = new();
    }

}

interface ITwitterClient
{
    /* The username to sign in with
    */
    username: string;
    username2: string;

    /* The password used to sign in with
    */
    password: string;

    /* The cookies used to login with
    */
    cookies: string;

    pages: List<Page>;

    Login(username1: string, username2: string, password: string): Promise<void>;
}