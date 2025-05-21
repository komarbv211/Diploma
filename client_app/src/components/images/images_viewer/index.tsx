import { useEffect, useMemo, useState } from "react";
import ScrolledContainer from "../scrolled_container"
import { Image } from "antd";
import { ImageViewerProps } from "./props";
import { ImageViewerDataModel } from "./models";
import { APP_ENV } from "../../../env";


const ImagesViewer: React.FC<ImageViewerProps> = ({ className, advertImages }) => {
    const [imagesData, setImagesData] = useState<ImageViewerDataModel>({
        currentImage: '',
        images: []
    })
    const { images, currentImage } = imagesData;
    useEffect(() => {
        if (advertImages.length > 0) {
            const images = advertImages.slice().sort((a, b) => a.priority - b.priority).map(x => x.name) || [];
            setImagesData({ images: images, currentImage: images[0] })
        }
    }, [advertImages])

    const imagesElements = useMemo(() => images.map((image, index) => (
    <img loading="lazy" key={index}
        className={`${image === currentImage ? 'border-2 border-red-600' : ''} aspect-[16/19.5] flex-shrink-0 object-cover transition-all duration-300 ease-in-out hover:-translate-x-1`}
        src={APP_ENV.IMAGES_100_URL + image}
        onMouseDown={() => { setImagesData(prev => ({ ...prev, currentImage: image })) }}
    />
)), [images, currentImage]);

    const imagesPaths = useMemo(() => imagesData.images.map(x => APP_ENV.IMAGES_200_URL + x) || [], [imagesData.images])

    return (
        <>
            {imagesData.images.length > 0 &&
                <div className={`${className} grid grid-cols-[18%,_1fr] gap-4 aspect-[1/1] h-full`}>
                    <ScrolledContainer
                        scrollDir="vertical"
                        className="pl-1"
                    >
                        <div className="flex flex-col gap-[3.5vh]">
                            {imagesElements}
                        </div>
                    </ScrolledContainer>
                    <div className="h-full overflow-hidden">
                        <Image.PreviewGroup
                            items={imagesPaths}>
                            <Image loading='lazy' className="self-center object-cover " width={"100%"} height={"100%"}  src={APP_ENV.IMAGES_200_URL + imagesData.currentImage} />
                        </Image.PreviewGroup>
                    </div>
                </div>
            }
        </>
    )
}
export default ImagesViewer