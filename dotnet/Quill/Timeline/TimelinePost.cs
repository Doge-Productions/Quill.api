using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Quill.Quill.Timeline
{
    public class TimelinePost : Post
    {
        public Timeline timeline { get; set; }

        public TimelinePost(string displayName, string authorHandle, string content, TimeSpan date, string url, long id, string[] mentions, string[] media, int retweetCount, int likeCount, bool isRetweet) : base(displayName, authorHandle, content, date, url, id, mentions, media, retweetCount, likeCount, isRetweet)
        {
            driver = timeline.driver;
        }

        

    }
}
