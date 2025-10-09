require('dotenv').config();
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

async function clickAndWait(page: any, selector: string, navigationOptions: any = {}): Promise<void> {
  await Promise.all([
    page.click(selector),
    page.waitForNavigation({ waitUntil: "networkidle2", ...navigationOptions }),
  ]);
}

async function clickDivByInnerText(page: any, text: string, exact = false): Promise<void> {
  await page.evaluate(
    (text: any, exact: any) => {
      const el:any = Array.from(document.querySelectorAll("div.col-md-3")).find((div: any) =>
        exact
          ? div.innerText.trim().toLowerCase() === text
          : div.innerText.trim().toLowerCase().includes(text)
      );
      if (el) el.click();
    },
    text.toLowerCase(),
    exact
  );
  await page.waitForNavigation({ timeout: 60000, waitUntil: "networkidle2" });
}

interface SizeInfo {
  sizeTitle: string;
  quantity: number;
  image: string;
  price: number;
}

interface InventoryItem {
  color: string;
  sizesInfo: SizeInfo[];
}

async function extractInventory(page: any): Promise<InventoryItem[]> {
  return await page.evaluate(() => {
    const inventory: InventoryItem[] = [];
    const table = document.querySelector("#dataTable1");
    if (!table) return inventory;

    const sizeTitles = Array.from(table.querySelectorAll("thead tr th"))
      .slice(1)
      .map((th:any) => th.innerText.trim());

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
      const cols = row.querySelectorAll("td");
      const color = cols[0]?.innerText.trim() || "";
      const image = row.querySelector("img")?.src || "";

      const sizesInfo: SizeInfo[] = [];
      for (let i = 1; i < cols.length; i++) {
        const sizeTitle = sizeTitles[i - 1] || "Unknown Size";
        const col = cols[i];
        const quantityText = col.innerText.trim().split("\n")[0];
        const span = col.querySelector("span");

        sizesInfo.push({
          sizeTitle,
          quantity: Number(quantityText || 0),
          image,
          price: Number(span?.innerText.trim().split(" ")[0] || 0),
        });
      }

      inventory.push({ color, sizesInfo });
    });

    return inventory;
  });
}

async function run(): Promise<InventoryItem[]> {
  const USER_EMAIL = "sadoscott25@gmail.com";
  const USER_PASSWORD = "Scotty-dev-camer@123";

  const viewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1080,
    isLandscape: true,
    isMobile: false,
    width: 1920,
  };

  const headlessType = Boolean(process.env.IS_LOCAL) ? false : "shell";

  const browser = await puppeteer.launch({
    defaultViewport: viewport,
    executablePath: process.env.IS_LOCAL
      ? process.env.PATH_TO_CHROMIUM
      : await chromium.executablePath(),
    headless: headlessType,
  });

  const page: any = await browser.newPage();

  console.log("➡️ Navigation vers la page de login...");
  await page.goto("https://maze-erp.com/bed/software/app/mobile/command_login.php", { waitUntil: "networkidle2" });

  console.log("➡️ Remplissage du formulaire de connexion...");
  await page.type('input[name="mail"]', USER_EMAIL);
  await page.type('input[name="pwd"]', USER_PASSWORD);

  await clickAndWait(page, 'button[type="submit"]');
  console.log("Connexion réussie");

  await clickAndWait(page, 'a[href="index.php?b=3"]');
  console.log("➡️ Accès a la boutique douala...");

  await clickAndWait(page, 'a[href="index.php?catalogue=SOL\'S"]');
  console.log("Acces au categorie sols...");

  await clickDivByInnerText(page, 'tee shirts');
  console.log("Accessing product format...");

  await clickDivByInnerText(page, 'unisex');
  console.log("Accessing product brand...");

  await clickDivByInnerText(page, 'imperial', true);
  console.log("Reading product details...");

  const inventory: InventoryItem[] = await extractInventory(page);
  console.log("Product details read successfully");

  await browser.close();
  return inventory;
}

export default async function scrapper(): Promise<InventoryItem[]> {
  return await run();
}