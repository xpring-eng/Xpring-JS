# PayId.DefaultApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPath**](DefaultApi.md#getPath) | **GET** /{path} | 


<a name="getPath"></a>
# **getPath**
> getPath(path)



### Example
```javascript
var PayId = require('pay_id');

var apiInstance = new PayId.DefaultApi();

var path = "path_example"; // String | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getPath(path, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **path** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

