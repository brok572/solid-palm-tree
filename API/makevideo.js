import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import ffmpeg from "ffmpeg-static";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { images, duration = 1 } = req.body;

  if (!images || !Array.isArray(images) || images.length < 2) {
    return res.status(400).json({ error: "Send at least 2 base64 images in 'images' array" });
  }

  const tempDir = "/tmp/nexus_video_" + Date.now();
  fs.mkdirSync(tempDir);

  try {
    const imagePaths = [];

    // Save frames
    for (let i = 0; i < images.length; i++) {
      const base64 = images[i].replace(/^data:image\/\w+;base64,/, "");
      const filePath = path.join(tempDir, `frame_${String(i).padStart(3, "0")}.jpg`);
      fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
      imagePaths.push(filePath);
    }

    const outputVideo = path.join(tempDir, "output.mp4");

    // Run ffmpeg
    await new Promise((resolve, reject) => {
      execFile(
        ffmpeg,
        [
          "-y",
          "-framerate",
          String(1 / duration),
          "-i",
          path.join(tempDir, "frame_%03d.jpg"),
          "-vf",
          "scale=720:-1",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          outputVideo
        ],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    const videoBuffer = fs.readFileSync(outputVideo);

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", "attachment; filename=\"nexus-video.mp4\"");
    res.send(videoBuffer);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Video generation failed" });
  }
}
