/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details for an record.
 * :param str mirror_message: message to be returned in a response if sent in a request
 */
export type RecordDetails = {
    record_id: string;
    record_details: string;
    plot_json_objects: Array<Record<string, any>>;
    mirror_message: string;
    mirror_n_rows: number;
};

