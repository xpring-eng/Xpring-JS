# Test.DefaultApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**resolveKeefer**](DefaultApi.md#resolveKeefer) | **GET** /{path} | get-pay-id


<a name="resolveKeefer"></a>
# **resolveKeefer**
> resolveKeefer(path)

get-pay-id

Resolve a pay id

### Example
```javascript
var Test = require('test');

var apiInstance = new Test.DefaultApi();

var path = null; // Object | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.resolveKeefer(path, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **path** | [**Object**](.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

