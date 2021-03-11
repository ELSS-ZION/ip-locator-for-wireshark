## 简介

Wireshark 辅助工具

通过爬取 http://ip.aa2.cn/ 实现批量 ip 反查域名

## 使用

+ 安装

```sh
$ npm install ip-locator-for-wireshark -g
```

+ Wireshark 导出 JSON 文件

```
文件 > 导出分组解析结果 > As JSON...
```

+ 运行

```
ip-locator-for-wireshark {{导出的JSON文件}}
```

+ 结果存为文件

```
ip-locator-for-wireshark {{导出的JSON文件}} > {{结果文件名}}
```

## 结果文件实例

```
[
    "106.11.250.218": {
            "location": " ",
            "company": "中国 "
    },
    "220.181.38.149": {
            "location": "China Beijing",
            "company": "北京市百度蜘蛛",
            "domains": [
                    "www.hao8000.cn",
                    "www.543322.com",
                    "www.weike2.com",
                    "www.d4hh.com",
                    "www.4554.com",
                    "www.av77.cc",
                    "www.fm968.net"
            ]
    }
]
```