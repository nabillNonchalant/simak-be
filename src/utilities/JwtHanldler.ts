import jwt from 'jsonwebtoken'



export const generateAccesToken = (
  payload: object, // ubah dari string → object
  secret: string,
  expiresIn: number,
): string => {
  return jwt.sign(payload, secret, { expiresIn })
}

export const verifyAccesToken = function (
  token: string,
  secretToken: string,
): jwtPayloadInterface | null {
  try {
    const decoded = jwt.verify(token, secretToken)

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      return decoded as jwtPayloadInterface
    }

    return null
  } catch (error) {
    return null
  }
}
