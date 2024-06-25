/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Instant } from './instant';
import { Next12Hours } from './next12Hours';
import { Next1Hours } from './next1Hours';
import { Next6Hours } from './next6Hours';


export interface Data { 
    instant?: Instant;
    next_12_hours?: Next12Hours;
    next_1_hours?: Next1Hours;
    next_6_hours?: Next6Hours;
}
