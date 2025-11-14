import { IsOptional,IsInt,Min,IsArray,IsString,IsIn,} from "class-validator";
import { Transform } from "class-transformer";

export class GetTransactionsDto {
@IsOptional()  @IsInt() @Min(1)
accountId?: number;

@IsOptional() dateFrom?: string; 
@IsOptional() dateTo?: string;

@IsOptional() @IsArray() @IsString({ each: true }) /**each true tells the validator if the array exist its  must be string type */
@Transform(({ value }) => (Array.isArray(value) ? value.map(v => v.toLowerCase()) : [value.toLowerCase()]))
status?: string[];

@IsOptional() @IsArray() @IsString({ each: true })
@Transform(({ value }) => (Array.isArray(value) ? value.map(v => v.toLowerCase()) : [value.toLowerCase()])) 
types?: string[];

@IsOptional() @IsInt() @Min(1)
limit?: number;

@IsOptional() @IsInt() @Min(0)
offset?: number;

@IsOptional()  @IsIn(['ASC', 'DESC'])
sort?: 'ASC' | 'DESC';
}