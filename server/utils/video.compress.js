const ffmpeg = require("fluent-ffmpeg");

// fluent-ffmpeg spawns the actual ffmpeg binary (installed in your Docker image) as a child process, running roughly:
// ffmpeg -i tmp/1699999999-lecture1.mp4 -vcodec libx264 -crf 28 compressed/1699999999-....mp4

function compressVideo(input, output) {
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .videoCodec('libx264')
            .audioCodec("aac")
            .outputOptions([
                "-crf 28",
                "-preset veryfast", // veryfast trades slightly larger files for much quicker encoding
                "-pix_fmt yuv420p", // yuv420p makes the video play in all browsers, since some source formats otherwise produce files Chrome or Safari won’t play.
                "-movflags +faststart", // +faststart moves the metadata to the start of the file. Without it, browsers often can’t start playback or seek until the whole file downloads, which matters a lot when you stream through presigned URLs.
            ])
            .save(output)
            .on('end', () => resolve(output))
            .on('error', reject)
    });
}

module.exports = compressVideo;