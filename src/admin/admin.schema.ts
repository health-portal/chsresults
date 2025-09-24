import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CourseBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    lecturerId: string;
}

export class CourseResponse extends CourseBody {
    @ApiProperty()
    @IsUUID()
    id: string;
}
