export default class DomainError extends Error {
    protected errorName = 'domain_error';
    protected success: boolean;
    protected internal: Error | null;
    protected httpCode = 500;
    protected data: { [key: string]: any }

    public constructor(
        message: string,
        error: Error | null,
        data: { [key: string]: any },
        success = false,
    ) {
        super(message);
        this.internal = error;
        this.data = data;
        this.success = success
    }

    public getStatus(): boolean {
        return this.success;
    }
    public getInternalError(): Error | null {
        return this.internal;
    }
    public getHttpCode(): number {
        return this.httpCode;
    }
    public getData(): { [key: string]: any } {
        return this.data;
    }
    public getName(): string {
        return this.errorName;
    }

}