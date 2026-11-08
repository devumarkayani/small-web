import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class CreateSiteDto {
  @IsString() @Matches(/^[a-z0-9][a-z0-9-]{1,38}\.zz$/i, { message: 'Address must  (letters, numbers and hyphens only).' }) address: string;
  @IsString() @MinLength(2) @MaxLength(100) title: string;
  @IsString() @MinLength(10) @MaxLength(50000) html: string;
  @IsString() @MinLength(1) @MaxLength(60) author: string;
}
