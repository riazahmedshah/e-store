import { StorageService } from "@/services/storage/storageService.js";
import { processImage } from "@/services/storageHelper.js";
import path from "node:path";

export class UploadService {
  static async uploadSingleImage(key: string, body: Buffer, oldKey?: string) {
    if (oldKey && !oldKey?.includes("default")) {
      const isExternal = oldKey.startsWith("http");
      if (!isExternal) {
        await StorageService.deleteFile(oldKey);
      }
    }

    const { processedBuffer, format } = await processImage(body, {
      width: 400,
      height: 400,
      format: "webp",
    });

    await StorageService.uploadFile(key, processedBuffer, format);
    return key;
  }

  static async uploadImageArray(
    productId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromise = files.map(async (file, idx) => {
      const { processedBuffer, format} = await processImage(file.buffer, {
        format:'webp',
        width: 512,
        height: 512
      });
      const key = `products/${productId}/img_${idx}_${Date.now()}.webp`
      await StorageService.uploadFile(key, processedBuffer, format);
      return key;
    })
    return Promise.all(uploadPromise);
  }

  static async updateProductImage(key:string, productId:string, body:Buffer){
    const idx = Number(path.basename(key).split("_")[1])
    await StorageService.deleteFile(key);

    const { processedBuffer, format} = await processImage(body, {
      format:'webp',
      width: 512,
      height: 512
    });
    const newKey = `products/${productId}/img_${idx}_${Date.now()}.webp`
    await StorageService.uploadFile(newKey, processedBuffer, format);
    return newKey;
  }
}
