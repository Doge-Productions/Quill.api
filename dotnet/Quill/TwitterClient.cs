using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text.Json;
using System.Threading.Tasks;
using Quill.Pages;
using Quill.Quill.Timeline;
using SeleniumExtras.WaitHelpers;
using System.Globalization;
using System.Net;
using OpenQA.Selenium.Interactions;

namespace Quill
{
    public class TwitterClient : ITwitterClient
    {
        /// <summary>
        /// The username used to sign in
        /// </summary>
        public string username { get; private set; }

        /// <summary>
        /// The secondary username used
        /// </summary>
        public string username2 { get; private set; }

        /// <summary>
        /// The password used to sign in
        /// </summary>
        public string password { get; private set; }

        /// <summary>
        /// The cookies used to sign in
        /// </summary>
        public string cookies { get; private set; }

        public List<Page> pages { get; private set; }

        public TwitterClient()
        {
            pages = new List<Page>();
        }

        /// <summary>
        /// Won' log you in into the client. It will only save the login info
        /// </summary>
        /// <param name="username1">This will be used first to sign in. This is preferably a username (handle, @) but could also be an email or phone number</param>
        /// <param name="username2">This will be used if prompted with the suspicious activity screen. THIS HAS TO BE DIFFERENT THAN THE FIRST!! This could be an email, phone number, or username (handle, @)</param>
        /// <param name="accountPassword">The password of the account you want to use.</param>
        public TwitterClient(string username1, string username2, string accountPassword)
        {
            pages = new List<Page>();
            username = username1;
            this.username2 = username2;
            password = accountPassword;
        }

        /// <summary>
        /// Logins you into the client
        /// </summary>
        /// <remarks>
        /// REQUIRES TO HAVE PREVIOUSLY PASSED IN LOGIN INFO
        /// </remarks>
        public async Task Login()
        {
            await Login(username, username2, password);
        }


        /// <summary>
        /// Logins you into the client
        /// </summary>
        /// <param name="username1">This will be used first to sign in. This is preferably a username (handle, @) but could also be an email or phone number</param>
        /// <param name="username2">This will be used if prompted with the suspicious activity screen. THIS HAS TO BE DIFFERENT THAN THE FIRST!! This could be an email, phone number, or username (handle, @)</param>
        /// <param name="accountPassword">The password of the account you want to use.</param>
        public async Task Login(string username1, string username2, string accountPassword)
        {
            username = username1;
            password = accountPassword;

            Dictionary<string, string> registeredCookies = new Dictionary<string, string>();

            if (File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "cookies.json")))
            {
                try
                {
                    using (var mmhCookies = File.OpenText(Path.Combine(Directory.GetCurrentDirectory(), "cookies.json")))
                    {
                        registeredCookies = JsonConvert.DeserializeObject<Dictionary<string, string>>(mmhCookies.ReadToEnd());
                    }

                }
                catch
                {
                    //File.Delete(Path.Combine(Directory.GetCurrentDirectory(), "cookies.json"));
                }

                if (registeredCookies.ContainsKey(username1))
                {
                    cookies = registeredCookies[username1];
                    if (cookies != null)
                        return;
                    else
                        registeredCookies.Remove(username1);
                }
            }

            var tries = 0;

            WebDriver driver = null;

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
                    {
                        tries = 5;
                    }
                }
            }

            if (driver == null)
                new NullReferenceException();
            try
            {
                driver.Navigate().GoToUrl("https://twitter.com/i/flow/login");
                driver.Navigate().Refresh();
                Actions actions = new Actions(driver);
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath("//input[@name='text']")));
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.XPath("//input[@name='text']")));

                var usernameFill = driver.FindElement(By.XPath("//input[@name='text']"));
                usernameFill.Click();
                usernameFill.SendKeys(username1);
                //Thread.Sleep(1000);
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath("//span[contains(text(),'Next')]")));
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.XPath("//span[contains(text(),'Next')]")));

                var nextBtn = driver.FindElement(By.XPath("//span[contains(text(),'Next')]"));
                nextBtn.Click();
                //Thread.Sleep(1000);

                //new WebDriverWait(driver, TimeSpan.FromSeconds(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]")));

               // IWebElement element = WaitUntilElementExists(driver, new WebDriverWait(driver, TimeSpan.FromSeconds(10)), By.XPath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]"), By.XPath("//input[@name='password']"));

                while (driver.FindElements(By.XPath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]")).Count < 0 || driver.FindElements(By.XPath("//input[@name='password']")).Count < 0)
                {
                    Thread.Sleep(50);
                }

                if (driver.FindElements(By.XPath("//div[@class='css-1dbjc4n r-knv0ih']//span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']//span[1]")).Count > 0)
                {
                    var altInput = driver.FindElement(By.XPath("//input[@name='text']"));
                    altInput.Click();
                    altInput.SendKeys(username2);

                    var nextBtn2 = driver.FindElement(By.XPath("//span[contains(text(),'Next')]"));
                    nextBtn2.Click();
                    Thread.Sleep(1000);
                }

                
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath("//input[@name='password']")));
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.XPath("//input[@name='password']")));
                var passwordFill = driver.FindElement(By.XPath("//input[@name='password']"));
                actions.MoveToElement(passwordFill).Click().Perform();
                passwordFill.Click();
                passwordFill.SendKeys(password);

                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.CssSelector(".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-1dye5f7.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l")));
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-1dye5f7.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l")));

                var REALloginButon = driver.FindElement(By.CssSelector(".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-1dye5f7.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l"));
                REALloginButon.Click();

                //Thread.Sleep(3000);
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath("(//h1[@role='heading'])[1]")));
                new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.XPath("(//h1[@role='heading'])[1]")));

                cookies = System.Text.Json.JsonSerializer.Serialize(driver.Manage().Cookies.AllCookies, new JsonSerializerOptions { WriteIndented = true });

                registeredCookies.Add(username1, cookies);

                File.WriteAllText("cookies.json", JsonConvert.SerializeObject(registeredCookies, Formatting.Indented));
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                if (driver != null)
                    driver.Quit();
                else
                    Console.WriteLine("Driver is null");
            }
            //Thread.Sleep(100);
        }

        public ComposePage CreateCompose()
        {
            if (pages == null)
                pages = new();

            var page = new ComposePage(this);
            pages.Add(page);
            return page;
        }


        public Timeline CreateTimeline()
        {
            if (pages == null)
                pages = new();

            var page = new Timeline(this);
            pages.Add(page);
            return page;
        }

        public void CloseAllPages()
        {
            foreach(Page apge in pages)
            {
                apge.Close();               
            }
        }
        /// <summary>
        /// Used to safely close the client ton prevent memory leaks
        /// </summary>
        public void Close()
        {
            CloseAllPages();
        }

        public static bool CheckForInternetConnection(int timeoutMs = 10000, string url = null)
        {
            

            try
            {
                url ??= CultureInfo.InstalledUICulture switch
                {
                    { Name: var n } when n.StartsWith("fa") => // Iran
                        "http://www.aparat.com",
                    { Name: var n } when n.StartsWith("zh") => // China
                        "http://www.baidu.com",
                    _ =>
                        "http://www.gstatic.com/generate_204",
                };

                var request = (HttpWebRequest)WebRequest.Create(url);
                request.KeepAlive = false;
                request.Timeout = timeoutMs;
                using (var response = (HttpWebResponse)request.GetResponse())
                    return true;
            }
            catch
            {
                return false;
            }
        }
    }

    interface ITwitterClient
    {
        /// <summary>
        /// The username used to sign in
        /// </summary>
        public string username { get; }
        public string username2 { get; }

        /// <summary>
        /// The password used to sign in
        /// </summary>
        public string password { get; }

        /// <summary>
        /// The cookies used to sign in
        /// </summary>
        public string cookies { get; }

        public List<Page> pages { get; }

        Task Login(string usnername1, string username2, string password);
    }
}
