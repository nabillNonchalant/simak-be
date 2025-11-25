import { z } from 'zod'

export const UserSchemaForCreate = z.object({
  name: z.string(),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal harus 6 karakter'),
  gender: z.string(),
  nipNisn: z.string(),
  tanggalLahir: z.string(),
  roleId: z.number(),
})


export const UserSchemaForUpdate = z.object({
  name: z.string().optional(),
  nomerTelepon: z.string().nullable().optional(),
  gender: z.string().optional().nullable(),
})


export const RegisterSchema = z.object({
  name: z.string().min(3, 'Nama minimal harus 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal harus 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak sesuai',
  path: ['confirmPassword'],
})

export const LoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal harus 6 karakter'),
})

