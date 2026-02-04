import { StorageService } from "@/services/storage/storageService.js";
import { processImage } from "@/services/storageHelper.js";

export class UploadService {
  static async uploadProfileImage(userId:string, body:Buffer, oldKey?:string){

    if(oldKey && !oldKey?.includes("default")){
      const isExternal = oldKey.startsWith("http");
      if (!isExternal) {
        await StorageService.deleteFile(oldKey);
      }
    }

    const {processedBuffer, format} = await processImage(body, {
      width: 400,
      height: 400,
      format: 'webp'
    });

    const key = `users/${userId}/photo_${Date.now()}.webp`

    await StorageService.uploadFile(key, processedBuffer, format);
    return key;
  }
}