import { isString, IsString, IsNotEmpty, isNotEmpty} from "class-validator";

export class AuthDTO{
    @IsString()
    @IsNotEmpty()
    name:string  

    @IsString()
    @IsNotEmpty()
    email:string  

    @IsString()
    @IsNotEmpty()
    password:string  

    @IsString()
    @IsNotEmpty()
    number:number 
}