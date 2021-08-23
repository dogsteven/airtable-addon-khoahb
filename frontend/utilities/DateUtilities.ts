export function toTwoDigits(value: number): string {
    if (value < 10) {
        return `0${value}`
    } else {
        return `${value}`
    }
}