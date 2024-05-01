using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Safari;

namespace Quill
{
    public static class DriverCreation
    {
        public static BrowserType type = BrowserType.Chrome;

        private static List<string> flags = new List<string>();

        public static DriverOptions options = new DriverOptions();

        public static string executablePath { get; private set; }

        public static void AddFlag(string flag)
        {
            flags.Add(flag);
        }

        public static void SetExecutablePath(string path)
        {
            executablePath = path;
        }

        public static void SetBrowserType(BrowserType type)
        {
            DriverCreation.type = type;
        }

        public static WebDriver CreateNew()
        {
            return CreateNew(type);
        }

        public static WebDriver CreateNew(BrowserType type)
        {
            switch (type)
            {
                case BrowserType.Chrome:
                    {                        
                        ChromeOptions cOptions = new ChromeOptions();
                        ChromeDriverService cDriverService;

                        if (executablePath == string.Empty)
                            cDriverService = ChromeDriverService.CreateDefaultService();
                        else
                            cDriverService = ChromeDriverService.CreateDefaultService(executablePath);

                        if (options.headless)
                        {
                            cOptions.AddArgument("--headless=new");
                            cOptions.AddArgument("--window-position=-32000,-32000");
                            cOptions.AddArgument("--log-level=3");

                        }
                        if (!options.loadImages)
                            cOptions.AddArgument("blink-settings=imagesEnabled=false");

                        cOptions.AddArgument("--window-size=2560,1440");

                        foreach (string flag in flags)
                        {
                            cOptions.AddArgument(flag);
                        }

                        cDriverService.HideCommandPromptWindow = true;
                        cDriverService.SuppressInitialDiagnosticInformation = true;
                        return new ChromeDriver(cDriverService, cOptions);
                    }
                case BrowserType.InternetExplorer:
                    {
                        InternetExplorerOptions ieOptions = new InternetExplorerOptions();
                        var ieDriverService = InternetExplorerDriverService.CreateDefaultService();

                        if (options.headless)
                        {
                            ieOptions.IntroduceInstabilityByIgnoringProtectedModeSettings = true;
                            ieOptions.EnsureCleanSession = true;
                            ieOptions.EnableNativeEvents = false;
                            ieOptions.BrowserCommandLineArguments = "-private"; // Start IE in private mode
                            ieOptions.IntroduceInstabilityByIgnoringProtectedModeSettings = true;
                        }

                        foreach (string flag in flags)
                        {
                            ieOptions.AddAdditionalOption(flag, true);
                        }

                        ieDriverService.HideCommandPromptWindow = true;

                        return new InternetExplorerDriver(ieDriverService, ieOptions);
                    }
                    
                case BrowserType.Edge:
                    {
                        EdgeOptions eOptions = new EdgeOptions();
                        var eDriverService = EdgeDriverService.CreateDefaultService();

                        if (options.headless)
                            eOptions.AddArgument("headless");

                        if (!options.loadImages)
                            eOptions.AddArgument("blink-settings=imagesEnabled=false");

                        foreach (string flag in flags)
                        {
                            eOptions.AddArgument(flag);
                        }

                        eDriverService.HideCommandPromptWindow = true;

                        return new EdgeDriver(eDriverService, eOptions);
                    }
                case BrowserType.Safari:
                    {
                        SafariOptions sOptions = new SafariOptions();
                        var sDriverService = SafariDriverService.CreateDefaultService();

                        foreach (string flag in flags)
                        {
                            sOptions.AddAdditionalOption(flag, true);
                        }
                        sDriverService.HideCommandPromptWindow = true;

                        return new SafariDriver(sDriverService, sOptions);
                    }
                case BrowserType.Firefox:
                    {
                        FirefoxOptions fOptions = new FirefoxOptions();
                        var fDriverService = FirefoxDriverService.CreateDefaultService();

                        if (executablePath == string.Empty)
                            fDriverService = FirefoxDriverService.CreateDefaultService();
                        else
                            fDriverService = FirefoxDriverService.CreateDefaultService(executablePath);

                        if (options.headless)
                            fOptions.AddArgument("--headless");
                        if (!options.loadImages)
                            fOptions.AddArgument("blink-settings=imagesEnabled=false");

                        foreach (string flag in flags)
                        {
                            fOptions.AddArgument(flag);
                        }

                        fOptions.LogLevel = FirefoxDriverLogLevel.Fatal;

                        fDriverService.HideCommandPromptWindow = true;
                        return new FirefoxDriver(fDriverService, fOptions);
                    }
            }

            return new ChromeDriver();
        }

    }

    public struct DriverOptions
    {
        /// <summary>
        /// Prevent the browser from appearing
        /// </summary>
        /// <remarks>
        /// True by default
        /// </remarks>
        public bool headless;

        /// <summary>
        /// lets the browser load images.  (May break media uploading)
        /// </summary>
        /// <remarks>
        /// True by default
        /// </remarks>
        public bool loadImages;

        public DriverOptions()
        {
            headless = true;
            loadImages = true;
        }
    }

    public enum BrowserType
    {
        /// <summary>
        /// Chrome does not support emojis as of right now
        /// </summary>
        Chrome,
        /// <summary>
        /// Not recommended. Requires your operating system to be in English. Driver options may not function properly
        /// </summary>
        InternetExplorer,
        Edge,
        /// <summary>
        /// Not tested. All flags will be ignored
        /// </summary>
        Safari,
        Firefox
    }
}
