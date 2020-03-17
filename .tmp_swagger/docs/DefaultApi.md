# Test.DefaultApi

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**resolveKeefer2**](DefaultApi.md#resolveKeefer2) | **GET** /{path} | get-pay-id

<a name="resolveKeefer2"></a>
# **resolveKeefer2**
> Mapping resolveKeefer2(path)

get-pay-id

Resolve a pay id

### Example
```javascript
import Test from 'test';

let apiInstance = new Test.DefaultApi();
let path = "path_example"; // String | 

apiInstance.resolveKeefer2(path, (error, data, response) => {
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
 **path** | **String**|  | 

### Return type

[**Mapping**](Mapping.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

