/**
 *
 * @param key - is filename/objectName
 */

import sharp from "sharp";

interface Options {
  width?: number;
  height?: number;
  format?: "webp";
  quality?: number;
}
export const processImage = async (
  imageBuffer: Buffer,
  options?: Options,
) => {
  let processedImage = sharp(imageBuffer);
  if(options?.width || options?.height){
    processedImage = processedImage.resize(options.width, options.height,{
      fit: 'cover',
      background:{r: 255, g: 255, b: 255}
    });
  };

  if(options?.format){
    processedImage = processedImage[options.format]({
      quality: options.quality || 80 
    });
  }

  const processedBuffer = await processedImage.toBuffer();

  return {
    processedBuffer,
    format: `image/webp`
  }
};
