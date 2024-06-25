/** @types {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "newus-bucket.s3.ap-southeast-2.amazonaws.com",
      "res.cloudinary.com",
      "ui-avatars.com"
    ],
  },
};

export default nextConfig;
