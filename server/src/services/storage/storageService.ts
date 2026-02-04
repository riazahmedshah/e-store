import { getS3Client } from "@/configs/s3Client.js";
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export class StorageService {
  static async checkFileExists(key: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key
        })

        await getS3Client().send(command)
        return true
    } catch (error) {
        if (error instanceof Error && error.name === 'NotFound') {
            return false
        }
        throw error
    }
  }
  static async uploadFile(Key:string, body:Buffer, ContentType:string): Promise<void>{
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key,
      Body:body,
      ContentType
    });
    await getS3Client().send(command);
  }

  static async deleteFile(Key:string){
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key
    });
    await getS3Client().send(command);
  }
}