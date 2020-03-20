# PayId.DefaultApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**postPathReceipt**](DefaultApi.md#postPathReceipt) | **POST** /{path}/receipt | 
[**resolvePayID**](DefaultApi.md#resolvePayID) | **GET** /{path} | get-pay-id

<a name="postPathReceipt"></a>
# **postPathReceipt**
> postPathReceipt(path)



### Example
```javascript
import PayId from 'pay_id';

let apiInstance = new PayId.DefaultApi();
let path = "path_example"; // String | 

apiInstance.postPathReceipt(path, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **path** | **String**|  | 
 **body** | [**Receipt**](Receipt.md)|  | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="resolvePayID"></a>
# **resolvePayID**
> PaymentInformation resolvePayID(path)

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

[**PaymentInformation**](PaymentInformation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/xrpl-devnet+json, application/xrpl-mainnet+json, application/xrpl-testnet+json

