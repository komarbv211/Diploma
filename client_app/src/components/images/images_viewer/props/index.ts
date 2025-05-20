export interface IAdvertImage {
    id: number,
    name: string,
    advertId: number,
    priority: number
}

export interface ImageViewerProps {
    className?: string
    advertImages: IAdvertImage[]
}