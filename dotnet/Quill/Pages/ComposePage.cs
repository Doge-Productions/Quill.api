using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.DevTools.V111.Emulation;
using OpenQA.Selenium.DevTools.V111.Security;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Numerics;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace Quill.Pages
{
    /// <summary>
    /// The page for tweet creation
    /// </summary>
    public class ComposePage : Page
    {
        internal ComposePage(TwitterClient client) : base(client)
        {
            pageType = PageType.Compose;
            baseUrl = "https://twitter.com/compose/post";
            driver.Navigate().GoToUrl(baseUrl);
            //Debug.WriteLine(driver.Url);
            if (driver.Url != baseUrl)
            {
                Debug.WriteLine($"{driver.Url} != {baseUrl}");
                driver.Close();
                driver.Dispose();
                CreatePage(client);
                driver.Navigate().GoToUrl(baseUrl);
            }
        }

        public async Task<int> Tweet(string tweetContent)
        {
            return await Tweet(new TweetData[]
            {
                new TweetData
                {
                    content = tweetContent,
                },
            });
        }

        public async Task<int> Tweet(string tweetContent, string mediaPath)
        {
            return await Tweet(new TweetData[]
            {
                new TweetData
                {
                    content = tweetContent,
                    media = new MediaData[]
                    {
                        new MediaData
                        {
                            url = mediaPath
                        }
                    }
                },
            });
        }

        /// <summary>
        /// Sends a tweet using the full tweet data
        /// </summary>
        /// <param name="tweetData">The information about the tweet. It is an array for thread support</param>
        /// <returns></returns>
        public async Task<int> Tweet(TweetData[] tweetData)
        {

                ReturnToBase();
                //await Task.Delay(1000);

                IWebElement addTweetBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@aria-label='Post text'])[{1}]")));
                //check if tweet is valid               

                var cappedLength = Math.Clamp(tweetData.Length, 0, 22);

                bool canDoImages = tweetData.Any(tweet => tweet.pollData.Equals(null));

                int invalidTweets = 0;

                for (int i = 0; i < cappedLength; i++)
                {
                    TweetData data = tweetData[i];

                    if (data.content == string.Empty && data.media == null)
                    {
                        invalidTweets++;
                        continue;
                    }

                    if (i > 0)
                    {
                        //var addTweetBtn = driver.FindElement(By.XPath("//div[@aria-label='Add post']"));

                        addTweetBtn.Click();
                    }

                    #region Text Sending
                    var textBox = driver.FindElement(By.XPath($"(//div[@aria-label='Post text'])[{i + 1}]"));
                    textBox.Click();

                    if (driver.GetType() == typeof(ChromeDriver) || driver.GetType() == typeof(EdgeDriver) || driver.GetType() == typeof(ChromeDriver))
                        textBox.SendKeys(Regex.Replace(data.content, @"\p{Cs}", " "));
                    else
                        textBox.SendKeys(data.content);
                    #endregion

                    #region Image Sending

                    if (data.media != null)
                    {
                        //putting in the media
                        var imageBtn = driver.FindElement(By.XPath($"(//div[@aria-label='Add photos or video'])[{i + 1}]"));

                        for (int j = 0; j < data.media.Length; j++)
                        {
                            int loops = 0;
                            while (true)
                            {
                                if (loops > 6)
                                {
                                    ReturnToBase();
                                    return 4;
                                }
                                MediaData image = data.media[j];
                                var imageInput = driver.FindElement(By.XPath("//input[@type='file']"));
                                imageInput.SendKeys(image.url);
                                Thread.Sleep(300);

                                if (driver.FindElements(By.XPath($"(//div[@role='presentation'])[{1 + j}]")).Count <= 0)
                                {
                                    Thread.Sleep(1000);

                                    if (driver.FindElements(By.XPath($"(//div[@role='presentation'])[{1 + j}]")).Count >= 0)
                                    {
                                        loops++;
                                        break;
                                    }
                                }
                            }
                        }

                        //applying the image attributes

                        var mediaMode = MediaMode.Image;
                        var firstFileType = GetFileExtension(data.media[0].url);

                        if (firstFileType == "mp4" || firstFileType == "m4a" || firstFileType == "m4b" || firstFileType == "mov" || firstFileType == "m4v")
                            mediaMode = MediaMode.Video;
                        else if (firstFileType == "gif")
                            mediaMode = MediaMode.Gif;


                        for (int j = 0; j < data.media.Length; j++)
                        {
                            MediaData media = data.media[j];

                            var fileEx = GetFileExtension(media.url);

                            bool hasAltText = media.altText != null;
                            bool hasZoom = media.zoom != 0;
                            //bool hasTranslation = media.translation != new Vector2();
                            bool hasCrop = media.cropOption != CropOption.Original;
                            bool hasContentWarnings = media.contentWarnings != 0;

                            if (!hasAltText && !hasZoom/* && !hasTranslation */&& !hasCrop && !hasContentWarnings) continue;

                            if (mediaMode != MediaMode.Gif)
                            {
                                if (data.media.Length != 4)
                                {
                                    var editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[{j + 1}]")));
                                    editBtn.Click();
                                }
                                else
                                {
                                    IWebElement editBtn = null;
                                    switch (j)
                                    {
                                        case 0:
                                            editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[1]")));
                                            break;
                                        case 1:
                                            editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[3]")));
                                            break;
                                        case 2:
                                            editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[2]")));
                                            break;
                                        case 3:
                                            editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[4]")));
                                            break;
                                        default:
                                            editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[1]")));
                                            break;
                                    }
                                    editBtn.Click();
                                }
                            }
                            else
                            {
                                var editBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//a[@class='css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-n6v787 r-1cwl3u0 r-16dba41 r-k200y r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-1rw7m1n r-1loqt21'])[1]")));
                                editBtn.Click();
                            }

                            #region Cropping

                            if (hasZoom && mediaMode == MediaMode.Image)
                            {
                                var zoomSlider = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-1awozwy r-sdzlij r-1loqt21 r-mabqd8 r-1777fci r-u8s1d r-1yvhtrz r-bz4dqc r-o7ynqc r-6416eg r-1ny4l3l'])[1]")));
                                float maxValue = float.Parse(zoomSlider.GetAttribute("aria-valuemax"));
                                float targetValue = ((float)media.zoom) / 100 * maxValue;

                                while (float.Parse(zoomSlider.GetAttribute("aria-valuenow")) < targetValue)
                                {
                                    zoomSlider.SendKeys(Keys.ArrowRight);
                                }

                            }

                            if (hasCrop && mediaMode == MediaMode.Image)
                            {
                                switch (media.cropOption)
                                {
                                    case CropOption.Wide:
                                        var wideCrop = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-2yi16 r-1qi8awa r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[3]")));
                                        wideCrop.Click();
                                        break;
                                    case CropOption.Square:
                                        var squareCrop = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-2yi16 r-1qi8awa r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[4]")));
                                        squareCrop.Click();
                                        break;
                                }
                            }

                            #endregion

                            #region Alt Text

                            if (hasAltText && mediaMode != MediaMode.Video)
                            {
                                if (mediaMode != MediaMode.Gif)
                                {
                                    var altTextTab = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@role='presentation'])[2]")));
                                    altTextTab.Click();
                                }

                                var altTextBox = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.CssSelector($"textarea[name='altTextInput']")));
                                altTextBox.SendKeys(media.altText);

                            }

                            #endregion

                            #region Content Warnings

                            if (hasContentWarnings)
                            {
                                if (mediaMode == MediaMode.Image)
                                {
                                    var contentWarningsTab = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@role='presentation'])[3]")));
                                    contentWarningsTab.Click();
                                }
                                else
                                {
                                    var contentWarningsTab = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@role='presentation'])[2]")));
                                    contentWarningsTab.Click();
                                }

                                if (media.contentWarnings.HasFlag(ContentWarning.Nudity))
                                {
                                    var nudity = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//input[@type='checkbox'])[1]")));
                                    nudity.Click();
                                }

                                if (media.contentWarnings.HasFlag(ContentWarning.Violence))
                                {
                                    var violence = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//input[@type='checkbox'])[2]")));
                                    violence.Click();
                                }

                                if (media.contentWarnings.HasFlag(ContentWarning.Sensitive))
                                {
                                    var sensitive = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//input[@type='checkbox'])[3]")));
                                    sensitive.Click();
                                }
                            }
                            #endregion

                            var saveButton = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-19u6a5r r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[1]")));
                            saveButton.Click();
                        }

                    }


                    #endregion
                }

                if (invalidTweets == cappedLength)
                {
                    return 2;
                }

                var sendBtn = new WebDriverWait(driver, TimeSpan.FromDays(1)).Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(By.XPath($"(//div[@data-testid='tweetButton'])[1]")));
                string outs = sendBtn.GetDomAttribute("aria-disabled");
                while (sendBtn.GetDomAttribute("aria-disabled") == "true")
                {
                    Thread.Sleep(100);
                }

                if (!TwitterClient.CheckForInternetConnection())
                    return 3;

                sendBtn.Click();
                return 0;
            
        }

        public static string GetFileExtension(string path)
        {
            // Match the file extension using Regex
            Match match = Regex.Match(path, @"\.(?<extension>[^.]+)$");

            if (match.Success)
            {
                return match.Groups["extension"].Value;

            }
            else
            {
                return string.Empty;
            }
        }
        enum MediaMode
        {
            Image,
            Gif,
            Video
        }
    }

    /// <summary>
    /// The primary tweet information
    /// </summary>
    public struct TweetData
    {
        /// <summary>
        /// The text of the tweet
        /// </summary>
        public string content { get; set; }

        /// <summary>
        /// The images of the tweet
        /// </summary>
        /// <remarks>
        /// Conflicts with polls. You may only have 4 images or just one video/gif, but not both. Whatever Comes first will be prioritized.
        /// </remarks>
        public MediaData[] media { get; set; }

        /// <summary>
        /// The people to tag in images
        /// </summary>
        /// <remarks>
        /// Conflicts with scheduling
        /// </remarks>
        public ImageTag imageTag { get; set; }

        /// <summary>
        /// The time when to schedule the tweet
        /// </summary>
        /// <remarks>
        /// Conflicts with image tags and polls. May not be set in the past
        /// </remarks>
        public DateTime scheduledTime { get; set; }

        /// <summary>
        /// The information about the poll
        /// </summary>
        /// <remarks>
        /// Conflicts with images and scheduling. 
        /// </remarks>
        public PollData pollData { get; set; }

        /// <summary>
        /// The data about the location
        /// </summary>
        public LocationData locationData { get; set; }



    }

    public struct LocationData
    {
        /// <summary>
        /// What will be looked up for the location
        /// </summary>
        public string locationQuery { get; set; }

        /// <summary>
        /// The selected index of the returned list
        /// </summary>
        public int selectedLocation { get; set; }
    }

    public struct PollData
    {
        /// <summary>
        /// The text in each poll option.
        /// </summary>
        /// <remarks>
        /// Only 4 options will go through. Poll will be ingored if there is less than one option. Max of 25 characters.
        /// </remarks>
        public string[] pollContent { get; set; }

        /// <summary>
        /// How long the poll will be up for.
        /// </summary>
        /// <remarks>
        /// Caps at 7 days, 23 hours, and 59 minutes
        /// </remarks>
        public TimeSpan length { get; set; }

    }

    /// <summary>
    /// The information of one image
    /// </summary>
    public struct MediaData
    {
        /// <summary>
        /// The path to the image
        /// </summary>
        /// <remarks>
        /// Supported file types: jpg, jpeg, jfif, pjpeg, pjp, png, webp, gif, mp4, m4v ,m4a, m4b, mov
        /// </remarks>
        public string url { get; set; }

        /// <summary>
        /// The alt text of the image
        /// </summary>
        /// <remarks>
        /// Caps at 1000 characters. Does not support videos
        /// </remarks>
        public string altText { get; set; }

        /// <summary>
        /// The amount of zoom applied to the image slider. Number between 0 and 100
        /// </summary>
        /// <remarks>
        /// Does not support gifs or videos. This procedure is very slow and may take up to 30 seconds to complete.
        /// </remarks>
        public uint zoom { get; set; }

        /// <summary>
        /// How much to move the image in the crop by
        /// </summary>
        /// <remarks>
        /// Zoom or different crop recommended. Does not support gifs or videos.
        /// </remarks>
        //public Vector2 translation { get; set; }

        /// <summary>
        /// To crop the image
        /// </summary>
        /// <remarks>
        /// Does not support gifs or videos.
        /// </remarks>
        public CropOption cropOption { get; set; }

        /// <summary>
        /// The desired content warning to be applied
        /// </summary>
        /// <remarks>
        /// You may use the &amp; bitwise operator to have more than one applied 
        /// <code>
        /// new ImageData() 
        /// {
        ///     contentWarnings = ContentWarning.Nudity &amp; ContentWarning.Violence &amp; ContentWarning.Sensitive,
        /// } 
        /// </code>
        /// </remarks>
        public ContentWarning contentWarnings { get; set; }

    }

    public struct ImageTag
    {
        /// <summary>
        /// The people you want to search for for an image tag
        /// </summary>
        /// <remarks>
        /// Can only choose up to ten people
        /// </remarks>
        public string[] personQuery { get; set; }

        /// <summary>
        /// the index of the person you wanna choose
        /// </summary>
        public int[] selectedPerson { get; set; }
    }

    [Flags]
    public enum ContentWarning
    {
        Nudity,
        Violence,
        Sensitive
    }

    public enum CropOption
    {
        /// <summary>
        /// Aspect ratio won't be changed
        /// </summary>
        Original,

        /// <summary>
        /// Aspect ratio cropped into uh idk
        /// </summary>
        Wide,

        /// <summary>
        /// Aspect ratio cropped into 1:1
        /// </summary>
        Square
    }


}
