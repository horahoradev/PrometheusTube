import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { ArchiveEvents200ResponseInner } from '../models/ArchiveEvents200ResponseInner';
import { ArchiveRequests200ResponseInner } from '../models/ArchiveRequests200ResponseInner';
import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { GetDanmaku200ResponseInner } from '../models/GetDanmaku200ResponseInner';
import { GetUnapprovedVideos200ResponseInner } from '../models/GetUnapprovedVideos200ResponseInner';
import { Recommendations200ResponseInner } from '../models/Recommendations200ResponseInner';
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
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public approveDownloadWithHttpInfo(videoID: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.approveDownloadWithHttpInfo(videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public approveDownload(videoID: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.approveDownload(videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param mature auth cookies etc
     * @param cookie auth cookies etc
     */
    public approveVideoWithHttpInfo(videoID: number, mature?: boolean, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.approveVideoWithHttpInfo(videoID, mature, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param mature auth cookies etc
     * @param cookie auth cookies etc
     */
    public approveVideo(videoID: number, mature?: boolean, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.approveVideo(videoID, mature, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get archive events
     * @param downloadID download id to filter on
     */
    public archiveEventsWithHttpInfo(downloadID: string, _options?: Configuration): Promise<HttpInfo<Array<ArchiveEvents200ResponseInner>>> {
        const result = this.api.archiveEventsWithHttpInfo(downloadID, _options);
        return result.toPromise();
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
    public archiveRequestsWithHttpInfo(cookie?: string, _options?: Configuration): Promise<HttpInfo<Array<ArchiveRequests200ResponseInner>>> {
        const result = this.api.archiveRequestsWithHttpInfo(cookie, _options);
        return result.toPromise();
    }

    /**
     * Get archive requests
     * @param cookie auth cookies etc
     */
    public archiveRequests(cookie?: string, _options?: Configuration): Promise<Array<ArchiveRequests200ResponseInner>> {
        const result = this.api.archiveRequests(cookie, _options);
        return result.toPromise();
    }

    /**
     * Get archive requests
     * @param pageNumber content page number
     * @param id user id to filter on
     * @param cookie auth cookies etc
     */
    public auditEventsWithHttpInfo(pageNumber: number, id: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<Array<ArchiveRequests200ResponseInner>>> {
        const result = this.api.auditEventsWithHttpInfo(pageNumber, id, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get archive requests
     * @param pageNumber content page number
     * @param id user id to filter on
     * @param cookie auth cookies etc
     */
    public auditEvents(pageNumber: number, id: number, cookie?: string, _options?: Configuration): Promise<Array<ArchiveRequests200ResponseInner>> {
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
    public commentWithHttpInfo(parent: number, content: string, videoID: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.commentWithHttpInfo(parent, content, videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     * @param cookie auth cookies etc
     */
    public comment(parent: number, content: string, videoID: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.comment(parent, content, videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public commentsWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<Array<Comments200ResponseInner>>> {
        const result = this.api.commentsWithHttpInfo(id, _options);
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
    public createDanmakuWithHttpInfo(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.createDanmakuWithHttpInfo(videoID, timestamp, message, type, color, fontSize, _options);
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
    public deleteArchiveRequestWithHttpInfo(downloadID: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteArchiveRequestWithHttpInfo(downloadID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public deleteArchiveRequest(downloadID: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.deleteArchiveRequest(downloadID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Delete a comment
     * @param id comment ID
     * @param cookie auth cookies etc
     */
    public deleteCommentWithHttpInfo(id: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteCommentWithHttpInfo(id, cookie, _options);
        return result.toPromise();
    }

    /**
     * Delete a comment
     * @param id comment ID
     * @param cookie auth cookies etc
     */
    public deleteComment(id: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.deleteComment(id, cookie, _options);
        return result.toPromise();
    }

    /**
     * Create new email validation
     * @param email email
     */
    public emailValidationWithHttpInfo(email: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.emailValidationWithHttpInfo(email, _options);
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
    public followWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.followWithHttpInfo(id, _options);
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
     * @param showMature show mature
     */
    public followFeedWithHttpInfo(showMature: boolean, _options?: Configuration): Promise<HttpInfo<Array<Recommendations200ResponseInner>>> {
        const result = this.api.followFeedWithHttpInfo(showMature, _options);
        return result.toPromise();
    }

    /**
     * Upvote a video
     * @param showMature show mature
     */
    public followFeed(showMature: boolean, _options?: Configuration): Promise<Array<Recommendations200ResponseInner>> {
        const result = this.api.followFeed(showMature, _options);
        return result.toPromise();
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public getDanmakuWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<Array<GetDanmaku200ResponseInner>>> {
        const result = this.api.getDanmakuWithHttpInfo(id, _options);
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
     * Retry archive request
     * @param cookie auth cookies etc
     */
    public getUnapprovedVideosWithHttpInfo(cookie?: string, _options?: Configuration): Promise<HttpInfo<Array<GetUnapprovedVideos200ResponseInner>>> {
        const result = this.api.getUnapprovedVideosWithHttpInfo(cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param cookie auth cookies etc
     */
    public getUnapprovedVideos(cookie?: string, _options?: Configuration): Promise<Array<GetUnapprovedVideos200ResponseInner>> {
        const result = this.api.getUnapprovedVideos(cookie, _options);
        return result.toPromise();
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public loginWithHttpInfo(username: string, password: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.loginWithHttpInfo(username, password, _options);
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
    public logoutWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.logoutWithHttpInfo(_options);
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
    public newArchiveRequestWithHttpInfo(url: string, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.newArchiveRequestWithHttpInfo(url, cookie, _options);
        return result.toPromise();
    }

    /**
     * Create new archive request
     * @param url url to archive
     * @param cookie auth cookies etc
     */
    public newArchiveRequest(url: string, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.newArchiveRequest(url, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param id video ID
     * @param showMature user ID
     * @param cookie auth cookies etc
     */
    public recommendationsWithHttpInfo(id: number, showMature: boolean, cookie?: string, _options?: Configuration): Promise<HttpInfo<Array<Recommendations200ResponseInner>>> {
        const result = this.api.recommendationsWithHttpInfo(id, showMature, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param id video ID
     * @param showMature user ID
     * @param cookie auth cookies etc
     */
    public recommendations(id: number, showMature: boolean, cookie?: string, _options?: Configuration): Promise<Array<Recommendations200ResponseInner>> {
        const result = this.api.recommendations(id, showMature, cookie, _options);
        return result.toPromise();
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public registerWithHttpInfo(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.registerWithHttpInfo(username, password, email, verificationCode, _options);
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
     * @param cookie auth cookies etc
     */
    public resetPasswordWithHttpInfo(oldpassword: string, newpassword: string, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.resetPasswordWithHttpInfo(oldpassword, newpassword, cookie, _options);
        return result.toPromise();
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     * @param cookie auth cookies etc
     */
    public resetPassword(oldpassword: string, newpassword: string, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.resetPassword(oldpassword, newpassword, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public retryArchiveRequestWithHttpInfo(downloadID: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.retryArchiveRequestWithHttpInfo(downloadID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public retryArchiveRequest(downloadID: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.retryArchiveRequest(downloadID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public unapproveDownloadWithHttpInfo(videoID: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.unapproveDownloadWithHttpInfo(videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public unapproveDownload(videoID: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.unapproveDownload(videoID, cookie, _options);
        return result.toPromise();
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public updateProfileWithHttpInfo(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.updateProfileWithHttpInfo(username, gender, birthdate, bio, _options);
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
    public uploadWithHttpInfo(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.uploadWithHttpInfo(tags, title, description, category, filename, _options);
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
    public upvoteWithHttpInfo(id: number, score: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.upvoteWithHttpInfo(id, score, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvote(id: number, score: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.upvote(id, score, cookie, _options);
        return result.toPromise();
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvoteVideoWithHttpInfo(id: number, score: number, cookie?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.upvoteVideoWithHttpInfo(id, score, cookie, _options);
        return result.toPromise();
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvoteVideo(id: number, score: number, cookie?: string, _options?: Configuration): Promise<void> {
        const result = this.api.upvoteVideo(id, score, cookie, _options);
        return result.toPromise();
    }

    /**
     * Get user video data
     * @param id user ID
     * @param showMature user ID
     */
    public usersWithHttpInfo(id: number, showMature: boolean, _options?: Configuration): Promise<HttpInfo<Users200Response>> {
        const result = this.api.usersWithHttpInfo(id, showMature, _options);
        return result.toPromise();
    }

    /**
     * Get user video data
     * @param id user ID
     * @param showMature user ID
     */
    public users(id: number, showMature: boolean, _options?: Configuration): Promise<Users200Response> {
        const result = this.api.users(id, showMature, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetailWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<VideoDetail200Response>> {
        const result = this.api.videoDetailWithHttpInfo(id, _options);
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
     * @param showMature show mature
     * @param search search string
     * @param sortCategory sort category
     * @param order sort category
     * @param unapproved sort category
     * @param pageNumber page number
     * @param category category
     */
    public videosWithHttpInfo(showMature: boolean, search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Promise<HttpInfo<Videos200Response>> {
        const result = this.api.videosWithHttpInfo(showMature, search, sortCategory, order, unapproved, pageNumber, category, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param showMature show mature
     * @param search search string
     * @param sortCategory sort category
     * @param order sort category
     * @param unapproved sort category
     * @param pageNumber page number
     * @param category category
     */
    public videos(showMature: boolean, search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Promise<Videos200Response> {
        const result = this.api.videos(showMature, search, sortCategory, order, unapproved, pageNumber, category, _options);
        return result.toPromise();
    }


}



