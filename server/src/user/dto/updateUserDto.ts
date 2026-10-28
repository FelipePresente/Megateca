import { PartialType } from '@nestjs/mapped-types';
import SignUpDto from './signupDto';

export default class UpdateUserDto extends PartialType(SignUpDto) { }