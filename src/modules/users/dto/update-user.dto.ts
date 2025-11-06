import { PartialType } from "@nestjs/mapped-types";
import { registerDto } from "src/modules/auth/register.dto";

export class UpdateUserDto extends PartialType(registerDto){}