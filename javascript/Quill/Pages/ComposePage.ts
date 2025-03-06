import { Page } from "./Page";
import TwitterClient from "../TwitterClient";
import { By, until, IWebElement, WebElement, Key } from "selenium-webdriver";
import { send } from "process";
import { resolve } from "path";

export default class ComposePage extends Page
{
    constructor(client: TwitterClient) 
    {
        super(client);
    }

    /** Tweets Somthing
     * @overload tweet(message: string, media: string): Promise<void>
     * @overload tweet(tweetData: TweetData[]): Promise<void>
     */
    public async tweet(message: string): Promise<void>; // << IMPL Signature
    public async tweet(message: string, media: string): Promise<void>; // << IMPL Signature
    public async tweet(tweetData: TweetData[]): Promise<void>; // << IMPL Signature
    public async tweet(messageOrData?: string | TweetData[], media?:string,): Promise<void> // << IMPL Implementation
    {
        var cappedLength: number = Math.max(messageOrData!.length, 22); 
        let data: TweetData;
        var invalidTweets: number = 0;
        var addTweetBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@aria-label='Post text'])[${1}]`)), 10000); 
        if(typeof messageOrData === 'string' && media)
        {
            data = {
                content: messageOrData as string,
                media: [{url: media as string}]
            };
        }
        else if (typeof messageOrData === 'string' && !media)
        {
            data = {
                content: messageOrData as string
            };
        }
        else if(typeof messageOrData === 'object')
        {
            for (let i = 0; i < messageOrData.length; i++) {
                data = messageOrData[i] as TweetData;
                if(data.content == "" && data.media == null)
                {
                    invalidTweets++;
                    continue;
                }

                if(i > 0)
                {
                    await addTweetBtn!.click();
                }

                // REGION: Text sending.
                var textBox = await this.driver?.findElement(By.xpath(`(//div[@aria-label='Post text'])[${i + 1}]`));
                textBox?.click();

                if ((await this.driver!.getCapabilities()).getBrowserName() == "chrome")
                    await textBox?.sendKeys(data.content.replace(new RegExp("\p{Cs}", "g"), " "));
                else
                    await textBox?.sendKeys(data.content);

                // REGION: Media sending
                if(data.media != null)
                {
                    var mediaBtn = await this.driver?.findElement(By.xpath(`(//div[@aria-label='Add photos or video'])[${i + 1}]`));

                    for (let j = 0; j < data.media.length; j++) 
                    {
                        var loops: number = 0;
                        while (true)
                        {
                            if (loops > 6)
                            {
                                this.returnToBase();
                                resolve();
                            }
                            var image: MediaData = data.media[j];
                            var imageInput = await this.driver?.findElement(By.xpath("//input[@type='file']"));
                            imageInput?.sendKeys(image.url);

                            const elements = await this.driver?.findElements(By.xpath(`(//div[@role='presentation])[${1 + j}]`));
                            if (elements && elements.length > 0)
                            {
                               loops++;
                               break; 
                            }

                        }
                    }
                    
                    // applying image atrabutes

                    var MediaMode:mediaMode = mediaMode.Image;
                    var firstFileType = ComposePage.GetFileExtension(data.media[0].url);

                    if (firstFileType == "mp4" || firstFileType == "m4a" || firstFileType == "m4b" || firstFileType == "mov" || firstFileType == "m4v")
                        MediaMode = mediaMode.Video;
                    else if (firstFileType == "gif")
                        MediaMode = mediaMode.Gif;

                    for (let i = 0; i < data.media.length; i++)
                    {
                        let media: MediaData = data.media[i];
                        var fileEx = ComposePage.GetFileExtension(media.url);
                        var hasAltText: boolean = media.altText != null;
                        var hasZoom: boolean = media.zoom != 0;
                        var hasCrop: boolean = media.CropOption != CropOption.Original;
                        var hasContentWarning: boolean = media.contentWarning != ContentWarning.Sensitive;

                        if (!hasAltText && !hasZoom && !hasCrop && !hasContentWarning) continue;

                        if (MediaMode != mediaMode.Gif)
                        {
                            if (data.media.length != 4)
                            {
                                var editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[${i + 1}]`)), 10000);
                                await editBtn!.click();
                            }
                            else
                            {
                                var editBtn: WebElement | undefined;
                                switch (i)
                                {
                                    case 0:
                                        editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[1]`)), 10000);
                                        break;
                                    case 1:
                                        editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[2]`)), 10000);
                                        break;
                                    case 2:
                                        editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[3]`)), 10000);
                                        break;
                                    case 3:
                                        editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[4]`)), 10000);
                                        break;
                                    default:
                                        editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-6koalj r-18u37iz r-9aw3ui r-u8s1d r-ws9h79 r-s5r7i3'])[1]`)), 10000);
                                        break;
                                }
                                await editBtn!.click();
                            }
                        }
                        else
                        {
                            var editBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//a[@class='css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-n6v787 r-1cwl3u0 r-16dba41 r-k200y r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-1rw7m1n r-1loqt21'])[1]`)), 10000);
                            await editBtn!.click();
                        }

                        // REGION: Cropping

                        if (hasZoom && MediaMode == mediaMode.Image)
                        {
                            var zoomSlider = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-1awozwy r-sdzlij r-1loqt21 r-mabqd8 r-1777fci r-u8s1d r-1yvhtrz r-bz4dqc r-o7ynqc r-6416eg r-1ny4l3l'])[1]`)), 10000);
                            var maxValue: number = Number.parseFloat(await zoomSlider!.getAttribute("aria-valuemax"))!; 
                            var targetValue: number = media.zoom! / 100 * maxValue;
                            await zoomSlider!.sendKeys(media.zoom!.toString());

                            while (Number.parseFloat(await zoomSlider!.getAttribute("aria-valuenow"))! < targetValue)
                            {
                                await zoomSlider!.sendKeys(Key.ARROW_RIGHT);
                            }
                        }

                        if (hasCrop && MediaMode == mediaMode.Image)
                        {
                            switch (media.CropOption)
                            {
                                case CropOption.Wide:
                                    var wideCrop = await this.driver?.wait(until.elementLocated(By.xpath("(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-2yi16 r-1qi8awa r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[3]")));
                                    await wideCrop!.click();
                                    break;
                                case CropOption.Square:
                                    var squareCrop = await this.driver?.wait(until.elementLocated(By.xpath("(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-2yi16 r-1qi8awa r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[4]")));
                                    await squareCrop!.click();
                                    break;
                            }
                        }

                        // REGION: Alt text

                        if (hasAltText && MediaMode != mediaMode.Video)
                        {
                            if(MediaMode != mediaMode.Gif)
                            {
                                var altTextTab = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@role='presentation'])[2]`)), 10000);
                                await altTextTab!.click();
                            }

                            var altTextBox = await this.driver?.wait(until.elementLocated(By.xpath(`textarea[name='altTextInput']`)), 10000);
                            await altTextBox!.sendKeys(media.altText!);

                        }

                        // REGION: Content Warning
                        if (hasContentWarning)
                        {
                            if (MediaMode == mediaMode.Image)
                            {
                                var contentWarningTab = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@role='presentation'])[3]`)), 10000);
                                await contentWarningTab!.click();
                            }
                            else
                            {
                                var contentWarningTab = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@role='presentation'])[2]`)), 10000);
                                await contentWarningTab!.click();
                            }

                            if ((media.contentWarning! & ContentWarning.Nudity) === ContentWarning.Nudity)
                            {
                                var nudity = await this.driver?.wait(until.elementLocated(By.xpath(`(//input[@type='checkbox'])[1]`)), 10000);
                                nudity!.click();
                            }

                            if ((media.contentWarning! & ContentWarning.Violence) === ContentWarning.Violence)
                            {
                                var sensitive = await this.driver?.wait(until.elementLocated(By.xpath(`(//input[@type='checkbox'])[2]`)), 10000);
                                sensitive!.click();
                            }

                            if ((media.contentWarning! & ContentWarning.Sensitive) === ContentWarning.Sensitive)
                            {
                                var sensitive = await this.driver?.wait(until.elementLocated(By.xpath(`(//input[@type='checkbox'])[3]`)), 10000);
                                sensitive!.click();
                            }
                        }

                        var saveBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-19u6a5r r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[1]`)), 10000);
                        saveBtn!.click();
                    }
                }


            }

            if (invalidTweets == cappedLength)
            {
                resolve();
            }
            
            var sendBtn = await this.driver?.wait(until.elementLocated(By.xpath(`(//div[@data-testid='tweetButton'])[1]`)), 10000);
            var outs = await sendBtn!.getAttribute("aria-disabled");
            while (await sendBtn!.getAttribute("aria-disabled") === "true")
            {
                await this.driver?.sleep(1000);
            }

            if (!TwitterClient.CheckForInternetConnection())
                resolve();
            
            sendBtn!.click();
            resolve();
            

        }
        else
        {
            throw new Error("Invalid Arguments");
        }
        
    }

    public static GetFileExtension(url: string): string
    {
        return url.split('.').pop()!;
    }

}

export enum mediaMode
{
    Image,
    Gif,
    Video
}

export type TweetData = {
    content: string;
    media?: MediaData[];
    imageTag?: ImageTag;
    sheduledTime?: Date;
    pollData?: PollData;
    locationData?: LocationData;
}

/** The information of one image or video (Aka Media)
 */
export type MediaData = {
    /** The path to the image 
     * @remarks Supported formats are jpg, jpeg, jfif, pjpeg, pjp, png, webp, gif, mp4, m4v ,m4a, m4b, mov
    */
    url: string;

    /**The alt text for the image
     * @remarks This is used for accessibility and SEO purposes
     * @remarks Caps at 1000 characters
     * @remarks **Dose not suport gifs or videos**
     */
    altText?: string;

    /**The amount of zoom applied to the image slider, Number between 0 and 100
     * @remarks 0 is no zoom, 100 is max zoom
     * @remarks **Dose not suport gifs or videos**
     * @warning **This procedure is very slow and may take up to 30 seconds to complete.**
     */
    zoom?: number;

    /** To crop the image
     * @remarks **Dose not suport gifs or videos**
     */
    CropOption?: CropOption;

    /** The content warning for the media
     * @remarks **Dose not suport gifs or videos**
     */
    contentWarning?: ContentWarning;
}

/** The Information about where the post is cominng from */
export type LocationData = {
    /** What will be looked up for the location */
    loactionQuery: string;

    /** The selected index of the returnd list */
    selectedLocation: number;
}

/** The information about a poll */
export type PollData = {
    /** The text in eatch poll option.
     * @remarks Only 4 options will go through. Poll will be ingored if there is less than one option. Max of 25 characters.
     */
    pollContent: string[];

    /** How long the poll will be up for. 
     * @remarks Caps at 7 days, 23 hours, 59 minutes.
    */
    pollDuration: number | TimeRanges;
}

/** The information about an image tag */
export type ImageTag = {
    /** The people you want to serch dor an image tag 
     * @remarks Caps at 10 people
    */
    personQuery: string[];

    /** The index of the person you wanna choose */
    selectedPerson: number[];

}

/** the content warning types */
export enum ContentWarning {
    /** Content warning for nudity */
    Nudity = 1 << 0,
    /** Content warning for violence */
    Violence = 1 << 1,
    /** Content warning for sensitive content */
    Sensitive = 1 << 2, 

}

/** The crop options */
export enum CropOption
{
    /** Aspect ratio won't be changed */
    Original,

    /** Aspect ratio cropped into wide format */
    Wide,

    /** Aspect ratio cropped into 1:1 */
    Square
}

export enum replyPerms
{
    Everyone,
    accountsYouFollow,
    verifiedAccounts,
    onlyAccountsYouMention
} 