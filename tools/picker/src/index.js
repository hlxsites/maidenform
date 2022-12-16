import React from 'react';
import * as ReactDOM from 'react-dom';

import Picker from './picker.js';
import getCategory from './queries/category.graphql.js';
import getCategoriesInCategory from './queries/categories.graphql.js';
import getProductsInCategory from './queries/products.graphql.js';

import './styles.css';

// TODO: Replace with endpoint via CF Worker to avoid CORS issues
const endpoint = 'https://graph.adobe.io/api/86e3b058-a382-4f9c-b73f-8edf67f98e46/graphql?api_key=67b0c8fbcc8f4eaeb4690cd812ba578a';

/**
 * List of blocks to be available in the picker.
 * 
 * Format: Object with key -> block mapping. Each block is defined by the following properties:
 *   key: Unique key, must be same as the key in the object
 *   name: Displayed name of the block
 *   output: Function that receives the selected product(s) and/or category(ies) and returns the HTML to be copied into the clipboard
 *   selection: Define if single or multi selection: single or multiple
 *   type: Define what can be selected: any, item or folder
 */
const blocks = {
    'identifier': {
        'key': 'identifier',
        'name': 'Identifier only',
        'output': i => i.sku || i.uid,
        'selection': 'single',
        'type': 'any',
    },
    'product-teaser': {
        'key': 'product-teaser',
        'name': 'Product Teaser',
        'output': i => `<table width="100%" style="border: 1px solid black;">
            <tr>
                <th colspan="2" style="border: 1px solid black; background: lightgray;">Product Teaser</th>
            </tr>
            <tr>
                <td style="border: 1px solid black">sku</td>
                <td style="border: 1px solid black">${i.sku}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black">action</td>
                <td style="border: 1px solid black">link</td>
            </tr>
        </table>`,
        'selection': 'single',
        'type': 'item',
    },
    'product-carousel': {
        'key': 'product-carousel',
        'name': 'Product Carousel',
        'output': items => `<table width="100%" style="border: 1px solid black;">
            <tr>
                <th style="border: 1px solid black; background: lightgray;">Product Carousel</th>
            </tr>
            <tr>
                <td style="border: 1px solid black">
                    <ul>
                        ${items.map(i => `<li>${i.sku}</li>`).join('')}
                    </ul>
                </td>
            </tr>
        </table>`,
        'selection': 'multiple',
        'type': 'item',
    }
};

/**
 * Returns the current breadcrumb path based on the key of the current folder.
 * 
 * Format: Array of objects with the following properties:
 *   key: Unique key of the folder
 *   name: Displayed name of the folder
 */
const getPath = async (key) => {
    const rootCategoryKey = 'Mg==';
    const newPath = [{ key: rootCategoryKey, name: 'Root Category' }];
    if (key === rootCategoryKey) {
        return newPath;
    }

    let currentCategory;
    try {
        currentCategory = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: 'getCategory',
                query: getCategory,
                variables: { uid: key },
            })
        }).then(res => res.json());
    } catch (err) {
        console.error('Could not retrieve current category', err);
        return [];
    }

    // Add breadcrumbs
    const category = currentCategory.data?.categories?.items?.[0];
    const breadcrumbs = category?.breadcrumbs || [];
    breadcrumbs.forEach(breadcrumb => {
        newPath.push({ key: breadcrumb.category_uid, name: breadcrumb.category_name });
    });

    // Add current category
    newPath.push({ key: category.uid, name: category.name });

    return newPath;
};

/**
 * Returns all items to be displayed in the current folder.
 * 
 * Format: Object with key -> item mapping. Each item is defined by the following properties:
 *  key: Unique key, must be same as the key in the object
 *  name: Displayed name of the item
 *  isFolder: Define whether the item is a folder or a regular item
 *  childCount: Number of children of the item (only for folders, optional)
 *  thumbnail.url: URL of the thumbnail image (only for items, optional)
 *  thumbnail.label: Label of the thumbnail image (only for items, optional)
 */
const getItems = async (folderKey) => {
    let newItems = {};

    try {
        const categories = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: 'getCategoriesInCategory',
                query: getCategoriesInCategory,
                variables: { uid: folderKey }
            })
        }).then(res => res.json());
        categories?.data?.categories?.items.forEach(category => {
            newItems[category.uid] = {
                ...category,
                isFolder: true,
                key: category.uid,
                childCount: parseInt(category.children_count) + parseInt(category.product_count)
            };
        });
    } catch (err) {
        console.error('Could not retrieve categories', err);
    }

    // Get products
    try {
        const products = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: 'getProductsInCategory',
                query: getProductsInCategory,
                variables: { uid: folderKey }
            })
        }).then(res => res.json());
        products?.data?.products?.items.forEach(product => {
            newItems[product.sku] = { 
                ...product,
                isFolder: false,
                key: product.sku
            };
        })
    } catch (err) {
        console.error('Could not retrieve products', err);
    }

    return newItems;
};

const app = document.getElementById("app");
if (app) {
    ReactDOM.render(<Picker blocks={blocks} getPath={getPath} getItems={getItems} />, app);
}