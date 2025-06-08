import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';

export function Auth() {
  return applyDecorators(ApiSecurity('bearer'), ApiBearerAuth());
}
