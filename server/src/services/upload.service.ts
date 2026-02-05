import { StorageService } from "@/services/storage/storageService.js";
import { processImage } from "@/services/storageHelper.js";

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
}
