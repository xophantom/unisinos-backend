import { ApiProperty } from '@nestjs/swagger';
import { School } from '../../entities/school.entity';
import { Course } from '../../entities/course.entity';

export class SchoolAnalysis {
  @ApiProperty()
  school: School;

  @ApiProperty()
  colorCount: number;

  @ApiProperty()
  percentage: number;

  @ApiProperty({ type: [Course] })
  courses: Course[];
}

export class ColorAnalysisResponseDto {
  @ApiProperty({ type: [SchoolAnalysis] })
  schools: SchoolAnalysis[];

  @ApiProperty()
  colorDistribution: Record<string, number>;

  @ApiProperty()
  percentageDistribution: Record<string, number>;

  @ApiProperty()
  hasTie: boolean;
}
