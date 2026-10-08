import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../../config/AwsS3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFromS3 = async (filename, expiresIn = 600) => {
    const bucket = process.env.AWS_BUCKET_NAME;
    if (!bucket) throw new Error("AWS_BUCKET_NAME is not set");
    
    try {
        const signUrl = await getSignedUrl(s3,
            new GetObjectCommand({
                Key: filename,
                Bucket:bucket
            }),
            {expiresIn}
        )
        return signUrl
    } catch (error) {
        console.error("Fetching from S3 failed:", error);
        throw error;
    }
};
