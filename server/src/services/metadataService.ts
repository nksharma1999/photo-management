import exifr from "exifr";


export const getImageMetadata = async (filepath:string) =>{
    const metadata = await exifr.parse(filepath);
    return metadata;
}