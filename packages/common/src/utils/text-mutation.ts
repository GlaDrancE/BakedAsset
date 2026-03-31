export const slugify = (value: string): string => {
    return value
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export const assertNonEmptyString = (value: unknown, fieldName: string): string => {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Invalid ${fieldName}`);
    }
    return value.trim();
};

export const assertNotNullish = (value: unknown, fieldName: string): unknown => {
    if (value === undefined || value === null) {
        throw new Error(`Invalid ${fieldName}`);
    }
    return value;
};