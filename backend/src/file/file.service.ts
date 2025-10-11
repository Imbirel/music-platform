import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);

  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(__dirname, '..', 'static', type);

      await fs.mkdir(filePath, { recursive: true });
      await fs.writeFile(path.join(filePath, fileName), file.buffer);

      return path.join(type, fileName).replace(/\\/g, '/');
    } catch (error) {
      this.logger.error(error);
      const message =
        error instanceof Error ? error.message : 'Internal Server Error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFile(fileName: string): Promise<void> {
    try {
      const filePath = path.join(__dirname, '..', 'static', fileName);
      await fs.unlink(filePath).catch(() => {
        this.logger.warn(`File ${filePath} does not exist or already deleted`);
      });
    } catch (error) {
      this.logger.error(error);
      const message =
        error instanceof Error ? error.message : 'Internal Server Error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
