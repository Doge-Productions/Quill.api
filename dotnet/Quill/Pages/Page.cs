using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Text.Json;
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

        protected Page(TwitterClient client)
        {
            this.cookies = client.cookies;
            driver = DriverCreation.CreateNew();
            pageType = PageType.None;
            this.client = client;
            driver.Navigate().GoToUrl("https://twitter.com");

            var savedCookies = JsonSerializer.Deserialize<List<CustomCookie>>(cookies);

            foreach (var customCookie in savedCookies)
            {
                var seleniumCookie = customCookie.ToSeleniumCookie;
                driver.Manage().Cookies.AddCookie(seleniumCookie);
            }

            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");

        }

        protected void CreatePage(TwitterClient client)
        {
            this.cookies = client.cookies;
            driver = DriverCreation.CreateNew();
            pageType = PageType.None;
            this.client = client;
            driver.Navigate().GoToUrl("https://twitter.com");

            var savedCookies = JsonSerializer.Deserialize<List<CustomCookie>>(cookies);

            foreach (var customCookie in savedCookies)
            {
                var seleniumCookie = customCookie.ToSeleniumCookie;
                driver.Manage().Cookies.AddCookie(seleniumCookie);
            }

            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");
            driver.Navigate().GoToUrl("https://twitter.com");

        }

        public void Reload()
        {
            if (driver.Url != null)
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
                if (client.pages.Contains(this))
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
        /// This will 
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
            driver.Close();
            driver.Dispose();
        }
    }

    internal class CustomCookie
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string Domain { get; set; }
        public string Path { get; set; }
        public DateTime? Expiry { get; set; }
        public bool Secure { get; set; }
        public bool IsHttpOnly { get; set; }

        public CustomCookie() { }

        public CustomCookie(Cookie cookie)
        {
            Name = cookie.Name;
            Value = cookie.Value;
            Domain = cookie.Domain;
            Path = cookie.Path;
            Expiry = cookie.Expiry;
            Secure = cookie.Secure;
            IsHttpOnly = cookie.IsHttpOnly;
        }

        public Cookie ToSeleniumCookie => new Cookie(Name, Value, Domain, Path, Expiry);
    }
}
