import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import ie from 'selenium-webdriver/ie';
import { Builder, WebDriver } from 'selenium-webdriver';
import { List } from './tools';

enum BrowserType 
{
    /** **Default** Chrome curently Dose Not Support Emojis
     */
    Chrome,
    /** **Not Recommended.** Requires your operating system to be in English. Driver options may not function properly
     */
    InternetExplorer,
    Edge,
    /** **Not Recomended** All flages will be ignored
     */
    Safari,
    Firefox,
}

/**
 * creates this awsome sauce driver
 */
export class DriverOptions {
    /**
     * Prevent the browser from appearing
     * @remarks True by default
     */
    public headless: boolean;

    /**
     * lets the browser load images. (May break media uploading)
     * @remarks True by default
     */
    public loadImages: boolean;

    /**
     * Prevent the browser from loading css
     * @remarks False by default
     */
    public disableCSS: boolean;

    constructor() 
    {
        this.headless = true;
        this.loadImages = true;
        this.disableCSS = false;
    }
}

export default class DriverCreation {
    public static type: BrowserType = BrowserType.Chrome;

    public static options: DriverOptions = new DriverOptions();

    public static executablePath: string;

    private static flags: List<string> = new List<string>();

    public static AddFlag(flag: string): void 
    {
        this.flags.add(flag);
    }

    public static SetExecutablePath(path: string): void 
    {
        this.executablePath = path;
    }

    public static SetBrowserType(type: BrowserType): void 
    {
        this.type = type;
    }

    public static CreateNew(): WebDriver; // << SIG
    public static CreateNew(type: BrowserType): WebDriver; // << SIG
    public static CreateNew(type?: BrowserType): WebDriver  // << IMPL
    {
        switch (type)
        {
            case BrowserType.Chrome:
                {
                    var cOptions = new chrome.Options();
                    var cDriverService: chrome.ServiceBuilder;

                    if (!this.executablePath)
                        cDriverService = new chrome.ServiceBuilder();
                    else
                        cDriverService = new chrome.ServiceBuilder(this.executablePath);

                    if (this.options.headless)
                        cOptions.addArguments("--headless=new", "--window-position=-32000,-32000", "--log-level=3",);
                    if (!this.options.loadImages)
                        cOptions.addArguments("--blink-settings=imagesEnabled=false");
                    cOptions.addArguments("--window-size=2560,1440");

                    for (const flag of this.flags)
                    {
                        cOptions.addArguments(flag);
                    }

                    return new Builder()
                        .forBrowser('chrome')
                        .setChromeService(cDriverService)
                        .setChromeOptions(cOptions)
                        .build();
                }
        case BrowserType.Firefox:
            {
                var fOptions = new firefox.Options();
                var fDriverService: firefox.ServiceBuilder;

                if (!this.executablePath)
                    fDriverService = new firefox.ServiceBuilder();
                else
                    fDriverService = new firefox.ServiceBuilder(this.executablePath);

                if (this.options.headless)
                    fOptions.addArguments("--headless");
                if (!this.options.loadImages)
                    fOptions.addArguments("--disable-images");

                for (const flag of this.flags) {
                    fOptions.addArguments(flag);
                }

                return new Builder()
                    .forBrowser('firefox')
                    .setFirefoxService(fDriverService)
                    .setFirefoxOptions(fOptions)
                    .build();
            }
        case BrowserType.Edge:
            {
                var eOptions = new chrome.Options();
                var eDriverService: chrome.ServiceBuilder;

                if (!this.executablePath)
                    eDriverService = new chrome.ServiceBuilder();
                else
                    eDriverService = new chrome.ServiceBuilder(this.executablePath);

                if (this.options.headless)
                    eOptions.addArguments("--headless=new");
                if (!this.options.loadImages)
                    eOptions.addArguments("--blink-settings=imagesEnabled=false");

                for (const flag of this.flags) {
                    eOptions.addArguments(flag);
                }

                return new Builder()
                    .forBrowser('MicrosoftEdge')
                    .setChromeService(eDriverService)
                    .setChromeOptions(eOptions)
                    .build();
            }
        case BrowserType.InternetExplorer:
            {
                var ieOptions = new ie.Options();
                var ieDriverService: ie.ServiceBuilder;


                if (!this.executablePath)
                    ieDriverService = new ie.ServiceBuilder();
                else
                    ieDriverService = new ie.ServiceBuilder(this.executablePath);

                if (this.options.headless)
                {
                    ieOptions.introduceFlakinessByIgnoringProtectedModeSettings(true);
                    ieOptions.ensureCleanSession(true);
                    ieOptions.addArguments("--private");
                    ieOptions.introduceFlakinessByIgnoringProtectedModeSettings(true);
                }

                for (const flag of this.flags) {
                    ieOptions.addArguments(flag);
                }

                return new Builder()
                    .forBrowser('ie')
                    .setIeService(ieDriverService)
                    .setIeOptions(ieOptions)
                    .build();
            }
        case BrowserType.Safari:
            throw new Error(`Browser type ${BrowserType[type]} is not supported`);
        default:
            return this.CreateNew(BrowserType.Chrome);

        }

    }
}




