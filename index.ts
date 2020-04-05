import JobInfo from "./models/JobInfo";

require('dotenv').config();

import {DoneCallback, Job} from "bull";
import ThumbnailUtil from "./utils/thumbnail";
import FileUtil from "./utils/file";
const fs = require('fs');
const path = require('path');
const Bull = require('bull');

const queue = new Bull('thumbnail-generations', {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || undefined,
  }
});

queue.process(async (job: Job<JobInfo>, done: DoneCallback) => {
  const { data: jobInfo } = job;
  const { filePath, fileMIME, dstFolder } = jobInfo;
  const fileName = path.basename(filePath);
  const thumbnailPath = `${dstFolder}/${fileName}.jpg`;

  if (fs.existsSync(thumbnailPath)) {
    console.log(`Thumbnail already exists for ${filePath}`);
    return done();
  }

  if (!FileUtil.isSupportedImageMIME(fileMIME) && !FileUtil.isSupportedVideoMIME(fileMIME)) {
    console.log(`Unsupported format detected for thumbnail generation for ${filePath} (${fileMIME})`);
  }

  if (!fs.existsSync(dstFolder)) {
    fs.mkdirSync(dstFolder, { recursive: true });
  }

  console.log(`Started generating thumbnail for: ${filePath}`);
  return ThumbnailUtil
    .generate(jobInfo)
    .then(dstPath => {
      console.log('Finished generating thumbnail at: ', dstPath);
      done()
    })
    .catch(errorMessage => {
      console.log('Cannot process video. Reason: ' + errorMessage);
      done()
    })
});
