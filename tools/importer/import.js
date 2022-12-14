/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

function getCurrentCategory(document) {
  const css = Array.from(document.querySelector('.breadcrumbs > ul > li:last-child').classList).pop();
  return css.replace('category', '');
}

function transformBreadcrumb(document) {
  document.querySelectorAll('.breadcrumbs').forEach((breadcrumb) => {
    const items = breadcrumb.querySelector('ul');
    const cells = [
      ['Breadcrumb'],
      [items],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    breadcrumb.replaceWith(table);
  });
}

function transformPLP(document) {
  const dom = document.getElementById('amasty-shopby-product-list');

  const cells = [
    ['Product List Page'],
    ['category', getCurrentCategory(document)],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  dom.replaceWith(table);
}

function makeAbsoluteLinks(main) {
  main.querySelectorAll('a').forEach((a) => {
    const ori = a.href;
    let u;
    if (a.href.startsWith('/')) {
      u = new URL(a.href, 'https://main--maidenform--hlxsites.hlx.page/');
    } else {
      u = new URL(a.href);
      u.hostname = 'main--maidenform--hlxsites.hlx.page';
    }

    // Remove .html extension
    if (u.pathname.endsWith('.html')) {
      u.pathname = u.pathname.slice(0, -5);
    }

    a.href = u.toString();

    if (a.textContent === ori) {
      a.textContent = a.href;
    }
  });
}

const makeProxySrcs = (main, host = 'https://www.maidenform.com') => {
  main.querySelectorAll('img').forEach((img) => {
    console.log('img', img.src);
    if (img.src.startsWith('//')) {
      img.src = `http:${img.src}`;
    } else if (img.src.startsWith('/')) {
      // make absolute
      const cu = new URL(host);
      img.src = `${cu.origin}${img.src}`;
    }
    try {
      const u = new URL(img.src);
      u.searchParams.append('host', u.origin);
      img.src = `http://localhost:3001${u.pathname}${u.search}`;
      console.log('u', img.src);
    } catch (error) {
      console.warn(`Unable to make proxy src for ${img.src}: ${error.message}`);
    }
  });
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(document.body, [
      'header',
      'footer',
      '#onetrust-banner-sdk',
      '#onetrust-consent-sdk',
      'iframe',
      '#cookie-status',
      'div.block-static-block',
      '.ambanners',
      '.mobile-filter-sort',
      '.mobile-sortby-sidebar',
      '.sorter',
      '.catalog-topnav',
      '#authenticationPopup',
      '.slick-list',
      '.sidebar-main',
      '.copyright',
      '#rfk_search_container',
      'body > div[id^="batBeacon"]',
      'body > img',
    ]);

    const meta = {
      template: 'plp',
    };

    const title = document.querySelector('title');
    if (title) {
      meta.Title = title.innerHTML.replace(/[\n\t]/gm, '').split('|')[0].trim();
    }

    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      meta.Description = desc.content;
    }

    document.body.append(WebImporter.Blocks.getMetadataBlock(document, meta));

    [
      transformPLP,
      transformBreadcrumb,

      makeProxySrcs,
      makeAbsoluteLinks,
    ].forEach((f) => f.call(null, document));

    return document.body;
  },

  // TODO: Transform breadcrumb
  // TODO: Transform PLP
  // TODO: Add metadata block for plp template

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''),
};