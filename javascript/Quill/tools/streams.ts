export class Stream<T> {
    private listeners: ((value: T) => void)[] = [];
    private values: T[] = [];

    // Push a new value to the stream
    push(value: T): void {
        this.values.push(value);
        this.notify(value);
    }

    // Subscribe to stream updates
    subscribe(listener: (value: T) => void): () => void {
        this.listeners.push(listener);
        // Send existing values to new subscriber
        this.values.forEach(value => listener(value));
        
        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    // Clear all values from the stream
    clear(): void {
        this.values = [];
    }

    // Get current values
    getValues(): T[] {
        return [...this.values];
    }

    // Remove a specific value
    remove(value: T): void {
        const index = this.values.indexOf(value);
        if (index > -1) {
            this.values.splice(index, 1);
        }
    }

    private notify(value: T): void {
        this.listeners.forEach(listener => listener(value));
    }
}