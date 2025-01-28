//using Newtonsoft.Json;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Quill.Pages
{
    public abstract class Page
    {
        /// <summary>
        /// The cookies used to sign in
        /// </summary>
        public string cookies { get; protected set; }

        /// <summary>
        /// The webdriver to assist with the webscraping
        /// </summary>
        public WebDriver driver { get; protected set; }

        /// <summary>
        /// The type of page this will function as
        /// </summary>
        public PageType pageType { get; protected set; }

        /// <summary>
        /// The twitter client this page is hosted on
        /// </summary>
        public TwitterClient client { get; protected set; }

        /// <summary>
        /// The url the page will go back to on a new action
        /// </summary>
        public string baseUrl { get; protected set; }

        public bool sleeping { get; protected set; }

        protected Page(TwitterClient client) : this(client, "https://x.com")
        {
            
        }


        protected Page(TwitterClient client, string baseUrl)
        {
            this.baseUrl = baseUrl;
            cookies = client.cookies;
            driver = DriverCreation.CreateNew();
            pageType = PageType.None;
            this.client = client;
            driver.Navigate().GoToUrl("https://x.com");

            var savedCookies = JsonSerializer.Deserialize<List<CustomCookie>>(cookies);

            foreach (var customCookie in savedCookies)
            {
                var seleniumCookie = customCookie.ToSeleniumCookie;
                driver.Manage().Cookies.AddCookie(seleniumCookie);
            }

            for (int i = 0; driver.Url != baseUrl && i < 10; i++)
            {
                driver.Navigate().GoToUrl(baseUrl);
                //Thread.Sleep(50);
            }

        }

        protected void CreatePage(TwitterClient client)
        {
            this.cookies = client.cookies;
            driver = DriverCreation.CreateNew();
            pageType = PageType.None;
            this.client = client;
            driver.Navigate().GoToUrl("https://x.com/");

            var savedCookies = JsonSerializer.Deserialize<List<CustomCookie>>(cookies);

            foreach (var customCookie in savedCookies)
            {
                var seleniumCookie = customCookie.ToSeleniumCookie;
                driver.Manage().Cookies.AddCookie(seleniumCookie);
            }


            for (int i = 0; driver.Url != "https://x.com/home" && i < 10; i++)
            {
                driver.Navigate().GoToUrl("https://x.com/");                
            }           
        }

        public void Reload()
        {
            if (driver != null && driver.Url != null)
                driver.Navigate().Refresh();
        }

        public void ReturnToBase()
        {
            if (driver.Url != null)
                driver.Navigate().GoToUrl(baseUrl);
        }

        public void Close()
        {
            try
            {
                if (client.pages != null && client.pages.Contains(this))
                    client.pages.Remove(this);
                if (driver != null)
                {
                    driver.Close();
                    driver.Dispose();
                }
            }
            catch { }
        }

        /// <summary>
        /// This will close the webdriver while keeping this class alive
        /// </summary>
        /// <remarks>
        /// Will slow down the next action substantially as the page will have to be reinstated
        /// </remarks>
        public void SleepDriver()
        {
            driver.Close();
            sleeping = true;
        }

        /// <summary>
        /// Use after the sleep function to bring it back
        /// </summary>
        public void AwakeDriver()
        {
            sleeping = false;
            CreatePage(client); 
            driver.Navigate().GoToUrl(baseUrl); 
        }

        ~Page()
        {
            Close();
            if (driver != null)
            {
                driver.Close();
                driver.Dispose();
            }
        }
    }

    internal class CustomCookie
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("value")]
        public string Value { get; set; }

        [JsonPropertyName("domain")]
        public string Domain { get; set; }

        [JsonPropertyName("path")]
        public string Path { get; set; }

        [JsonPropertyName("expiry")]
        public long Expiry { get; set; }

        [JsonPropertyName("secure")]
        public bool Secure { get; set; }

        [JsonPropertyName("httpOnly")]
        public bool IsHttpOnly { get; set; }

        public CustomCookie() { }

        public CustomCookie(Cookie cookie)
        {
            Name = cookie.Name;
            Value = cookie.Value;
            Domain = cookie.Domain;
            Path = cookie.Path;
            if(cookie.Expiry != null)
                Expiry = cookie.Expiry.Value.ToFileTime();
            Secure = cookie.Secure;
            IsHttpOnly = cookie.IsHttpOnly;
        }

        public Cookie ToSeleniumCookie
        {
            get
            {
                DateTime? expiry = DateTime.FromFileTime(Expiry);

                if(expiry.Value.ToFileTime() == 0)
                {
                    expiry = DateTime.Now;
                    expiry = expiry.Value.Add(TimeSpan.FromDays(365));
                }

                return new Cookie(Name, Value, Domain, Path, expiry);
            }
        }
    }
}
