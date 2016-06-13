declare module 'desqui' {
    interface StringPair {
        [key: string]: string
    }

    export interface UrlsOptions {
        urlLinks: string;
        linksSelector: string;
        headers?: StringPair;
        logMode?: boolean;
        baseUrl: string;
    }


    export interface _DocumentOptions{
        documentTitle: string;
        headers?: StringPair;
        logMode?: boolean;
        itemTemplate: string;
        documentFrontTemplate?: string;
        documentTemplate?: string;
    }

    export interface A extends _DocumentOptions {
        urls: string[];
    }

    export interface B extends _DocumentOptions {
        urlLinks: string;
        linksSelector: string;
        baseUrl: string;
    }

    type DocumentOptions = A | B;


    export default class Desqui {
        static createDocument(options : DocumentOptions) : Promise<string>;
        static getUrls(options: UrlsOptions) : Promise<string[]>;
    }
}