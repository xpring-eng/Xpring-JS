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
import Value from './Value';

/**
* The Originator model module.
* @module model/Originator
* @version 0.0.1
*/
export default class Originator {
    /**
    * Constructs a new <code>Originator</code>.
    * @alias module:model/Originator
    * @class
    * @param userLegalName {String} 
    * @param accountId {String} 
    * @param userPhysicalAddress {String} 
    * @param institutionName {String} 
    * @param value {module:model/Value} 
    * @param timestamp {String} 
    */

    constructor(userLegalName, accountId, userPhysicalAddress, institutionName, value, timestamp) {
        
        
        this['userLegalName'] = userLegalName;
        this['accountId'] = accountId;
        this['userPhysicalAddress'] = userPhysicalAddress;
        this['institutionName'] = institutionName;
        this['value'] = value;
        this['timestamp'] = timestamp;
        
    }

    /**
    * Constructs a <code>Originator</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/Originator} obj Optional instance to populate.
    * @return {module:model/Originator} The populated <code>Originator</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Originator();
                        
            
            if (data.hasOwnProperty('userLegalName')) {
                obj['userLegalName'] = ApiClient.convertToType(data['userLegalName'], 'String');
            }
            if (data.hasOwnProperty('accountId')) {
                obj['accountId'] = ApiClient.convertToType(data['accountId'], 'String');
            }
            if (data.hasOwnProperty('userPhysicalAddress')) {
                obj['userPhysicalAddress'] = ApiClient.convertToType(data['userPhysicalAddress'], 'String');
            }
            if (data.hasOwnProperty('institutionName')) {
                obj['institutionName'] = ApiClient.convertToType(data['institutionName'], 'String');
            }
            if (data.hasOwnProperty('value')) {
                obj['value'] = Value.constructFromObject(data['value']);
            }
            if (data.hasOwnProperty('timestamp')) {
                obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'String');
            }
        }
        return obj;
    }

    /**
    * @member {String} userLegalName
    */
    userLegalName = undefined;
    /**
    * @member {String} accountId
    */
    accountId = undefined;
    /**
    * @member {String} userPhysicalAddress
    */
    userPhysicalAddress = undefined;
    /**
    * @member {String} institutionName
    */
    institutionName = undefined;
    /**
    * @member {module:model/Value} value
    */
    value = undefined;
    /**
    * @member {String} timestamp
    */
    timestamp = undefined;




}
