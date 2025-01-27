export class List<T>
{
    private items: Array<T>;

    constructor()
    {
        this.items = [];
    }

    size(): number
    {
        return this.items.length;
    }

    add(value : T): void
    {
        this.items.push(value);
    }

    remove(value: T): void
    {
        this.items = this.items.filter(item => item !== value);
    }
    
    get(index: number): T
    {
        return this.items[index];
    }

    contains(value: T): boolean
    {
        return this.items.includes(value);
    }
    
    public [Symbol.iterator](): Iterator<T> {

        return this.items[Symbol.iterator]();

    }
}