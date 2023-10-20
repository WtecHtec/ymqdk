
const fs =  require('fs')
const puppeteer = require('puppeteer');
const { MEI_TUAN_COOKIES } = require('./cookies')
const ARENA_URL = 'https://i.meituan.com/s/shenzhen-%E6%B7%B1%E5%9C%B3%E7%BE%BD%E6%AF%9B%E7%90%83%E9%A6%86'

const arenaFilePath = './arena.json'

// 写
function writeFileData(filePath, content) {
  return new  Promise(r => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err)
        r('-1')
        return
      }
      r('0')
    })
  })
}

async function start() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\Chrome.exe',
    headless: false, // 关闭无头模式
    // timeout: 0,
		args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process', '--no-sandbox','--disable-setuid-sandbox',
    ],
    ignoreHTTPSErrors: false, // 在导航期间忽略 HTTPS 错误
    args: ['--start-maximized',], // 最大化启动，开启vue-devtools插件
    defaultViewport: { // 为每个页面设置一个默认视口大小
        width: 1920,
        height: 1080
    }
	});

  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(0);
  await page.setCookie(...MEI_TUAN_COOKIES);


  await page.goto(ARENA_URL, {
		waitUntil: 'domcontentloaded',
	});
   
  let status = true
  let arenas = []

  while(status) {
    await page.waitForTimeout(5000)
    // 获取 名称 列表
    const rowSel = '#deals .poi-list-item .poiname'
    const deals = await page.$$eval(rowSel, els =>  els.map(el => {  return { arena_name:  el.innerHTML } }))
    console.log('deals====', deals.length)
    const pSel = '#deals .poi-list-item spanm[data-com="locdist"]'
    const pos = await page.$$eval(pSel, els =>  els.map(el => {
      return {
        arena_longitude: el.getAttribute('data-lng') ,
        arena_latitude: el.getAttribute('data-lat')
      }
    }))
    console.log('deals====', pos.length)
    const arena = deals.map((item, index) => {
      return {
        ...item,
        ...pos[index]
      }
    })
    arenas = [...arenas, ...arena]
    // 下一页
    const nextSel = 'a[gaevent="imt/search/deal/pageNext"]'
    try {
      const element = await page.waitForSelector(nextSel, { timeout: 5000 } );
      console.log(element)
      if (element) {
        // Do something with element...
        await writeFileData(arenaFilePath, JSON.stringify(arenas))
        await element.click(); // Just an example.
      } else {
        status = false
      }
    } catch (error) {
      status = false
    }
  }
  console.log(arenas)
  await writeFileData(arenaFilePath, JSON.stringify(arenas))
}

start()