import { RoleType } from '@prisma/client'

export type RoleTypeEnum =
  | 'SUPER_ADMIN'
  | 'OTHER'
  | 'GURU'
  | 'KEPALA_SEKOLAH'

export interface jwtPayloadInterface {
  id: number
  name: string
  role: RoleType
  roleType: 'SUPER_ADMIN' | 'OTHER' | 'GURU' | 'KEPALA_SEKOLAH'
  iat?: number
  exp?: number
}
