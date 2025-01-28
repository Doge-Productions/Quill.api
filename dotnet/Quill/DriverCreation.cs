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
        public static BrowserType type = BrowserType.Firefox;

        private static List<string> flags = new List<string>();

        public static DriverOptions options = new DriverOptions();

        public static string ExecutablePath { get; private set; }

        public static LogLevel logLevel { get; set; }
        public static bool SuppressInitialDiagnosticInformation { get; set; }

        public static void AddFlag(string flag)
        {
            flags.Add(flag);
        }

        public static void SetExecutablePath(string path)
        {
            ExecutablePath = path;
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

                        if (ExecutablePath == string.Empty)
                            cDriverService = ChromeDriverService.CreateDefaultService();
                        else
                            cDriverService = ChromeDriverService.CreateDefaultService(ExecutablePath);

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
                        cDriverService.SuppressInitialDiagnosticInformation = SuppressInitialDiagnosticInformation;
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

                        if (ExecutablePath != string.Empty)
                            fDriverService = FirefoxDriverService.CreateDefaultService(ExecutablePath);                                                

                        if (options.headless)
                            fOptions.AddArgument("--headless");
                        if (!options.loadImages)
                            fOptions.AddArgument("blink-settings=imagesEnabled=false");

                        foreach (string flag in flags)
                        {
                            fOptions.AddArgument(flag);
                        }

                        if(logLevel != LogLevel.None)
                            fOptions.LogLevel = (FirefoxDriverLogLevel)logLevel;
                        else
                        {
                            Environment.SetEnvironmentVariable("MOZ_LOG", ""); 
                            Environment.SetEnvironmentVariable("MOZ_LOG_FILE", "/dev/null");
                        }
                        //fOptions.LogLevel = FirefoxDriverLogLevel.Fatal;

                        fDriverService.HideCommandPromptWindow = true;
                        fDriverService.SuppressInitialDiagnosticInformation = SuppressInitialDiagnosticInformation;
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

        /// <summary>
        /// The best option for most use cases
        /// </summary>
        Firefox
    }

    public enum LogLevel
    {
        /// <summary>
        /// Represents the Trace value, the most detailed logging level available.
        /// </summary>        
        Trace,
        
        /// <summary>
        /// Represents the Debug value
        /// </summary>
        Debug,        

        /// <summary>
        /// Represents the Config value
        /// </summary>
        Config,
        
        /// <summary>
        /// Represents the Info value
        /// </summary>
        Info,
        
        /// <summary>
        /// Represents the Warn value
        /// </summary>
        Warn,
        
        /// <summary>
        /// Represents the Error value
        /// </summary>
        Error,
        
        /// <summary>         
        /// Represents the Fatal value, the least detailed logging level available.
        /// </summary>
        Fatal,        
          
        /// <summary>
        /// Represents that the logging value is unspecified, and should be the default level.
        /// </summary>
        Default,

        /// <summary>
        /// Makes the driver's output pipe to a null address
        /// </summary>
        None,
    }
}
