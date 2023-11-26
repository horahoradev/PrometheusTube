import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public approveDownloadWithHttpInfo(videoID: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.approveDownload(videoID, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.approveDownloadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public approveDownload(videoID: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.approveDownloadWithHttpInfo(videoID, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param mature auth cookies etc
     * @param cookie auth cookies etc
     */
    public approveVideoWithHttpInfo(videoID: number, mature?: boolean, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.approveVideo(videoID, mature, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.approveVideoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param mature auth cookies etc
     * @param cookie auth cookies etc
     */
    public approveVideo(videoID: number, mature?: boolean, cookie?: string, _options?: Configuration): Observable<void> {
        return this.approveVideoWithHttpInfo(videoID, mature, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get archive events
     * @param downloadID download id to filter on
     */
    public archiveEventsWithHttpInfo(downloadID: string, _options?: Configuration): Observable<HttpInfo<Array<ArchiveEvents200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.archiveEvents(downloadID, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.archiveEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get archive events
     * @param downloadID download id to filter on
     */
    public archiveEvents(downloadID: string, _options?: Configuration): Observable<Array<ArchiveEvents200ResponseInner>> {
        return this.archiveEventsWithHttpInfo(downloadID, _options).pipe(map((apiResponse: HttpInfo<Array<ArchiveEvents200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Get archive requests
     * @param cookie auth cookies etc
     */
    public archiveRequestsWithHttpInfo(cookie?: string, _options?: Configuration): Observable<HttpInfo<Array<ArchiveRequests200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.archiveRequests(cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.archiveRequestsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get archive requests
     * @param cookie auth cookies etc
     */
    public archiveRequests(cookie?: string, _options?: Configuration): Observable<Array<ArchiveRequests200ResponseInner>> {
        return this.archiveRequestsWithHttpInfo(cookie, _options).pipe(map((apiResponse: HttpInfo<Array<ArchiveRequests200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Get archive requests
     * @param pageNumber content page number
     * @param id user id to filter on
     * @param cookie auth cookies etc
     */
    public auditEventsWithHttpInfo(pageNumber: number, id: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<Array<ArchiveRequests200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.auditEvents(pageNumber, id, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.auditEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get archive requests
     * @param pageNumber content page number
     * @param id user id to filter on
     * @param cookie auth cookies etc
     */
    public auditEvents(pageNumber: number, id: number, cookie?: string, _options?: Configuration): Observable<Array<ArchiveRequests200ResponseInner>> {
        return this.auditEventsWithHttpInfo(pageNumber, id, cookie, _options).pipe(map((apiResponse: HttpInfo<Array<ArchiveRequests200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     * @param cookie auth cookies etc
     */
    public commentWithHttpInfo(parent: number, content: string, videoID: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.comment(parent, content, videoID, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.commentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     * @param cookie auth cookies etc
     */
    public comment(parent: number, content: string, videoID: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.commentWithHttpInfo(parent, content, videoID, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public commentsWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<Array<Comments200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.comments(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.commentsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public comments(id: number, _options?: Configuration): Observable<Array<Comments200ResponseInner>> {
        return this.commentsWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<Array<Comments200ResponseInner>>) => apiResponse.data));
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
    public createDanmakuWithHttpInfo(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.createDanmaku(videoID, timestamp, message, type, color, fontSize, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createDanmakuWithHttpInfo(rsp)));
            }));
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
    public createDanmaku(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Observable<void> {
        return this.createDanmakuWithHttpInfo(videoID, timestamp, message, type, color, fontSize, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public deleteArchiveRequestWithHttpInfo(downloadID: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteArchiveRequest(downloadID, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteArchiveRequestWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public deleteArchiveRequest(downloadID: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.deleteArchiveRequestWithHttpInfo(downloadID, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Delete a comment
     * @param id comment ID
     * @param cookie auth cookies etc
     */
    public deleteCommentWithHttpInfo(id: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteComment(id, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete a comment
     * @param id comment ID
     * @param cookie auth cookies etc
     */
    public deleteComment(id: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.deleteCommentWithHttpInfo(id, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Create new email validation
     * @param email email
     */
    public emailValidationWithHttpInfo(email: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.emailValidation(email, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.emailValidationWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create new email validation
     * @param email email
     */
    public emailValidation(email: string, _options?: Configuration): Observable<void> {
        return this.emailValidationWithHttpInfo(email, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upvote a video
     * @param id user ID
     */
    public followWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.follow(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.followWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upvote a video
     * @param id user ID
     */
    public follow(id: number, _options?: Configuration): Observable<void> {
        return this.followWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upvote a video
     * @param showMature show mature
     */
    public followFeedWithHttpInfo(showMature: boolean, _options?: Configuration): Observable<HttpInfo<Array<Recommendations200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.followFeed(showMature, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.followFeedWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upvote a video
     * @param showMature show mature
     */
    public followFeed(showMature: boolean, _options?: Configuration): Observable<Array<Recommendations200ResponseInner>> {
        return this.followFeedWithHttpInfo(showMature, _options).pipe(map((apiResponse: HttpInfo<Array<Recommendations200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public getDanmakuWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<Array<GetDanmaku200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.getDanmaku(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getDanmakuWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public getDanmaku(id: number, _options?: Configuration): Observable<Array<GetDanmaku200ResponseInner>> {
        return this.getDanmakuWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<Array<GetDanmaku200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Retry archive request
     * @param cookie auth cookies etc
     */
    public getUnapprovedVideosWithHttpInfo(cookie?: string, _options?: Configuration): Observable<HttpInfo<Array<GetUnapprovedVideos200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.getUnapprovedVideos(cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUnapprovedVideosWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retry archive request
     * @param cookie auth cookies etc
     */
    public getUnapprovedVideos(cookie?: string, _options?: Configuration): Observable<Array<GetUnapprovedVideos200ResponseInner>> {
        return this.getUnapprovedVideosWithHttpInfo(cookie, _options).pipe(map((apiResponse: HttpInfo<Array<GetUnapprovedVideos200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public loginWithHttpInfo(username: string, password: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.login(username, password, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loginWithHttpInfo(rsp)));
            }));
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public login(username: string, password: string, _options?: Configuration): Observable<void> {
        return this.loginWithHttpInfo(username, password, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Log user out
     */
    public logoutWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.logout(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.logoutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Log user out
     */
    public logout(_options?: Configuration): Observable<void> {
        return this.logoutWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Create new archive request
     * @param url url to archive
     * @param cookie auth cookies etc
     */
    public newArchiveRequestWithHttpInfo(url: string, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.newArchiveRequest(url, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.newArchiveRequestWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create new archive request
     * @param url url to archive
     * @param cookie auth cookies etc
     */
    public newArchiveRequest(url: string, cookie?: string, _options?: Configuration): Observable<void> {
        return this.newArchiveRequestWithHttpInfo(url, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get list of videos
     * @param id video ID
     * @param showMature user ID
     * @param cookie auth cookies etc
     */
    public recommendationsWithHttpInfo(id: number, showMature: boolean, cookie?: string, _options?: Configuration): Observable<HttpInfo<Array<Recommendations200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.recommendations(id, showMature, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.recommendationsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get list of videos
     * @param id video ID
     * @param showMature user ID
     * @param cookie auth cookies etc
     */
    public recommendations(id: number, showMature: boolean, cookie?: string, _options?: Configuration): Observable<Array<Recommendations200ResponseInner>> {
        return this.recommendationsWithHttpInfo(id, showMature, cookie, _options).pipe(map((apiResponse: HttpInfo<Array<Recommendations200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public registerWithHttpInfo(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.register(username, password, email, verificationCode, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.registerWithHttpInfo(rsp)));
            }));
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public register(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Observable<void> {
        return this.registerWithHttpInfo(username, password, email, verificationCode, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     * @param cookie auth cookies etc
     */
    public resetPasswordWithHttpInfo(oldpassword: string, newpassword: string, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.resetPassword(oldpassword, newpassword, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.resetPasswordWithHttpInfo(rsp)));
            }));
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     * @param cookie auth cookies etc
     */
    public resetPassword(oldpassword: string, newpassword: string, cookie?: string, _options?: Configuration): Observable<void> {
        return this.resetPasswordWithHttpInfo(oldpassword, newpassword, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public retryArchiveRequestWithHttpInfo(downloadID: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.retryArchiveRequest(downloadID, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.retryArchiveRequestWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retry archive request
     * @param downloadID download ID of the request to retry
     * @param cookie auth cookies etc
     */
    public retryArchiveRequest(downloadID: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.retryArchiveRequestWithHttpInfo(downloadID, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public unapproveDownloadWithHttpInfo(videoID: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.unapproveDownload(videoID, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.unapproveDownloadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retry archive request
     * @param videoID video ID to download
     * @param cookie auth cookies etc
     */
    public unapproveDownload(videoID: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.unapproveDownloadWithHttpInfo(videoID, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public updateProfileWithHttpInfo(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.updateProfile(username, gender, birthdate, bio, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateProfileWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public updateProfile(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Observable<void> {
        return this.updateProfileWithHttpInfo(username, gender, birthdate, bio, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param category category
     * @param filename 
     */
    public uploadWithHttpInfo(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.upload(tags, title, description, category, filename, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.uploadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param category category
     * @param filename 
     */
    public upload(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Observable<void> {
        return this.uploadWithHttpInfo(tags, title, description, category, filename, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvoteWithHttpInfo(id: number, score: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.upvote(id, score, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.upvoteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvote(id: number, score: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.upvoteWithHttpInfo(id, score, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvoteVideoWithHttpInfo(id: number, score: number, cookie?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.upvoteVideo(id, score, cookie, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.upvoteVideoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     * @param cookie auth cookies etc
     */
    public upvoteVideo(id: number, score: number, cookie?: string, _options?: Configuration): Observable<void> {
        return this.upvoteVideoWithHttpInfo(id, score, cookie, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get user video data
     * @param id user ID
     * @param showMature user ID
     */
    public usersWithHttpInfo(id: number, showMature: boolean, _options?: Configuration): Observable<HttpInfo<Users200Response>> {
        const requestContextPromise = this.requestFactory.users(id, showMature, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.usersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user video data
     * @param id user ID
     * @param showMature user ID
     */
    public users(id: number, showMature: boolean, _options?: Configuration): Observable<Users200Response> {
        return this.usersWithHttpInfo(id, showMature, _options).pipe(map((apiResponse: HttpInfo<Users200Response>) => apiResponse.data));
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetailWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<VideoDetail200Response>> {
        const requestContextPromise = this.requestFactory.videoDetail(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.videoDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetail(id: number, _options?: Configuration): Observable<VideoDetail200Response> {
        return this.videoDetailWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<VideoDetail200Response>) => apiResponse.data));
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
    public videosWithHttpInfo(showMature: boolean, search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Observable<HttpInfo<Videos200Response>> {
        const requestContextPromise = this.requestFactory.videos(showMature, search, sortCategory, order, unapproved, pageNumber, category, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.videosWithHttpInfo(rsp)));
            }));
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
    public videos(showMature: boolean, search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Observable<Videos200Response> {
        return this.videosWithHttpInfo(showMature, search, sortCategory, order, unapproved, pageNumber, category, _options).pipe(map((apiResponse: HttpInfo<Videos200Response>) => apiResponse.data));
    }

}
