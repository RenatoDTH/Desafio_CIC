/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-unresolved */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { Request } from 'express-serve-static-core';

class UploadFile {
  private URL: string = path.basename('upload');

  constructor() {}

  private storage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(this.URL)) {
          fs.mkdirSync(this.URL);
        }
        cb(null, this.URL);
      },
      filename: (req, file, cb) => {
        const type = mime.extension(file.mimetype);
        cb(null, `${new Date().getTime()}.${type}`);
      },
    });
  }

  private fileFilter() {
    return (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback,
    ) => {
      const type = mime.extension(file.mimetype);

      const conditions = ['csv', 'pdf'];

      if (conditions.includes(`${type}`)) {
        cb(null, true);
      }
      cb(null, false);
    };
  }

  get getConfig(): multer.Options {
    return {
      storage: this.storage(),
      fileFilter: this.fileFilter(),
    };
  }
}

export { UploadFile };
