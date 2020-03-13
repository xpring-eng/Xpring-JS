# PayId.DefaultApi

All URIs are relative to *https://*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getUserAndHost**](DefaultApi.md#getUserAndHost) | **GET** /{userAndHost} | users

<a name="getUserAndHost"></a>
# **getUserAndHost**
> InlineResponse200 getUserAndHost(userAndHost)

users

### Example
```javascript
import PayId from 'pay_id';

let apiInstance = new PayId.DefaultApi();
let userAndHost = "userAndHost_example"; // String | 

apiInstance.getUserAndHost(userAndHost, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userAndHost** | **String**|  | 

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

