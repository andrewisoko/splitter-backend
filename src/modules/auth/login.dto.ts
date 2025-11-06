import { IsString, IsNotEmpty,IsNumber} from "class-validator";

export class loginDto{


    @IsString()
    @IsNotEmpty()
    email:string  

    @IsString()
    @IsNotEmpty()
    password:string  
    
}