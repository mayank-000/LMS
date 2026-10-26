const ffmpeg = require("fluent-ffmpeg");

// fluent-ffmpeg spawns the actual ffmpeg binary (installed in your Docker image) as a child process, running roughly:
// ffmpeg -i tmp/1699999999-lecture1.mp4 -vcodec libx264 -crf 28 compressed/1699999999-....mp4

function compressVideo(input, output) {
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .videoCodec('libx264')
            .outputOptions('-crf 28')
            .save(output)
            .on('end', () => resolve(output))
            .on('error', reject)
    });
}

module.exports = compressVideo;