import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { ArchiveEvents200ResponseInner } from '../models/ArchiveEvents200ResponseInner';
import { ArchiveRequests200ResponseInner } from '../models/ArchiveRequests200ResponseInner';
import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { GetDanmaku200ResponseInner } from '../models/GetDanmaku200ResponseInner';
import { Users200Response } from '../models/Users200Response';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponseCategoriesInner } from '../models/Videos200ResponseCategoriesInner';
import { Videos200ResponsePaginationData } from '../models/Videos200ResponsePaginationData';
import { Videos200ResponseVideosInner } from '../models/Videos200ResponseVideosInner';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get archive events
     * @param downloadID download id to filter on
     */
    public archiveEvents(downloadID: string, _options?: Configuration): Promise<Array<ArchiveEvents200ResponseInner>> {
        const result = this.api.archiveEvents(downloadID, _options);
        return result.toPromise();
    }

    /**
     * Get archive requests
     * @param cookie auth cookies etc
     */
    public archiveRequests(cookie: string, _options?: Configuration): Promise<Array<ArchiveRequests200ResponseInner>> {
        const result = this.api.archiveRequests(cookie, _options);
        return result.toPromise();
    }

    /**
     * Get archive requests
     * @param pageNumber content page number
     * @param id user id to filter on
     * @param cookie auth cookies etc
     */
    public auditEvents(pageNumber: number, id: number, cookie: string, _options?: Configuration): Promise<Array<ArchiveRequests200ResponseInner>> {
        const result = this.api.auditEvents(pageNumber, id, cookie, _options);
        return result.toPromise();
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     * @param cookie auth cookies etc
     */
    public comment(parent: number, content: string, videoID: number, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.comment(parent, content, videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public comments(id: number, _options?: Configuration): Promise<Array<Comments200ResponseInner>> {
        const result = this.api.comments(id, _options);
        return result.toPromise();
    }

    /**
     * Create new danmaku
     * @param videoID video ID for danmaku
     * @param timestamp timestamp for danmaku
     * @param message message
     * @param type type of comment
     * @param color comment color
     * @param fontSize comment font size
     */
    public createDanmaku(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Promise<void> {
        const result = this.api.createDanmaku(videoID, timestamp, message, type, color, fontSize, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public deleteArchiveRequest(downloadID: number, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.deleteArchiveRequest(downloadID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Delete a comment
     * @param id comment ID
     * @param cookie auth cookies etc
     */
    public deleteComment(id: number, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.deleteComment(id, cookie, _options);
        return result.toPromise();
    }

    /**
     * Create new email validation
     * @param email email
     */
    public emailValidation(email: string, _options?: Configuration): Promise<void> {
        const result = this.api.emailValidation(email, _options);
        return result.toPromise();
    }

    /**
     * Upvote a video
     * @param id user ID
     */
    public follow(id: number, _options?: Configuration): Promise<void> {
        const result = this.api.follow(id, _options);
        return result.toPromise();
    }

    /**
     * Upvote a video
     */
    public followFeed(_options?: Configuration): Promise<Array<Videos200ResponseVideosInner>> {
        const result = this.api.followFeed(_options);
        return result.toPromise();
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public getDanmaku(id: number, _options?: Configuration): Promise<Array<GetDanmaku200ResponseInner>> {
        const result = this.api.getDanmaku(id, _options);
        return result.toPromise();
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public login(username: string, password: string, _options?: Configuration): Promise<void> {
        const result = this.api.login(username, password, _options);
        return result.toPromise();
    }

    /**
     * Log user out
     */
    public logout(_options?: Configuration): Promise<void> {
        const result = this.api.logout(_options);
        return result.toPromise();
    }

    /**
     * Create new archive request
     * @param url url to archive
     * @param cookie auth cookies etc
     */
    public newArchiveRequest(url: string, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.newArchiveRequest(url, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param id video ID
     * @param cookie auth cookies etc
     */
    public recommendations(id: number, cookie: string, _options?: Configuration): Promise<Array<Videos200ResponseVideosInner>> {
        const result = this.api.recommendations(id, cookie, _options);
        return result.toPromise();
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public register(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Promise<void> {
        const result = this.api.register(username, password, email, verificationCode, _options);
        return result.toPromise();
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     */
    public resetPassword(oldpassword: string, newpassword: string, _options?: Configuration): Promise<void> {
        const result = this.api.resetPassword(oldpassword, newpassword, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public retryArchiveRequest(downloadID: number, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.retryArchiveRequest(downloadID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public updateProfile(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Promise<void> {
        const result = this.api.updateProfile(username, gender, birthdate, bio, _options);
        return result.toPromise();
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param category category
     * @param filename 
     */
    public upload(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Promise<void> {
        const result = this.api.upload(tags, title, description, category, filename, _options);
        return result.toPromise();
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvote(id: number, score: number, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.upvote(id, score, cookie, _options);
        return result.toPromise();
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvoteVideo(id: number, score: number, cookie: string, _options?: Configuration): Promise<void> {
        const result = this.api.upvoteVideo(id, score, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get user video data
     * @param id user ID
     */
    public users(id: number, _options?: Configuration): Promise<Users200Response> {
        const result = this.api.users(id, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetail(id: number, _options?: Configuration): Promise<VideoDetail200Response> {
        const result = this.api.videoDetail(id, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param search search string
     * @param sortCategory sort category
     * @param order sort category
     * @param unapproved sort category
     * @param pageNumber page number
     * @param category category
     */
    public videos(search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Promise<Videos200Response> {
        const result = this.api.videos(search, sortCategory, order, unapproved, pageNumber, category, _options);
        return result.toPromise();
    }


}



