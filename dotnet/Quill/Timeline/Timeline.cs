using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Quill.Pages;

namespace Quill.Quill.Timeline
{
    public class Timeline : Page
    {
        internal Timeline(TwitterClient client) : base(client)
        {
            pageType = PageType.Timeline;
            baseUrl = "https://twitter.com/home";
            driver.Navigate().GoToUrl(baseUrl);
        }

        /// <summary>
        /// Changes the timeline to the specified one
        /// </summary>
        /// <param name="tlName">Ex: Home, elonmusk, kanyegobbler</param>   
        public void ChangeTimeline(string tlName)
        {
            baseUrl = $"https://twitter.com/{tlName}";
            ReturnToBase();
        }

        public TimelinePost GetFirstPost()
        {
            string handle = driver.FindElement(By.XPath($"(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'])[27]")).Text;
            string username = driver.FindElement(By.XPath($"(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'])[31]")).Text;

            return new TimelinePost(username, handle, "", TimeSpan.Zero, "", 0, null, null, 0, 0, false);
        }

    }


}