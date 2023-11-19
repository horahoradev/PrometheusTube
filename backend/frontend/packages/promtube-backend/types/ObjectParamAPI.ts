import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { ArchiveEvents200ResponseInner } from '../models/ArchiveEvents200ResponseInner';
import { ArchiveRequests200ResponseInner } from '../models/ArchiveRequests200ResponseInner';
import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { GetDanmaku200ResponseInner } from '../models/GetDanmaku200ResponseInner';
import { GetUnapprovedVideos200ResponseInner } from '../models/GetUnapprovedVideos200ResponseInner';
import { Users200Response } from '../models/Users200Response';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponseCategoriesInner } from '../models/Videos200ResponseCategoriesInner';
import { Videos200ResponsePaginationData } from '../models/Videos200ResponsePaginationData';
import { Videos200ResponseVideosInner } from '../models/Videos200ResponseVideosInner';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiApproveDownloadRequest {
    /**
     * video ID to download
     * @type number
     * @memberof DefaultApiapproveDownload
     */
    videoID: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiapproveDownload
     */
    cookie?: string
}

export interface DefaultApiApproveVideoRequest {
    /**
     * video ID to download
     * @type number
     * @memberof DefaultApiapproveVideo
     */
    videoID: number
    /**
     * auth cookies etc
     * @type boolean
     * @memberof DefaultApiapproveVideo
     */
    mature?: boolean
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiapproveVideo
     */
    cookie?: string
}

export interface DefaultApiArchiveEventsRequest {
    /**
     * download id to filter on
     * @type string
     * @memberof DefaultApiarchiveEvents
     */
    downloadID: string
}

export interface DefaultApiArchiveRequestsRequest {
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiarchiveRequests
     */
    cookie?: string
}

export interface DefaultApiAuditEventsRequest {
    /**
     * content page number
     * @type number
     * @memberof DefaultApiauditEvents
     */
    pageNumber: number
    /**
     * user id to filter on
     * @type number
     * @memberof DefaultApiauditEvents
     */
    id: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiauditEvents
     */
    cookie?: string
}

export interface DefaultApiCommentRequest {
    /**
     * parent comment ID
     * @type number
     * @memberof DefaultApicomment
     */
    parent: number
    /**
     * comment message
     * @type string
     * @memberof DefaultApicomment
     */
    content: string
    /**
     * comment\&#39;s video ID
     * @type number
     * @memberof DefaultApicomment
     */
    videoID: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApicomment
     */
    cookie?: string
}

export interface DefaultApiCommentsRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApicomments
     */
    id: number
}

export interface DefaultApiCreateDanmakuRequest {
    /**
     * video ID for danmaku
     * @type number
     * @memberof DefaultApicreateDanmaku
     */
    videoID: number
    /**
     * timestamp for danmaku
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    timestamp: string
    /**
     * message
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    message: string
    /**
     * type of comment
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    type: string
    /**
     * comment color
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    color: string
    /**
     * comment font size
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    fontSize: string
}

export interface DefaultApiDeleteArchiveRequestRequest {
    /**
     * download ID of the request to retry
     * @type number
     * @memberof DefaultApideleteArchiveRequest
     */
    downloadID: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApideleteArchiveRequest
     */
    cookie?: string
}

export interface DefaultApiDeleteCommentRequest {
    /**
     * comment ID
     * @type number
     * @memberof DefaultApideleteComment
     */
    id: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApideleteComment
     */
    cookie?: string
}

export interface DefaultApiEmailValidationRequest {
    /**
     * email
     * @type string
     * @memberof DefaultApiemailValidation
     */
    email: string
}

export interface DefaultApiFollowRequest {
    /**
     * user ID
     * @type number
     * @memberof DefaultApifollow
     */
    id: number
}

export interface DefaultApiFollowFeedRequest {
    /**
     * show mature
     * @type boolean
     * @memberof DefaultApifollowFeed
     */
    showMature: boolean
}

export interface DefaultApiGetDanmakuRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApigetDanmaku
     */
    id: number
}

export interface DefaultApiGetUnapprovedVideosRequest {
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApigetUnapprovedVideos
     */
    cookie?: string
}

export interface DefaultApiLoginRequest {
    /**
     * search string
     * @type string
     * @memberof DefaultApilogin
     */
    username: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApilogin
     */
    password: string
}

export interface DefaultApiLogoutRequest {
}

export interface DefaultApiNewArchiveRequestRequest {
    /**
     * url to archive
     * @type string
     * @memberof DefaultApinewArchiveRequest
     */
    url: string
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApinewArchiveRequest
     */
    cookie?: string
}

export interface DefaultApiRecommendationsRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApirecommendations
     */
    id: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApirecommendations
     */
    cookie?: string
}

export interface DefaultApiRegisterRequest {
    /**
     * username to register
     * @type string
     * @memberof DefaultApiregister
     */
    username: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApiregister
     */
    password: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApiregister
     */
    email: string
    /**
     * verification code
     * @type number
     * @memberof DefaultApiregister
     */
    verificationCode: number
}

export interface DefaultApiResetPasswordRequest {
    /**
     * old password
     * @type string
     * @memberof DefaultApiresetPassword
     */
    oldpassword: string
    /**
     * new password
     * @type string
     * @memberof DefaultApiresetPassword
     */
    newpassword: string
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiresetPassword
     */
    cookie?: string
}

export interface DefaultApiRetryArchiveRequestRequest {
    /**
     * download ID of the request to retry
     * @type number
     * @memberof DefaultApiretryArchiveRequest
     */
    downloadID: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiretryArchiveRequest
     */
    cookie?: string
}

export interface DefaultApiUnapproveDownloadRequest {
    /**
     * video ID to download
     * @type number
     * @memberof DefaultApiunapproveDownload
     */
    videoID: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiunapproveDownload
     */
    cookie?: string
}

export interface DefaultApiUpdateProfileRequest {
    /**
     * new username
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    username: string
    /**
     * new gender
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    gender: string
    /**
     * new birthdate
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    birthdate: string
    /**
     * new bio
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    bio: string
}

export interface DefaultApiUploadRequest {
    /**
     * list of video tags
     * @type Array&lt;string&gt;
     * @memberof DefaultApiupload
     */
    tags: Array<string>
    /**
     * video title
     * @type string
     * @memberof DefaultApiupload
     */
    title: string
    /**
     * video description
     * @type string
     * @memberof DefaultApiupload
     */
    description: string
    /**
     * category
     * @type string
     * @memberof DefaultApiupload
     */
    category: string
    /**
     * 
     * @type Array&lt;HttpFile&gt;
     * @memberof DefaultApiupload
     */
    filename?: Array<HttpFile>
}

export interface DefaultApiUpvoteRequest {
    /**
     * comment ID
     * @type number
     * @memberof DefaultApiupvote
     */
    id: number
    /**
     * upvote score
     * @type number
     * @memberof DefaultApiupvote
     */
    score: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiupvote
     */
    cookie?: string
}

export interface DefaultApiUpvoteVideoRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApiupvoteVideo
     */
    id: number
    /**
     * upvote score
     * @type number
     * @memberof DefaultApiupvoteVideo
     */
    score: number
    /**
     * auth cookies etc
     * @type string
     * @memberof DefaultApiupvoteVideo
     */
    cookie?: string
}

export interface DefaultApiUsersRequest {
    /**
     * user ID
     * @type number
     * @memberof DefaultApiusers
     */
    id: number
}

export interface DefaultApiVideoDetailRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApivideoDetail
     */
    id: number
}

export interface DefaultApiVideosRequest {
    /**
     * show mature
     * @type boolean
     * @memberof DefaultApivideos
     */
    showMature: boolean
    /**
     * search string
     * @type string
     * @memberof DefaultApivideos
     */
    search?: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApivideos
     */
    sortCategory?: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApivideos
     */
    order?: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApivideos
     */
    unapproved?: string
    /**
     * page number
     * @type number
     * @memberof DefaultApivideos
     */
    pageNumber?: number
    /**
     * category
     * @type string
     * @memberof DefaultApivideos
     */
    category?: string
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Retry archive request
     * @param param the request object
     */
    public approveDownload(param: DefaultApiApproveDownloadRequest, options?: Configuration): Promise<void> {
        return this.api.approveDownload(param.videoID, param.cookie,  options).toPromise();
    }

    /**
     * Retry archive request
     * @param param the request object
     */
    public approveVideo(param: DefaultApiApproveVideoRequest, options?: Configuration): Promise<void> {
        return this.api.approveVideo(param.videoID, param.mature, param.cookie,  options).toPromise();
    }

    /**
     * Get archive events
     * @param param the request object
     */
    public archiveEvents(param: DefaultApiArchiveEventsRequest, options?: Configuration): Promise<Array<ArchiveEvents200ResponseInner>> {
        return this.api.archiveEvents(param.downloadID,  options).toPromise();
    }

    /**
     * Get archive requests
     * @param param the request object
     */
    public archiveRequests(param: DefaultApiArchiveRequestsRequest = {}, options?: Configuration): Promise<Array<ArchiveRequests200ResponseInner>> {
        return this.api.archiveRequests(param.cookie,  options).toPromise();
    }

    /**
     * Get archive requests
     * @param param the request object
     */
    public auditEvents(param: DefaultApiAuditEventsRequest, options?: Configuration): Promise<Array<ArchiveRequests200ResponseInner>> {
        return this.api.auditEvents(param.pageNumber, param.id, param.cookie,  options).toPromise();
    }

    /**
     * Comment on a video
     * @param param the request object
     */
    public comment(param: DefaultApiCommentRequest, options?: Configuration): Promise<void> {
        return this.api.comment(param.parent, param.content, param.videoID, param.cookie,  options).toPromise();
    }

    /**
     * Get comments for video ID
     * @param param the request object
     */
    public comments(param: DefaultApiCommentsRequest, options?: Configuration): Promise<Array<Comments200ResponseInner>> {
        return this.api.comments(param.id,  options).toPromise();
    }

    /**
     * Create new danmaku
     * @param param the request object
     */
    public createDanmaku(param: DefaultApiCreateDanmakuRequest, options?: Configuration): Promise<void> {
        return this.api.createDanmaku(param.videoID, param.timestamp, param.message, param.type, param.color, param.fontSize,  options).toPromise();
    }

    /**
     * Retry archive request
     * @param param the request object
     */
    public deleteArchiveRequest(param: DefaultApiDeleteArchiveRequestRequest, options?: Configuration): Promise<void> {
        return this.api.deleteArchiveRequest(param.downloadID, param.cookie,  options).toPromise();
    }

    /**
     * Delete a comment
     * @param param the request object
     */
    public deleteComment(param: DefaultApiDeleteCommentRequest, options?: Configuration): Promise<void> {
        return this.api.deleteComment(param.id, param.cookie,  options).toPromise();
    }

    /**
     * Create new email validation
     * @param param the request object
     */
    public emailValidation(param: DefaultApiEmailValidationRequest, options?: Configuration): Promise<void> {
        return this.api.emailValidation(param.email,  options).toPromise();
    }

    /**
     * Upvote a video
     * @param param the request object
     */
    public follow(param: DefaultApiFollowRequest, options?: Configuration): Promise<void> {
        return this.api.follow(param.id,  options).toPromise();
    }

    /**
     * Upvote a video
     * @param param the request object
     */
    public followFeed(param: DefaultApiFollowFeedRequest, options?: Configuration): Promise<Array<Videos200ResponseVideosInner>> {
        return this.api.followFeed(param.showMature,  options).toPromise();
    }

    /**
     * Get danmaku for video
     * @param param the request object
     */
    public getDanmaku(param: DefaultApiGetDanmakuRequest, options?: Configuration): Promise<Array<GetDanmaku200ResponseInner>> {
        return this.api.getDanmaku(param.id,  options).toPromise();
    }

    /**
     * Retry archive request
     * @param param the request object
     */
    public getUnapprovedVideos(param: DefaultApiGetUnapprovedVideosRequest = {}, options?: Configuration): Promise<Array<GetUnapprovedVideos200ResponseInner>> {
        return this.api.getUnapprovedVideos(param.cookie,  options).toPromise();
    }

    /**
     * Log the user in
     * @param param the request object
     */
    public login(param: DefaultApiLoginRequest, options?: Configuration): Promise<void> {
        return this.api.login(param.username, param.password,  options).toPromise();
    }

    /**
     * Log user out
     * @param param the request object
     */
    public logout(param: DefaultApiLogoutRequest = {}, options?: Configuration): Promise<void> {
        return this.api.logout( options).toPromise();
    }

    /**
     * Create new archive request
     * @param param the request object
     */
    public newArchiveRequest(param: DefaultApiNewArchiveRequestRequest, options?: Configuration): Promise<void> {
        return this.api.newArchiveRequest(param.url, param.cookie,  options).toPromise();
    }

    /**
     * Get list of videos
     * @param param the request object
     */
    public recommendations(param: DefaultApiRecommendationsRequest, options?: Configuration): Promise<Array<Videos200ResponseVideosInner>> {
        return this.api.recommendations(param.id, param.cookie,  options).toPromise();
    }

    /**
     * Register user
     * @param param the request object
     */
    public register(param: DefaultApiRegisterRequest, options?: Configuration): Promise<void> {
        return this.api.register(param.username, param.password, param.email, param.verificationCode,  options).toPromise();
    }

    /**
     * Reset password
     * @param param the request object
     */
    public resetPassword(param: DefaultApiResetPasswordRequest, options?: Configuration): Promise<void> {
        return this.api.resetPassword(param.oldpassword, param.newpassword, param.cookie,  options).toPromise();
    }

    /**
     * Retry archive request
     * @param param the request object
     */
    public retryArchiveRequest(param: DefaultApiRetryArchiveRequestRequest, options?: Configuration): Promise<void> {
        return this.api.retryArchiveRequest(param.downloadID, param.cookie,  options).toPromise();
    }

    /**
     * Retry archive request
     * @param param the request object
     */
    public unapproveDownload(param: DefaultApiUnapproveDownloadRequest, options?: Configuration): Promise<void> {
        return this.api.unapproveDownload(param.videoID, param.cookie,  options).toPromise();
    }

    /**
     * Update user\'s profile
     * @param param the request object
     */
    public updateProfile(param: DefaultApiUpdateProfileRequest, options?: Configuration): Promise<void> {
        return this.api.updateProfile(param.username, param.gender, param.birthdate, param.bio,  options).toPromise();
    }

    /**
     * Upload a new video
     * @param param the request object
     */
    public upload(param: DefaultApiUploadRequest, options?: Configuration): Promise<void> {
        return this.api.upload(param.tags, param.title, param.description, param.category, param.filename,  options).toPromise();
    }

    /**
     * Get user video data
     * @param param the request object
     */
    public upvote(param: DefaultApiUpvoteRequest, options?: Configuration): Promise<void> {
        return this.api.upvote(param.id, param.score, param.cookie,  options).toPromise();
    }

    /**
     * Upvote a video
     * @param param the request object
     */
    public upvoteVideo(param: DefaultApiUpvoteVideoRequest, options?: Configuration): Promise<void> {
        return this.api.upvoteVideo(param.id, param.score, param.cookie,  options).toPromise();
    }

    /**
     * Get user video data
     * @param param the request object
     */
    public users(param: DefaultApiUsersRequest, options?: Configuration): Promise<Users200Response> {
        return this.api.users(param.id,  options).toPromise();
    }

    /**
     * Get list of videos
     * @param param the request object
     */
    public videoDetail(param: DefaultApiVideoDetailRequest, options?: Configuration): Promise<VideoDetail200Response> {
        return this.api.videoDetail(param.id,  options).toPromise();
    }

    /**
     * Get list of videos
     * @param param the request object
     */
    public videos(param: DefaultApiVideosRequest, options?: Configuration): Promise<Videos200Response> {
        return this.api.videos(param.showMature, param.search, param.sortCategory, param.order, param.unapproved, param.pageNumber, param.category,  options).toPromise();
    }

}
