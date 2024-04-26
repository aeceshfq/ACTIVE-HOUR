var shopifyAPI = require("shopify-node-api");

class ShopifyApi {

    Shopify = null;
    url = null;
    shopify_api_base_url = `/admin/api/${process.env.SHOPIFY_API_VERSION}/`;

    constructor() {
        this.Shopify = new shopifyAPI({
            shop: `${process.env.SHOPIFY_SHOP}.myshopify.com`,
            access_token: process.env.SHOPIFY_ACCESS_TOKEN,
            shopify_api_key: process.env.SHOPIFY_API_KEY,
            verbose: false
        });
    }

    async get(url, query_params) {
        return new Promise((resolve, reject) => {
            this.Shopify.get(url, query_params, function (error, data, headers) {
                resolve({error, data, headers});
            });
        });
    }

    async simple_get(url, query_params) {
        return new Promise((resolve, reject) => {
            this.Shopify.get(`${this.shopify_api_base_url}${url}`, query_params, function (error, data, headers) {
                resolve({error, data, headers});
            });
        });
    }

    async post(url, post_data) {
        return new Promise((resolve, reject) => {
            this.Shopify.post(`${this.shopify_api_base_url}${url}`, post_data, function (error, data, headers) {
                if (error) {
                    resolve({ error, headers });
                }
                resolve(data);
            });
        });
    }

    async put(url, put_data) {
        return new Promise((resolve, reject) => {
            this.Shopify.put(`${this.shopify_api_base_url}${url}`, put_data, function (error, data, headers) {
                if (error) {
                    resolve({ error, headers });
                }
                resolve(data);
            });
        });
    }

    async delete(url) {
        return new Promise((resolve, reject) => {
            this.Shopify.delete(`${this.shopify_api_base_url}${url}`, function (error, data, headers) {
                if (error) {
                    resolve({ error, headers });
                }
                resolve(data);
            });
        });
    }

}


module.exports = ShopifyApi;
