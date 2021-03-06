import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/jwtManager';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import UserCache from '../models/UserCacheModel';
import PostModel from '../models/PostModel';

export = {
    /**
     * Handles requests for creating a post.
     */
    createPost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        await PostModel.createPost(req.user!.uid, String(req.body.message));
        res.sendStatus(200);
        
    },
    /**
     * Handles requests for creating a comment.
     */
    createCommentPost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { pid, uid } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        try {
            const postID = {
                pid: Number(pid),
                uid: Number(uid),
            };

            await PostModel.createComment(req.user!.uid, postID, String(req.body.message));
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Handles requests for liking a post.
     */
    likePost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { pid, uid } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        try {
            const postID = {
                pid: Number(pid),
                uid: Number(uid),
            };
            
            await PostModel.likePost(req.user!.uid, postID);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Handles requests for unliking a post.
     */
    unlikePost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { pid, uid } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        try {
            const postID = {
                pid: Number(pid),
                uid: Number(uid),
            };
            
            await PostModel.unlikePost(req.user!.uid, postID);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Handles requests for reposting a post.
     */
    repost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { pid, uid } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        try {
            const postID = {
                pid: Number(pid),
                uid: Number(uid),
            };
            
            await PostModel.repost(req.user!.uid, postID);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Handles requests for unreposting a post.
     */
    unrepost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { pid, uid } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        try {
            const postID = {
                pid: Number(pid),
                uid: Number(uid),
            };
            
            await PostModel.unrepost(req.user!.uid, postID);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Handles requests for viewing a post and it's comments.
     */
    viewPost: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { pid, username } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }

        try {
            await UserCache.cacheCheck(req.user!.uid);
        
            const lastDate = req.query.lastDate ? new Date(req.query.lastDate as string) : undefined;
            const uid = await UserCache.getUIDFromUsername(username as string);
            const commentTimeline = await UserCache.getCommentTimeline({ pid: Number(pid), uid }, req.user!.uid, lastDate);
            
            res.send(commentTimeline);
        } catch (err) {
            next(err);
        }
    }
}