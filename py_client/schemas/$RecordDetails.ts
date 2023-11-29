/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RecordDetails = {
    description: `Details for an record.
    :param str mirror_message: message to be returned in a response if sent in a request`,
    properties: {
        record_id: {
            type: 'string',
            isRequired: true,
        },
        record_details: {
            type: 'string',
            isRequired: true,
        },
        plot_json_objects: {
            type: 'array',
            contains: {
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            },
            isRequired: true,
        },
        mirror_message: {
            type: 'string',
            isRequired: true,
        },
        mirror_n_rows: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
