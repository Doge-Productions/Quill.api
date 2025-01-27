import { Page } from "./Page";
import TwitterClient from "../TwitterClient";
import { By, until, IWebElement } from "selenium-webdriver";

export default class ComposePage extends Page
{
    protected constructor(client: TwitterClient) 
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
        let datta: TweetData;
        var invalidTweets: number = 0;
        if(typeof messageOrData === 'string' || media)
        {
            datta = {
                content: messageOrData as string,
                media: [{url: media as string}]
            };
        }
        else if (typeof messageOrData === 'string' && !media)
        {
            datta = {
                content: messageOrData as string
            };
        }
        else if(typeof messageOrData === 'object')
        {
            for (let i = 0; i < messageOrData.length; i++) {
                datta = messageOrData[i] as TweetData;
                if(datta.content == "" && datta.media == null)
                {
                    invalidTweets++;
                    continue;
                }
            }
            
        }
        else
        {
            throw new Error("Invalid Arguments");
        }

        
        
    }
}

type TweetData = {
    content: string;
    media?: MediaData[];
    imageTag?: ImageTag;
    sheduledTime?: Date;
    pollData?: PollData;
    locationData?: LocationData;
}

/** The information of one image or video (Aka Media)
 */
type MediaData = {
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
type LocationData = {
    /** What will be looked up for the location */
    loactionQuery: string;

    /** The selected index of the returnd list */
    selectedLocation: number;
}

/** The information about a poll */
type PollData = {
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
type ImageTag = {
    /** The people you want to serch dor an image tag 
     * @remarks Caps at 10 people
    */
    personQuery: string[];

    /** The index of the person you wanna choose */
    selectedPerson: number[];

}

/** the content warning types */
enum ContentWarning {
    /** No content warning */
    None = 0,
    /** Content warning for sensitive content */
    Sensitive = 1 << 0,
    /** Content warning for nudity */
    Nudity = 1 << 1
}

/** The crop options */
enum CropOption
{
    /** Aspect ratio won't be changed */
    Original,

    /** Aspect ratio cropped into wide format */
    Wide,

    /** Aspect ratio cropped into 1:1 */
    Square
}
