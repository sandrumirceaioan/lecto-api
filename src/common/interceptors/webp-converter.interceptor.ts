import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as sharp from 'sharp';

export const WebpInterceptor = (
	destination: string,
	size: number = 400,
) => {
	let interceptor = class WebpInterceptor implements NestInterceptor {
		async intercept(
			context: ExecutionContext,
			next: CallHandler,
		): Promise<Observable<any>> {
			const reqFile = context.switchToHttp().getRequest().file;

			if (reqFile) {
				const photoName = reqFile.originalname.split('.')[0];

				await sharp(`${reqFile.destination}/${reqFile.originalname}`)
					.webp()
					.toFile(`${destination}/${photoName}.webp`);

				await sharp(`${reqFile.destination}/${reqFile.originalname}`)
					.resize({
						width: size,
						fit: sharp.fit.cover
					})
					.webp()
					.toFile(
						`${destination}/${photoName}-small.webp`,
					);
			}

			return next.handle();
		}
	};

	return interceptor;
};

export const WebpsInterceptor = (destination: string, size: number = 150) => {
	let interceptor = class WebpInterceptor implements NestInterceptor {
		async intercept(
			context: ExecutionContext,
			next: CallHandler,
		): Promise<Observable<any>> {
			const images = context.switchToHttp().getRequest().files;

			if (images.length) {

				await Promise.all(images.map(async (image) => {

					const photoName = image.originalname.split('.')[0];

					await sharp(`${image.destination}/${image.originalname}`)
						.webp()
						.toFile(`${destination}/${photoName}.webp`);

					await sharp(`${image.destination}/${image.originalname}`)
						.resize({
							width: size,
							fit: sharp.fit.cover
						})
						.webp()
						.toFile(
							`${destination}/${photoName}-small.webp`,
						);

				}));

			}

			return next.handle();
		}
	};

	return interceptor;
};
