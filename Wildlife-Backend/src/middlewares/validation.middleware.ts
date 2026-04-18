import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod' 
import { HTTP_STATUS } from '../utils/constants'

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction):Promise<void|any> => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
      
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          message: 'Validation failed',
          errors
        })
      }

      next(error)
    }
  }
}