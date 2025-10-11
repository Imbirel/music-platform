import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('/tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
    @Body() dto: CreateTrackDto,
  ) {
    if (
      !files.picture ||
      !files.picture[0] ||
      !files.audio ||
      !files.audio[0]
    ) {
      throw new HttpException(
        'Picture and audio files are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.create(dto, files.picture[0], files.audio[0]);
  }

  @Get()
  async getAll(@Query('count') count = 10, @Query('offset') offset = 0) {
    return this.trackService.getAll(Number(count), Number(offset));
  }

  @Get('/search')
  async search(@Query('query') query: string) {
    return this.trackService.search(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: Types.ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.trackService.delete(id);
  }

  @Post('/comment')
  async addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  async listen(@Param('id') id: Types.ObjectId) {
    return this.trackService.listen(id);
  }
}
