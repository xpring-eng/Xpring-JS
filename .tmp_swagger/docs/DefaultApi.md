# PayId.DefaultApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPathInvoice**](DefaultApi.md#getPathInvoice) | **GET** /{path}/invoice | get-invoice
[**postPathInvoice**](DefaultApi.md#postPathInvoice) | **POST** /{path}/invoice | post-invoice
[**resolvePayID**](DefaultApi.md#resolvePayID) | **GET** /{path} | get-pay-id

<a name="getPathInvoice"></a>
# **getPathInvoice**
> SignatureWrapperInvoice getPathInvoice(path, nonce)

get-invoice

### Example
```javascript
import PayId from 'pay_id';

let apiInstance = new PayId.DefaultApi();
let path = "path_example"; // String | 
let nonce = "nonce_example"; // String | 

apiInstance.getPathInvoice(path, nonce, (error, data, response) => {
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
 **nonce** | **String**|  | 

### Return type

[**SignatureWrapperInvoice**](SignatureWrapperInvoice.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/xrpl-devnet+json, application/xrpl-mainnet+json, application/xrpl-testnet+json

<a name="postPathInvoice"></a>
# **postPathInvoice**
> SignatureWrapperCompliance postPathInvoice(path)

post-invoice

### Example
```javascript
import PayId from 'pay_id';

let apiInstance = new PayId.DefaultApi();
let path = "path_example"; // String | 

apiInstance.postPathInvoice(path, (error, data, response) => {
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
 **body** | [**SignatureWrapperInvoice**](SignatureWrapperInvoice.md)|  | [optional] 

### Return type

[**SignatureWrapperCompliance**](SignatureWrapperCompliance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/xrpl-mainnet+json, application/xrpl-testnet+json

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

