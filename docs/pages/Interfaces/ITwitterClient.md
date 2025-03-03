## Interface
> ```js
>   interface ITwitterClient
>   {
>       username: string;
>       username2: string;
>       password: string;
>       cookies: string;
>       pages: List<Page>;
>       Login(username1: string, username2: string, password: string): Promise<void>;
>   }
> ```

## Feilds

- ```username: string```
- ```username2: string```
- ```password:string```
- ```cookies:string```
- ```pages: List<Page>```
    > See [Page]()
    >
    > Javascript uses custom ```List``` class
    >
    