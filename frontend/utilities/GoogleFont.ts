import { loadCSSFromURLAsync } from "@airtable/blocks/ui"

export class GoogleFont {
    readonly name: string
    weights: string[]

    constructor(name: string) {
        this.name = name
        this.weights = []
    }

    public withWeight(weight: number): GoogleFont {
        this.weights.push(`${weight}`)
        return this
    }
}

export default async function LoadGoogleFont(font: GoogleFont): Promise<void> {
    const weightsString = `${font.weights.map((weight) => `0,${weight}`).join(';')};${font.weights.map((weight) => `1,${weight}`).join(';')}`
    await loadCSSFromURLAsync(`https://fonts.googleapis.com/css2?family=${font.name.replace(' ', '+')}:ital,wght@${weightsString}&display=swap`)
}