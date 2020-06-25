const rp = require('request-promise');
const $ = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Promise = require("bluebird");

const csvWriter = createCsvWriter({
  path: 'instagram.csv',
  header: [
    { id: 'url', title: 'URL' },
    { id: 'instagram', title: 'Profile' },
  ]
});

const urls = [
  'https://buttersand.com/',
  'http://www.time-land.jp/',
  'https://www.sony.jp/bravia/?s_tc=jp_adv_ad_bravia025_D_01-02-01_se_pc_tx_01243&utm_source=ad&utm_medium=adv&utm_campaign=smoj-brand_google_bravia025_D_01-02-01_se_pc_tx_tv&gclid=EAIaIQobChMI86y68KCQ6QIVy2kqCh1FXgzYEAAYASAAEgJhFfD_BwE',
  'https://unnumber.jp/',
  'https://www.aqua-bank.co.jp/product-category/kencos/',
  'https://andandand.jp/',
];

Promise.each(urls, async (url) => {
  console.log('=====================url=====================')
  console.log(url)
  console.log('=====================url=====================')
  try {
    await rp(url).then(async (html) => {
      const links = $(html).find('a');
      const instagramLinks = [];

      links.each((index, value) => {
        const link = $(value).attr('href');

        if (link.indexOf('instagram') > -1)
          instagramLinks.push(link);
      });

      const finalLinks = [...new Set(instagramLinks)];

      const csvData = [];

      finalLinks.forEach(ig => {
        csvData.push({
          url,
          instagram: ig.trim(),
        });
      });

      await csvWriter.writeRecords(csvData)
    })
  } catch (error) {
    console.log('----error---');
    console.log(error)
  }
});
