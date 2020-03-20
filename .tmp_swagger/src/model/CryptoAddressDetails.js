/**
 * PayID
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
* The CryptoAddressDetails model module.
* @module model/CryptoAddressDetails
* @version 0.0.1
*/
export default class CryptoAddressDetails {
    /**
    * Constructs a new <code>CryptoAddressDetails</code>.
    * @alias module:model/CryptoAddressDetails
    * @class
    * @param address {String} 
    */

    constructor(address) {
        
        
        this['address'] = address;
        
    }

    /**
    * Constructs a <code>CryptoAddressDetails</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/CryptoAddressDetails} obj Optional instance to populate.
    * @return {module:model/CryptoAddressDetails} The populated <code>CryptoAddressDetails</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new CryptoAddressDetails();
                        
            
            if (data.hasOwnProperty('address')) {
                obj['address'] = ApiClient.convertToType(data['address'], 'String');
            }
            if (data.hasOwnProperty('tag')) {
                obj['tag'] = ApiClient.convertToType(data['tag'], 'String');
            }
        }
        return obj;
    }

    /**
    * @member {String} address
    */
    address = undefined;
    /**
    * @member {String} tag
    */
    tag = undefined;




}
