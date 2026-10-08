import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3  from "../../config/AwsS3.js"

export const uploadToS3 = async (filename, buffer, contentType) => {
    const bucket = process.env.AWS_BUCKET_NAME;

    if (!bucket) throw new Error("AWS_BUCKET_NAME is not set");

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: filename,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return filename;
    } catch (err) {
      console.error("S3 upload failed:", err);
      throw err;
    }
}