import ffmpeg from 'fluent-ffmpeg';
import im from 'imagemagick';
import path from 'path';
import JobInfo from "../models/JobInfo";
import FileUtil from "./file";

export default class ThumbnailUtil {
  public static generate(jobInfo: JobInfo): Promise<string> {
    const { filePath, fileMIME, dstFolder } = jobInfo;
    const fileName = path.basename(filePath); // keeping extension on purpose to avoid images with same name but different extensions to share the same thumbnail
    const dstPath = `${dstFolder}/${fileName}.jpg`;

    if (FileUtil.isHEIC(fileMIME)) {
      return this.generateForHEIC(filePath, dstPath);
    } else if (FileUtil.isSupportedImageMIME(fileMIME)) {
      return this.generateForImage(filePath, dstPath);
    } else if (FileUtil.isSupportedVideoMIME(fileMIME)) {
      return this.generateForVideo(filePath, dstPath);
    } else {
      return Promise.reject('Unsupported MIME detected.');
    }
  }

  private static generateForImage (srcPath: string, dstPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(srcPath)
        .size('500x?')
        .output(dstPath)
        .on('end', function() {
          resolve(dstPath);
        })
        .on('error', function(err) {
          reject(err.message);
        })
        .run()
    })
  }

  private static generateForHEIC (srcPath: string, dstPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      im.convert([srcPath, '-resize', '500', dstPath],
        function(err){
          if (err) {
            reject(err.message)
          }
          resolve(dstPath);
        });
    })
  }

  private static async generateForVideo(srcPath: string, dstPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(srcPath)
        .inputOptions(['-ss', '1',])
        .outputOptions(['-f', 'image2', '-vframes', '1'])
        .size('500x?')
        .output(dstPath)
        .on('end', function() {
          resolve(dstPath);
        })
        .on('error', function(err) {
          reject(err.message);
        })
        .run()
    })
  }
}
