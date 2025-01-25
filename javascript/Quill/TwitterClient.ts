import { List } from './tools'
import { PageType, Page } from './Pages';


export default class TwitterClient implements ITwitterClient
{

    /* The username to sign in with
    */
    public username: string;
    public username2: string;
    /* The password used to sign in with
    */
    public password: string;
    /* The cookies used to login with
    */
    public cookies: string;
    public pages: List<Page>;

        // \/ set construction rules
    constructor();
    constructor(username: string, username2: string, password: string, cookies: string);
        // \/ One methond handles all edge cases for construction
    constructor(username?: string, username2?: string, password?: string, cookies?: string) {
        this.username = username || '';
        this.username2 = username2 || '';
        this.password = password || '';
        this.cookies = cookies || '';
        this.pages = new List<Page>();
    }


    public async Login(): Promise<void>;
    public async Login(username1: string, username2: string, password: string): Promise<void>;
    public async Login(username1: string, username2: string, password: string): Promise<void>
    {
        this.username = username1;
        this.username2 = username2;
        this.password = password;
    }
    // public CreateCompose() :ConposePage
    // {
    //     if (this.pages == null)
    //         this.pages = new();
    // }

}

interface ITwitterClient
{
    /* The username to sign in with
    */
    username: string;
    username2: string;

    /* The password used to sign in with
    */
    password: string;

    /* The cookies used to login with
    */
    cookies: string;

    pages: List<Page>;

    Login(username1: string, username2: string, password: string): Promise<void>;
}