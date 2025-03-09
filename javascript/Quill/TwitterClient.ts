import fs from 'fs';
import path from 'path';
import { List, Logger, LogLevel, Stream } from './tools';
import { Page } from './Pages';
import { WebDriver, until, By, Actions, Builder } from 'selenium-webdriver';
import DriverCreation from './DriverCreation';
import ComposePage from './Pages/ComposePage';
import { CustomCookie, CookieHandler } from './cookieHandler';

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
    public cookieHandler: CookieHandler;
    public pages: List<Page>;
    
    /** The Logger Class Used */
    public logger: Logger;
    /*  
    * Wont't actually log you into the client, Just here to save the login information.
    * @param username This will be used first to sign in. This is preferably a username (handle, @) but could also be an email or phone number
    * @param username2 This will be used if prompted with the suspicious activity screen. THIS HAS TO BE DIFFERENT THAN THE FIRST!! This could be an email, phone number, or username (handle, @)
    * @param password The password of the account you want to use.
    * @param cookies The cookies used to login with
    */
    constructor(); // << SIG
    constructor(username: string, username2: string, password: string, cookieHandler: CookieHandler); // << Implamintation Signature
    constructor(username: string, username2: string, password: string); // << Implimentatin Signature
    constructor(username?: string, username2?: string, password?: string, cookieHandl?: CookieHandler) { // << IMPL
        if(!cookieHandl)
        {
            this.cookieHandler = new CookieHandler(path.join(__dirname, 'cookies.json'));
        }
        else
            this.cookieHandler = cookieHandl;

        this.username = username || '';
        this.username2 = username2 || '';
        this.password = password || '';
        this.pages = new List<Page>();
        this.logger = new Logger();
    }


    /** ------ Logs you into the client. ------
     * the Peramaters Below ARE IF YOU DIDNT SET THEM IN THE CONSTRUCTOR
     * @param username1 This will be used first to sign in. This is preferably a username (handle, \@) but could also be an email or phone number
     * @param username2 This will be used if prompted with the suspicious activity screen. **THIS HAS TO BE DIFFERENT THAN THE FIRST!!** This could be an email, phone number, or username (handle, \@)
     * @param accountPassword The password of the account you want to use.
     */
    public async Login(): Promise<void>; // << SIG
    public async Login(username1: string, username2: string, accountPassword: string): Promise<void>; // << SIG
    public async Login(username1?: string, username2?: string, accountPassword?: string): Promise<void> { // << IMPL
        var username: string = username1 || this.username!;
        var username2: string | undefined = username2 || this.username2!;
        var password: string = accountPassword || this.password!;

        // open browser
        this.logger.Log('Opening Browser', LogLevel.Info);
        var tries: number = 0;
        while (tries < 5)
        {
           try
           {
            var driver = DriverCreation.CreateNew();
            tries = 5;
           }
           catch
           {
            tries++;
           }
           finally
           {
            if (driver! != null)
            {
                tries = 5;
            }
           }
            
        }

        if (driver! == null)
            return;
        try 
        {
            await driver?.navigate().to('https://twitter.com/i/flow/login');
            await driver?.navigate().refresh();
            // var actions: Actions = new Actions(driver);


            // -----
            if (await driver?.getCurrentUrl() == "https://x.com/" || await driver?.getCurrentUrl() == "https://x.com/")
            {
                await driver?.wait(until.elementLocated(By.xpath("(//a[@href='/login'])[1]")), 10000);
                var loginBtn = await driver?.findElement(By.xpath("(//a[@href='/login'])[1]"));
                loginBtn.click();
            }

            await driver?.wait(until.elementLocated(By.xpath("//input[@name='text']")), 10000);
            await driver?.wait(until.elementIsEnabled(await driver?.findElement(By.xpath("//input[@name='text']"))), 10000);
            var usernameFill = await driver?.findElement(By.xpath("(//input[@type='text'])[1]"));
            await usernameFill.click();
            await usernameFill.sendKeys(username);

            await driver?.wait(until.elementLocated(By.xpath("//span[contains(text(),'Next')]")), 10000);
            await driver?.wait(until.elementIsEnabled(await driver?.findElement(By.xpath("//span[contains(text(),'Next')]"))), 10000);
            var nextBtn = await driver?.findElement(By.xpath("//span[contains(text(),'Next')]"));
            nextBtn.click();

            while ((await driver?.findElements(By.xpath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]"))).length < 0 || (await driver?.findElements(By.xpath("//input[@name='password']"))).length < 0)
            {
                await driver?.sleep(50);
            }
                // check for suspicious activity screen \/\/\/
            if ((await driver?.findElements(By.xpath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]"))).length < 0)
            {
                var altInput = await driver?.findElements(By.xpath("//input[@name='text']"));
                await altInput[0].click();
                await altInput[0].sendKeys(username2!);

                var nextBtn2 = await driver?.wait(until.elementLocated(By.xpath("//span[contains(text(),'Next')]")), 10000);
                await nextBtn2.click();
            }

            await driver?.wait(until.elementLocated(By.xpath("//input[@name='password']")), 10000);
            await driver?.wait(until.elementIsEnabled(await (driver?.findElement(By.xpath("//input[@name='password']")))), 10000);
            var passwordFill = await driver?.findElement(By.xpath("(//input[@type='password'])[1]"));
            // actions.move({origin: passwordFill}).click().perform();
            passwordFill.click();
            passwordFill.sendKeys(password);

            var RealLoginBtn = await driver?.findElement(By.xpath("(//button[@data-testid='LoginForm_Login_Button'])[1]"));
            RealLoginBtn.click();

            if (await driver?.getCurrentUrl() == "https://x.com/home" || await driver?.getCurrentUrl() == "https://x.com/home/")
            {
                await driver?.wait(until.elementLocated(By.xpath("(//h1[@role='heading'])[1]")), 10000);
                await driver?.wait(until.elementIsEnabled(await driver?.findElement(By.xpath("(//h1[@role='heading'])[1]"))), 10000);
            }
         

            //TODO: cookies saving
            var cookies = await driver?.manage().getCookies();
            this.cookieHandler.cookies.clear();
            cookies.forEach(cookie => {
                this.cookieHandler.cookies.add(new CustomCookie(cookie));
            });
        

        }
        catch (err)
        {
            const stringifiedError = err instanceof Error ? err.message : String(err);
            this.logger.Log(stringifiedError, LogLevel.Fatal);
        }
        finally
        {
            if (driver != null)
                driver?.quit();
            else
                this.logger.Log('Driver is null', LogLevel.Fatal);
                return;
        }

    }
    
    public CreateCompose(): ComposePage
    {
        this.logger.Log('Creating Compose Page', LogLevel.Info);
        if (this.pages == null)
            this.pages = new List<Page>();
        var page = new ComposePage(this);
        this.pages.add(page);
        return page;
    }

    public CloseAllages(): void
    {
        this.pages.forEach(apge => {
            apge.close();
        });
    }

    public static async CheckForInternetConnection(): Promise<boolean>
    {
        
        try {
            const url = Intl.DateTimeFormat().resolvedOptions().locale.startsWith('fa') 
                ? 'http://www.aparat.com'
                : Intl.DateTimeFormat().resolvedOptions().locale.startsWith('zh')
                    ? 'http://www.baidu.com'
                    : 'http://www.gstatic.com/generate_204';

            const response = await fetch(url, { 
                keepalive: false, 
                signal: AbortSignal.timeout(5000) 
            });
            return true;
        } catch {
            
            return false;
        }

    }

    public async AttatchLogger(logger: Logger): Promise<Logger>
    {
        this.logger = logger;
        await this.logger.Log('Logger Attached', LogLevel.Info);

        this.logger.on('Debug', (message: string) => {
            console.log(message);
        });
        this.logger.on('Info', (message: string) => {
            console.log(message);
        });
        this.logger.on('NonFatal', (message: string) => {
            console.log(message);
        });
        this.logger.on('Fatal', (message: string) => {
            console.log(message);
        });
        return this.logger;
        
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
    cookieHandler: CookieHandler;
    pages: List<Page>;

    Login(username1: string, username2: string, password: string): Promise<void>;
}