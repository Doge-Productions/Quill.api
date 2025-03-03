import EventEmitter from "events";

export class Logger extends EventEmitter
{
    _uptime: number;
    _date: Date;
    _prefix: string;
    _suffix: string;
    _CollorMode: boolean;

    constructor(); // << singature 
    constructor(Prefix: string, Suffix: string, Collored: boolean); // << signature
    constructor(Prefix?: string, Suffix?: string, Collored?: boolean) // << implementation signature
    {
        super();
        this._uptime = 0;
        this._date = new Date();
        this._prefix = Prefix || '[Logger]';
        this._suffix = Suffix || '\n';
        this._CollorMode = Collored || false;
    }

    public Log(message: string): void;
    public Log(message: string, level: LogLevel): void;
    public Log(message?: any, level?: LogLevel): void
    {
        if (!message) return;
        if (this._suffix == "" || this._suffix == '\n')
            this._suffix = '\x1b[37m';

        if (!level)
            level = LogLevel.Debug;

        switch (level)
        {
            /**Fatal 
            */
            case LogLevel.Fatal:
                if (this._CollorMode)
                    this.emit('Fatal', `${this._prefix} \x1b[31m[Fatal]: \x1b[30m${message} ${this._suffix}`);
                else
                    this.emit('Fatal', `${this._prefix} [Fatal]: ${message} ${this._suffix}`);
                break;
            /**non failtle 
            */
            case LogLevel.NonFatal:
                if(this._CollorMode)
                    this.emit('NonFatal', `${this._prefix} \x1b[33m[NonFatal]: \x1b[30m${message} ${this._suffix}`);
                else
                    this.emit('NonFatal', `${this._prefix} [NonFatal]: ${message} ${this._suffix}`);
                break;
            /**Info 
            */
            case LogLevel.Info:
                if(this._CollorMode)
                    this.emit('Info', `${this._prefix} \x1b[32m[Info]: \x1b[30m${message} ${this._suffix}`);
                else
                    this.emit('Info', `${this._prefix} [Info]: ${message} ${this._suffix}`);
                break;
            /**Debug
            */
            case LogLevel.Debug:
                this.emit('Debug', `${this._prefix} \x1b[34m[Debug]: \x1b[30m${message} ${this._suffix}`);
                break;
            default:
                this.emit('Debug', `${this._prefix} [Debug]: ${message} ${this._suffix}`);
                break;
        }
        return;

    }

}

export enum LogLevel
{
    /** A fatal error that will cause a program crash
     * @remarks Will cause your program to hault and crash.
    */
    Fatal = 1,
    /** A non-fatal error that will not cause a program crash
     * @remarks Will not cause your program to hault, but insted will be ignored and continue to run.
     */
    NonFatal = 2,
    /** just info if you want to know what is happening ir somthing idk
     * @remarks Default Prefix is [Info]
     */
    Info = 3,
    /** Debugging information
     * @remarks Default Prefix is [Debug]
     */
    Debug = 4,
}