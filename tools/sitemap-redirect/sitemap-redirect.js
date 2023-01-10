const xml2js = require('xml2js');
const XLSX = require('xlsx');
const fs = require('fs');

const url = 'https://www.maidenform.com/sitemap.xml';

(async () => {
    // Fetch sitemap
    const response = await fetch(url, {
        headers: {
            'user-agent': 'Chrome',
        }
    }).then(response => response.text());

    // Parse sitemap XML
    const parsedXml = await xml2js.parseStringPromise(response);

    // Find product and URLs with .html suffix
    const urlsWithHTML = [];
    const productUrls = [];
    parsedXml.urlset.url.forEach(url => {
        if (url.PageMap) {
            productUrls.push(url.loc);
        } else if (String(url.loc).endsWith('.html')) {
            urlsWithHTML.push(url.loc);
        }
    });

    // Prepare XLSX content
    const data = [
        ['Source', 'Destination'],
    ];

    // Handle urlsWithHTML
    urlsWithHTML.forEach(url => {
        const parsed = new URL(url);
        const urlWithoutHTML = String(parsed.pathname).replace('.html', '');
        data.push([parsed.pathname, urlWithoutHTML]);
    });

    // Handle productUrls
    productUrls.forEach(url => {
        const parsed = new URL(url);
        const urlKey = String(parsed.pathname).replace('.html', '');
        data.push([parsed.pathname, `/products${urlKey}`]);
    });

    // Write XLSX file
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const xlsx = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    await fs.promises.writeFile('redirects.xlsx', xlsx);
})();