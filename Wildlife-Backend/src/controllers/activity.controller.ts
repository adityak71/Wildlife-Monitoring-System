import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as activityService from "../services/activity.service";
import { HTTP_STATUS } from "../utils/constants";
import logger from "../utils/logger";
import { createActivitySchema } from "../schemas/activity.schema";

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    console.log("❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️")
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      })
    }


    const validationResult = createActivitySchema.safeParse(req.body)
    
    if (!validationResult.success) {
      console.error('❌ Validation errors:', validationResult.error.issues)
      
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    const result = await activityService.createActivity(validationResult.data, req.user.id)
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    console.error('❌ Create activity error:', error)
    logger.error('Create activity controller error:', error)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating activity'
    })
  }
}
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;
    const status = req.query.status as string;
    const locationId = req.query.locationId as string;
    const speciesId = req.query.speciesId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "date";
    const sortOrder = (req.query.sortOrder as string) || "desc";

    const filters: any = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    if (type && type !== "all" && type !== "undefined") filters.type = type;
    if (status && status !== "all" && status !== "undefined")
      filters.status = status;
    if (locationId && locationId !== "undefined")
      filters.locationId = locationId;
    if (speciesId && speciesId !== "undefined") filters.speciesId = speciesId;
    if (startDate && startDate !== "undefined") filters.startDate = startDate;
    if (endDate && endDate !== "undefined") filters.endDate = endDate;
    if (search && search !== "undefined") filters.search = search;

    const result = await activityService.getAllActivities(filters);
    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error("Get all activities error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching activities",
    });
  }
};
export const getActivityById = async (req: Request, res: Response) => {
  const result = await activityService.getActivityById(req.params.id as string);
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

export const updateActivityStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
  }

  const result = await activityService.updateActivityStatus(
    req.params.id as string,
    req.body.status,
    req.user.id,
    req.body.notes,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

export const updateActivity = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
  }

  const result = await activityService.updateActivity(
    req.params.id as string,
    req.body,
    req.user.id,
    req.user.role,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
  const result = await activityService.deleteActivity(req.params.id as string);
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
  });
};

export const getActivityStats = async (_: Request, res: Response) => {
  const result = await activityService.getActivityStats();
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};
