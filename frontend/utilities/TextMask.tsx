import React, { FC } from "react"
import appConfig from "../config"

const TextMask: FC<{degree?: number, first?: string, percent?: number, second?: string }> = ({ degree, first, percent, second, children }) => {
    return (
        <span
            style={{
                display: "inline",
                background: `-webkit-linear-gradient(${degree ?? 0}deg, ${first ?? appConfig.colors.first} ${percent ?? 50}%, ${appConfig.colors.second})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            }} 
        >
            {children}
        </span>
    )
}

export default TextMask