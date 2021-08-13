export function toTwoDigits(value: number): string {
    if (value < 10) {
        return `0${value}`
    } else {
        return `${value}`
    }
}

export function parseDateString(value: string): number {
    const dateObject = {
        year: parseInt(value.slice(0, 4)),
        month: parseInt(value.slice(5, 7)),
        day: parseInt(value.slice(8, 11))
    }
    return Date.UTC(dateObject.year, dateObject.month, dateObject.day)
}
