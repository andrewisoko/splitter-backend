import { IsString, IsNotEmpty,IsNumber, IsOptional} from "class-validator";
import { Role } from "../users/entities/user.entity";

export class registerDto{


    @IsString()
    @IsNotEmpty()
    fullName:string  
    

    @IsString()
    @IsNotEmpty()
    userName:string
    

    @IsNumber()
    @IsNotEmpty()
    number:number 
    
    @IsString()
    @IsNotEmpty()
    email:string  

    @IsString()
    @IsNotEmpty()
    password:string
    
    @IsString()
    @IsNotEmpty()
    confirmPassword:string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    role:Role
    
}