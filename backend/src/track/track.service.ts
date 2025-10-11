import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);

  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateTrackDto,
    picture: Express.Multer.File,
    audio: Express.Multer.File,
  ): Promise<Track> {
    try {
      const audioPath = await this.fileService.createFile(
        FileType.AUDIO,
        audio,
      );
      const picturePath = await this.fileService.createFile(
        FileType.IMAGE,
        picture,
      );
      const track = await this.trackModel.create({
        ...dto,
        listens: 0,
        audio: audioPath,
        picture: picturePath,
      });
      return track;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Failed to create track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    return this.trackModel.find().skip(offset).limit(count).exec();
  }

  async getOne(id: Types.ObjectId): Promise<Track> {
    const track = await this.trackModel
      .findById(id)
      .populate('comments')
      .exec();
    if (!track) {
      throw new NotFoundException(`Track with id ${id.toString()} not found`);
    }
    return track;
  }

  async delete(
    id: Types.ObjectId,
  ): Promise<{ id: Types.ObjectId; message: string }> {
    const track = await this.trackModel.findByIdAndDelete(id).exec();
    if (!track) {
      throw new NotFoundException(`Track with id ${id.toString()} not found`);
    }

    if (track.audio) {
      await this.fileService.removeFile(track.audio);
    }
    if (track.picture) {
      await this.fileService.removeFile(track.picture);
    }

    await this.commentModel.deleteMany({ track: id }).exec();

    return { id: track._id, message: 'Track deleted successfully' };
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId).exec();
    if (!track) {
      throw new NotFoundException(
        `Track with id ${dto.trackId.toString()} not found`,
      );
    }

    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();

    return comment;
  }

  async listen(id: Types.ObjectId): Promise<void> {
    const track = await this.trackModel
      .findByIdAndUpdate(id, { $inc: { listens: 1 } }, { new: true })
      .exec();

    if (!track) {
      throw new NotFoundException(`Track with id ${id.toString()} not found`);
    }
  }

  async search(query: string): Promise<Track[]> {
    return this.trackModel
      .find({ name: { $regex: new RegExp(query, 'i') } })
      .exec();
  }
}
