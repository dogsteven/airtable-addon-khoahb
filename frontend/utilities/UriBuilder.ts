

export class URIBuilder {
    private path: string = ""
    private queryParams: { key: string, value: string }[] = []

    public withPath(path: string): URIBuilder {
        this.path = path
        return this
    }

    public withQuery<T>(key: string, value: T | null): URIBuilder {
        if (value != null) {
            this.queryParams.push({ key: key, value: `${value}`.replace(' ', '%20') })
        }
        return this
    }

    public get absolute(): string {
        const query = this.queryParams.map(({key, value}) => `${key}=${value}`).join('&')
        return `${this.path}?${query}`
    }
    
}

export default function URI() { return new URIBuilder() }