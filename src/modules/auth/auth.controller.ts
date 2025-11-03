import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from './auth.dto';


@Controller('auth')
export class AuthController {

    @Post('register')
    create(@Body() authDTO:AuthDTO){
        return 'user registered'
    }
}
