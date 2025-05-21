import { ReactNode } from "react"

export interface ScrolledContainerProps {
    children?: ReactNode
    scrollDir?: "horisontal" | "vertical"
    className?: string
}