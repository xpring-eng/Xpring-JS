# PayId.DefaultApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**resolvePayID**](DefaultApi.md#resolvePayID) | **GET** /{path} | get-pay-id

<a name="resolvePayID"></a>
# **resolvePayID**
> Mapping resolvePayID(path)

get-pay-id

Resolve a pay id

### Example
```javascript
import PayId from 'pay_id';

let apiInstance = new PayId.DefaultApi();
let path = "path_example"; // String | 

apiInstance.resolvePayID(path, (error, data, response) => {
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

