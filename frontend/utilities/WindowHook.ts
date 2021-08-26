import React from "react"

const WindowSizeContext = React.createContext({
    width: window.innerWidth,
    height: window.innerHeight
})

export default WindowSizeContext

