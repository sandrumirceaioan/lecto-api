import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const OneFileInterceptor = (
	fileName: string,
	location: string,
) => {
	return FileInterceptor(fileName, {
		storage: diskStorage({
			destination: function (req, file, callback) {
				callback(null, location);
			},
			filename: (req, file, cb) => {
				// const datetimestamp = Date.now();
				cb(null, file.originalname);
			},
		}),
		fileFilter: (req, file, callback) => {
			if (!file.originalname.match(/\.(jpg|jpeg|png|ico)$/)) {
				return callback(
					new HttpException(
						'Only image files are allowed',
						HttpStatus.BAD_REQUEST,
					),
					false,
				);
			}
			callback(null, true);
		},
		limits: {
			fieldNameSize: 300,
			fileSize: 1048576, // 10 Mb
		},
	});
};

export const ManyFilesInterceptor = (name: string, location: string, maxCount = 20) => {
	return FilesInterceptor(name, maxCount, {
		storage: diskStorage({
			destination: function (req, file, callback) {
				callback(null, location);
			},
			filename: (req, file, cb) => {
				// const datetimestamp = Date.now();
				cb(null, file.originalname);
			},
		}),
		fileFilter: (req, file, callback) => {
			if (!file.originalname.match(/\.(jpg|jpeg|png|ico)$/)) {
				return callback(
					new HttpException(
						'Only image files are allowed',
						HttpStatus.BAD_REQUEST,
					),
					false,
				);
			}
			callback(null, true);
		},
	});
};
