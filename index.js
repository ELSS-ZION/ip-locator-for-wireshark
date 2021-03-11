#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const convert = require('xml-js');

var info = {}
var promise_list = []

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    var arr = JSON.parse(data)
    arr.forEach(element => {
        var dst_ip = element["_source"]["layers"]["ip"]["ip.dst"]
        if (info[dst_ip] == undefined) {
            info[dst_ip] = {}
            var pm = axios.get('http://ip.aa2.cn/ip/' + dst_ip)
            promise_list.push(pm)
        }
    });

    // console.log("promise_list.length: " + promise_list.length);

    Promise.all(promise_list).then(axios.spread((...responses) => {
        responses.forEach(resp => {
            var dst_ip = resp.config.url.match(/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g)
            const $ = cheerio.load(resp.data)
            var location = $('table.space-bot tr:eq(3)').children("td:eq(1)").html()
            var company = $('table.space-bot tr:eq(4)').children("td:eq(1)").html()
            var urlTable = $('table.space-bot:eq(1)').html()
            var urltableObj = convert.xml2js(urlTable, { compact: true })
            var trArray = urltableObj.tbody.tr
            var domains = []

            info[dst_ip].location = location
            info[dst_ip].company = company

            if (trArray.length != undefined) {
                trArray.forEach((tr, i) => {
                    if (i == 0) {
                        return
                    }
                    domains.push(tr.td[0].a._text)
                });
                info[dst_ip].domains = domains
            }
        })
        var infoStr = JSON.stringify(info, null, '\t')
        console.log(infoStr)
        fs.writeFile('./info.json', infoStr, function(err) {
            if (err) {
                console.log(err)
            }
        })
    })).catch(error => console.log('caught', error))
});

function Test() {
    var pm = axios.get('http://ip.aa2.cn/ip/220.181.38.150')
        .then(function(response) {
            const $ = cheerio.load(response.data)
            var location = $('table.space-bot tr:eq(3)').children("td:eq(1)").html()
            var company = $('table.space-bot tr:eq(4)').children("td:eq(1)").html()
            var dst_ip = response.config.url.match(/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g)
            console.log("location: " + location)
            console.log("company: " + company)
            var urlTable = $('table.space-bot:eq(1)').html()
            var urltableObj = convert.xml2js(urlTable, { compact: true })
            var trArray = urltableObj.tbody.tr
            var urls = []

            trArray.forEach((tr, i) => {
                if (i == 0) {
                    return
                }
                urls.push(tr.td[0].a._text)
            });
        }).catch(error => console.log('caught', error))
}