import { isString, IsString, IsNotEmpty, isNotEmpty, IsNumber} from "class-validator";

export class AuthDTO{
    @IsString()
    @IsNotEmpty()
    fullName:string  

    @IsString()
    @IsNotEmpty()
    userName:string

    @IsString()
    @IsNotEmpty()
    email:string  

    @IsNumber()
    @IsNotEmpty()
    number:number 

    @IsString()
    @IsNotEmpty()
    password:string  

}