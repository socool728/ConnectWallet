export function toError(error: any): Error
{
    if (error instanceof Error)
    {
        return error;
    }
    if (typeof error === "object")
    {
        return new Error(typeof error.message === "undefined" ? "Unknown error" : error.message);
    }
    if (typeof error === "string")
    {
        return new Error(error);
    }
    return new Error("Unknown error");
}
