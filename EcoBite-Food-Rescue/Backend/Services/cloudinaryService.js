const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = (buffer) => {
  if (!buffer) {
    return Promise.reject(
      new Error("No image buffer provided to Cloudinary")
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecobite",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", {
            message: error?.message,
            http_code: error?.http_code,
            name: error?.name,
          });

          return reject(error);
        }

        if (!result?.secure_url) {
          return reject(
            new Error(
              "Cloudinary upload completed without secure_url"
            )
          );
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(buffer)
      .on("error", reject)
      .pipe(uploadStream);
  });
};

module.exports = {
  uploadImage,
};