const IMAGE_MIMES = ['image/jpeg', 'image/bmp', 'image/png', 'image/webp', 'image/heic'];
const VIDEO_MIMES = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime'];

export default class FileUtil {
  public static isSupportedImageMIME(mime: string): boolean {
    return IMAGE_MIMES.indexOf(mime) >= 0;
  }

  public static isSupportedVideoMIME(mime: string): boolean {
    return VIDEO_MIMES.indexOf(mime) >= 0;
  }
}
