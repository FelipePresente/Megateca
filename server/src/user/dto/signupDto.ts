import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export default class SignUpDto {
    @IsString()
    @MinLength(4, { message: 'Username must contain at least 4 characters' })
    @MaxLength(16, { message: 'Username must not contain more than 16 characters' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username must contain only letters and numbers' })
    username: string;

    @IsString()
    @MinLength(8, { message: 'Password must contain at least 8 characters' })
    @MaxLength(40, { message: 'Password must not contain more than 40 characters' })
    @Matches(/^\S+$/, { message: 'Password must not contain spaces' })
    password: string;
}
