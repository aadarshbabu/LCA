import fs from "fs";
import path from "path";

// provider enum

export enum StorageProviderEnum {
  LOCAL = "local",
  S3 = "s3",
  GCS = "gcs",
}

export class StorageProvider {
  private provider: StorageProviderEnum;

  constructor() {
    this.provider =
      (process.env.STORAGE_PROVIDER as StorageProviderEnum) ||
      StorageProviderEnum.LOCAL;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    switch (this.provider) {
      case "s3":
        return this.uploadToS3(file);
      case "gcs":
        return this.uploadToGCS(file);
      default:
        return this.uploadToLocal(file);
    }
  }

  private async uploadToS3(file: Express.Multer.File): Promise<string> {
    // const s3 = new S3();
    // const params = {
    //   Bucket: process.env.S3_BUCKET_NAME!,
    //   Key: file.originalname,
    //   Body: file.buffer,
    // };
    // const result = await s3.upload(params).promise();
    // return result.Location;
    return `https://s3.amazonaws.com/${process.env.S3_BUCKET_NAME}/${file.originalname}`;
  }

  private async uploadToGCS(file: Express.Multer.File): Promise<string> {
    // const storage = new Storage();
    // const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
    // const blob = bucket.file(file.originalname);
    // const blobStream = blob.createWriteStream();

    // blobStream.end(file.buffer);

    // return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${file.originalname}`;
    return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${file.originalname}`;
  }

  private async uploadToLocal(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const uploadPath = path.join(
      uploadDir,
      `${uniqueSuffix}-${file.originalname}`
    );
    fs.writeFileSync(uploadPath, file.buffer);
    return uploadPath;
  }
}
