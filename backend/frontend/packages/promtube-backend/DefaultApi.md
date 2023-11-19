# .DefaultApi

All URIs are relative to *http://localhost:3000/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**approveDownload**](DefaultApi.md#approveDownload) | **POST** /approve-download | Retry archive request
[**approveVideo**](DefaultApi.md#approveVideo) | **POST** /approve-video | Retry archive request
[**archiveEvents**](DefaultApi.md#archiveEvents) | **GET** /archive-events | Get archive events
[**archiveRequests**](DefaultApi.md#archiveRequests) | **GET** /archive-requests | Get archive requests
[**auditEvents**](DefaultApi.md#auditEvents) | **GET** /audit-events | Get archive requests
[**comment**](DefaultApi.md#comment) | **POST** /comment | Comment on a video
[**comments**](DefaultApi.md#comments) | **GET** /comments/{id} | Get comments for video ID
[**createDanmaku**](DefaultApi.md#createDanmaku) | **POST** /danmaku | Create new danmaku
[**deleteArchiveRequest**](DefaultApi.md#deleteArchiveRequest) | **POST** /delete-archive-request | Retry archive request
[**deleteComment**](DefaultApi.md#deleteComment) | **POST** /delete_comment | Delete a comment
[**emailValidation**](DefaultApi.md#emailValidation) | **POST** /email-verification | Create new email validation
[**follow**](DefaultApi.md#follow) | **POST** /follow/{id} | Upvote a video
[**followFeed**](DefaultApi.md#followFeed) | **GET** /follow-feed | Upvote a video
[**getDanmaku**](DefaultApi.md#getDanmaku) | **GET** /danmaku/{id} | Get danmaku for video
[**getUnapprovedVideos**](DefaultApi.md#getUnapprovedVideos) | **GET** /get-unapproved-videos | Retry archive request
[**login**](DefaultApi.md#login) | **POST** /login | Log the user in
[**logout**](DefaultApi.md#logout) | **GET** /logout | Log user out
[**newArchiveRequest**](DefaultApi.md#newArchiveRequest) | **POST** /new-archive-request | Create new archive request
[**recommendations**](DefaultApi.md#recommendations) | **GET** /recommendations/{id} | Get list of videos
[**register**](DefaultApi.md#register) | **POST** /register | Register user
[**resetPassword**](DefaultApi.md#resetPassword) | **POST** /reset_password | Reset password
[**retryArchiveRequest**](DefaultApi.md#retryArchiveRequest) | **POST** /retry-archive-request | Retry archive request
[**unapproveDownload**](DefaultApi.md#unapproveDownload) | **POST** /unapprove-download | Retry archive request
[**updateProfile**](DefaultApi.md#updateProfile) | **POST** /update-profile | Update user\&#39;s profile
[**upload**](DefaultApi.md#upload) | **POST** /upload | Upload a new video
[**upvote**](DefaultApi.md#upvote) | **GET** /upvote/{id} | Get user video data
[**upvoteVideo**](DefaultApi.md#upvoteVideo) | **POST** /upvotevideo/{id} | Upvote a video
[**users**](DefaultApi.md#users) | **GET** /users/{id} | Get user video data
[**videoDetail**](DefaultApi.md#videoDetail) | **GET** /videos/{id} | Get list of videos
[**videos**](DefaultApi.md#videos) | **GET** /videos | Get list of videos


# **approveDownload**
> void approveDownload()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiApproveDownloadRequest = {
  // number | video ID to download
  videoID: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.approveDownload(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoID** | [**number**] | video ID to download | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | delete success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **approveVideo**
> void approveVideo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiApproveVideoRequest = {
  // number | video ID to download
  videoID: 1,
  // boolean | auth cookies etc (optional)
  mature: true,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.approveVideo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoID** | [**number**] | video ID to download | defaults to undefined
 **mature** | [**boolean**] | auth cookies etc | (optional) defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | approve success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **archiveEvents**
> Array<ArchiveEvents200ResponseInner> archiveEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiArchiveEventsRequest = {
  // string | download id to filter on
  downloadID: "downloadID_example",
};

apiInstance.archiveEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **downloadID** | [**string**] | download id to filter on | defaults to undefined


### Return type

**Array<ArchiveEvents200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of follow feed videos |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **archiveRequests**
> Array<ArchiveRequests200ResponseInner> archiveRequests()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiArchiveRequestsRequest = {
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.archiveRequests(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**Array<ArchiveRequests200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of archive requests |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **auditEvents**
> Array<ArchiveRequests200ResponseInner> auditEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiAuditEventsRequest = {
  // number | content page number
  pageNumber: 1,
  // number | user id to filter on
  id: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.auditEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageNumber** | [**number**] | content page number | defaults to undefined
 **id** | [**number**] | user id to filter on | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**Array<ArchiveRequests200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of archive requests |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **comment**
> void comment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiCommentRequest = {
  // number | parent comment ID
  parent: 1,
  // string | comment message
  content: 'YQ==',
  // number | comment\'s video ID
  videoID: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.comment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **parent** | [**number**] | parent comment ID | defaults to undefined
 **content** | [**string**] | comment message | defaults to undefined
 **videoID** | [**number**] | comment\&#39;s video ID | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Comment success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **comments**
> Array<Comments200ResponseInner> comments()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiCommentsRequest = {
  // number | video ID
  id: 1,
};

apiInstance.comments(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | video ID | defaults to undefined


### Return type

**Array<Comments200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | get video details for a specific video |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createDanmaku**
> void createDanmaku()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiCreateDanmakuRequest = {
  // number | video ID for danmaku
  videoID: 1,
  // string | timestamp for danmaku
  timestamp: "timestamp_example",
  // string | message
  message: 'YQ==',
  // string | type of comment
  type: "Type_example",
  // string | comment color
  color: "Color_example",
  // string | comment font size
  fontSize: "FontSize_example",
};

apiInstance.createDanmaku(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoID** | [**number**] | video ID for danmaku | defaults to undefined
 **timestamp** | [**string**] | timestamp for danmaku | defaults to undefined
 **message** | [**string**] | message | defaults to undefined
 **type** | [**string**] | type of comment | defaults to undefined
 **color** | [**string**] | comment color | defaults to undefined
 **fontSize** | [**string**] | comment font size | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Danmaku creation success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteArchiveRequest**
> void deleteArchiveRequest()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiDeleteArchiveRequestRequest = {
  // number | download ID of the request to retry
  downloadID: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.deleteArchiveRequest(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **downloadID** | [**number**] | download ID of the request to retry | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | delete success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteComment**
> void deleteComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiDeleteCommentRequest = {
  // number | comment ID
  id: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.deleteComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | comment ID | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Comment deleted |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **emailValidation**
> void emailValidation()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiEmailValidationRequest = {
  // string | email
  email: "email_example",
};

apiInstance.emailValidation(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | [**string**] | email | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Email validation success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **follow**
> void follow()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiFollowRequest = {
  // number | user ID
  id: 1,
};

apiInstance.follow(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | user ID | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Follow success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **followFeed**
> Array<Videos200ResponseVideosInner> followFeed()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiFollowFeedRequest = {
  // boolean | show mature
  showMature: true,
};

apiInstance.followFeed(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **showMature** | [**boolean**] | show mature | defaults to undefined


### Return type

**Array<Videos200ResponseVideosInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of follow feed videos |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDanmaku**
> Array<GetDanmaku200ResponseInner> getDanmaku()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiGetDanmakuRequest = {
  // number | video ID
  id: 1,
};

apiInstance.getDanmaku(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | video ID | defaults to undefined


### Return type

**Array<GetDanmaku200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of danmaku |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getUnapprovedVideos**
> Array<GetUnapprovedVideos200ResponseInner> getUnapprovedVideos()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiGetUnapprovedVideosRequest = {
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.getUnapprovedVideos(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**Array<GetUnapprovedVideos200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of archive requests |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **login**
> void login()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiLoginRequest = {
  // string | search string
  username: "username_example",
  // string | sort category
  password: "password_example",
};

apiInstance.login(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | [**string**] | search string | defaults to undefined
 **password** | [**string**] | sort category | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Login success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **logout**
> void logout()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:any = {};

apiInstance.logout(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Logout successful |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **newArchiveRequest**
> void newArchiveRequest()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiNewArchiveRequestRequest = {
  // string | url to archive
  url: "url_example",
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.newArchiveRequest(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **url** | [**string**] | url to archive | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | archival success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **recommendations**
> Array<Videos200ResponseVideosInner> recommendations()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiRecommendationsRequest = {
  // number | video ID
  id: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.recommendations(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | video ID | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**Array<Videos200ResponseVideosInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of video recommendations |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **register**
> void register()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiRegisterRequest = {
  // string | username to register
  username: "username_example",
  // string | sort category
  password: "password_example",
  // string | sort category
  email: "email_example",
  // number | verification code
  verificationCode: 1,
};

apiInstance.register(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | [**string**] | username to register | defaults to undefined
 **password** | [**string**] | sort category | defaults to undefined
 **email** | [**string**] | sort category | defaults to undefined
 **verificationCode** | [**number**] | verification code | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | registration succeeded |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **resetPassword**
> void resetPassword()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiResetPasswordRequest = {
  // string | old password
  oldpassword: "oldpassword_example",
  // string | new password
  newpassword: "newpassword_example",
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.resetPassword(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **oldpassword** | [**string**] | old password | defaults to undefined
 **newpassword** | [**string**] | new password | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Password changed |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **retryArchiveRequest**
> void retryArchiveRequest()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiRetryArchiveRequestRequest = {
  // number | download ID of the request to retry
  downloadID: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.retryArchiveRequest(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **downloadID** | [**number**] | download ID of the request to retry | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | retry success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **unapproveDownload**
> void unapproveDownload()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUnapproveDownloadRequest = {
  // number | video ID to download
  videoID: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.unapproveDownload(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoID** | [**number**] | video ID to download | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | delete success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateProfile**
> void updateProfile()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUpdateProfileRequest = {
  // string | new username
  username: 'YQ==',
  // string | new gender
  gender: 'YQ==',
  // string | new birthdate
  birthdate: "birthdate_example",
  // string | new bio
  bio: 'YQ==',
};

apiInstance.updateProfile(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | [**string**] | new username | defaults to undefined
 **gender** | [**string**] | new gender | defaults to undefined
 **birthdate** | [**string**] | new birthdate | defaults to undefined
 **bio** | [**string**] | new bio | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Update profile success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **upload**
> void upload()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUploadRequest = {
  // Array<string> | list of video tags
  tags: [
    "tags_example",
  ],
  // string | video title
  title: "title_example",
  // string | video description
  description: "description_example",
  // string | category
  category: "category_example",
  // Array<HttpFile> (optional)
  filename: [
    { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  ],
};

apiInstance.upload(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tags** | **Array&lt;string&gt;** | list of video tags | defaults to undefined
 **title** | [**string**] | video title | defaults to undefined
 **description** | [**string**] | video description | defaults to undefined
 **category** | [**string**] | category | defaults to undefined
 **filename** | **Array&lt;HttpFile&gt;** |  | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Logout successful |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **upvote**
> void upvote()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUpvoteRequest = {
  // number | comment ID
  id: 1,
  // number | upvote score
  score: 3.14,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.upvote(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | comment ID | defaults to undefined
 **score** | [**number**] | upvote score | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Upvote success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **upvoteVideo**
> void upvoteVideo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUpvoteVideoRequest = {
  // number | video ID
  id: 1,
  // number | upvote score
  score: 1,
  // string | auth cookies etc (optional)
  cookie: "Cookie_example",
};

apiInstance.upvoteVideo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | video ID | defaults to undefined
 **score** | [**number**] | upvote score | defaults to undefined
 **cookie** | [**string**] | auth cookies etc | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Upvote success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **users**
> Users200Response users()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUsersRequest = {
  // number | user ID
  id: 1,
};

apiInstance.users(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | user ID | defaults to undefined


### Return type

**Users200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | get video details for a specific video |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **videoDetail**
> VideoDetail200Response videoDetail()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiVideoDetailRequest = {
  // number | video ID
  id: 3.14,
};

apiInstance.videoDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | video ID | defaults to undefined


### Return type

**VideoDetail200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | get video details for a specific video |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **videos**
> Videos200Response videos()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiVideosRequest = {
  // boolean | show mature
  showMature: true,
  // string | search string (optional)
  search: 'YQ==',
  // string | sort category (optional)
  sortCategory: "sortCategory_example",
  // string | sort category (optional)
  order: "order_example",
  // string | sort category (optional)
  unapproved: "unapproved_example",
  // number | page number (optional)
  pageNumber: 1,
  // string | category (optional)
  category: 'YQ==',
};

apiInstance.videos(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **showMature** | [**boolean**] | show mature | defaults to undefined
 **search** | [**string**] | search string | (optional) defaults to undefined
 **sortCategory** | [**string**] | sort category | (optional) defaults to undefined
 **order** | [**string**] | sort category | (optional) defaults to undefined
 **unapproved** | [**string**] | sort category | (optional) defaults to undefined
 **pageNumber** | [**number**] | page number | (optional) defaults to undefined
 **category** | [**string**] | category | (optional) defaults to undefined


### Return type

**Videos200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of videos and pagination data |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


