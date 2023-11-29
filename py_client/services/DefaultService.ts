/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Hello } from '../models/Hello';
import type { HelloWorld } from '../models/HelloWorld';
import type { RecordDetails } from '../models/RecordDetails';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Hello
     * Retuns a message depending on the route.
     * @returns Hello Successful Response
     * @throws ApiError
     */
    public helloApiPythonHelloMessageGet({
        message,
    }: {
        message: string,
    }): CancelablePromise<Hello> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/python/hello/{message}',
            path: {
                'message': message,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Hello World
     * Retuns a Hello World message
     * @returns HelloWorld Successful Response
     * @throws ApiError
     */
    public helloWorldApiPythonHelloGet(): CancelablePromise<HelloWorld> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/python/hello',
        });
    }

    /**
     * Get Records
     * Get list of record names. These should all be valid inputs to `get_record`.
     * @returns string Successful Response
     * @throws ApiError
     */
    public getRecordsApiPythonGetRecordsGet(): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/python/get_records',
        });
    }

    /**
     * Get Record
     * Get record details and plots
     * @returns RecordDetails Successful Response
     * @throws ApiError
     */
    public getRecordApiPythonGetRecordRecordIdGet({
        recordId,
        nPoints = 100,
        nFigs = 3,
        mirrorMessage = 'default mirror message',
        nRows = 1,
    }: {
        recordId: string,
        nPoints?: number,
        nFigs?: number,
        mirrorMessage?: string,
        nRows?: number,
    }): CancelablePromise<RecordDetails> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/python/get_record/{record_id}',
            path: {
                'record_id': recordId,
            },
            query: {
                'n_points': nPoints,
                'n_figs': nFigs,
                'mirror_message': mirrorMessage,
                'n_rows': nRows,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
