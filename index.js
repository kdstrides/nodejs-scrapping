const rp = require('request-promise');
const $ = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Promise = require("bluebird");

const csvWriter = createCsvWriter({
  path: 'emails.csv',
  header: [
    {id: 'url', title: 'URL'},
    {id: 'emails', title: 'E-mail'},
  ]
});

const urls = [
  'http://www.marukyu-net.jp/corporate02.html',
];

Promise.each(urls, async (url) => {
  console.log('=====================url=====================')
  console.log(url)
  console.log('=====================url=====================')
  try {
    await rp(url).then(async (html) => {
      const htmls = $(html).text();

      const foundMails = htmls.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi);

      const email = [...new Set(foundMails)];
    
      const csvData = [];
    
      email.forEach(em => {
        csvData.push({
          url,
          emails: em.trim(),
        });
      });

      await csvWriter.writeRecords(csvData)
    })
  } catch (error) {
    console.log('----error---');
    console.log(error)
  }
});
