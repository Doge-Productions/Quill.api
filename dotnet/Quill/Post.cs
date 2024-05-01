using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Quill.Quill
{
    public class Post
    {
        protected IWebDriver driver { get; set; }

        public string displayName { get; internal set; }
        public string authorHandle { get; internal set; }
        public string content { get; internal set; }
        public TimeSpan date { get; internal set; }
        public string url { get; internal set; }
        public long id { get; internal set; }
        public string[] mentions { get; internal set; }
        public string[] media { get; internal set; }
        public int retweetCount { get; internal set; }
        public int likeCount { get; internal set; }
        public bool isRetweet { get; internal set; }
        public bool isLiked { get; internal set; }

        public bool isAuthor { get; internal set; }

        private int timelinePos;

        public Post(string displayName, string authorHandle, string content, TimeSpan date, string url, long id, string[] mentions, string[] media, int retweetCount, int likeCount, bool isRetweet)
        {
            this.displayName = displayName;
            this.authorHandle = authorHandle;
            this.content = content;
            this.date = date;
            this.url = url;
            this.id = id;
            this.mentions = mentions;
            this.media = media;
            this.retweetCount = retweetCount;
            this.likeCount = likeCount;
            this.isRetweet = isRetweet;
        }

        public override string ToString()
        {
            return $"Display Name: {displayName}\nAuthor Handle: {authorHandle}\nContent: {content}\nDate: {date}\nURL: {url}\nID: {id}\nMentions: {mentions}\nMedia: {media}\nRetweet Count: {retweetCount}\nLike Count: {likeCount}\nIs Retweet: {isRetweet}";
        }

        public void UndoRetweet()
        {
            if (isRetweet)
            {
                driver.FindElement(By.XPath($"(//div[@class='css-175oi2r r-xoduu5'])[{timelinePos}]")).Click();
                driver.FindElement(By.XPath($"(//div[@role='menuitem'])[1]")).Click();
            }
        }

        public void Like()
        {
            if (!isLiked)
            {
                driver.FindElement(By.XPath($"(//div[@class='css-175oi2r r-xoduu5'])[{timelinePos}]")).Click();
                isLiked = true;
            }
        }
    }
}
