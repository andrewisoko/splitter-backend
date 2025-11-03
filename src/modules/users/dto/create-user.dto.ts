import { IsNotEmpty,IsString } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    name:string;
}