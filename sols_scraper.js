import puppeteer from "puppeteer";

async function run() {
  const USER_EMAIL = "sadoscott25@gmail.com";
  const USER_PASSWORD = "Scotty-dev-camer@123";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log("➡️ Navigation vers la page de login...");
  await page.goto(
    "https://maze-erp.com/bed/software/app/mobile/command_login.php",
    {
      waitUntil: "networkidle2",
    },
  );

  console.log("➡️ Remplissage du formulaire de connexion...");
  await page.type('input[name="mail"]', USER_EMAIL);
  await page.type('input[name="pwd"]', USER_PASSWORD);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  console.log("Connexion réussie ");

  await Promise.all([
    page.click('a[href="index.php?b=3"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  console.log("➡️ Accès a la boutique douala...");

  await Promise.all([
    page.click('a[href="index.php?catalogue=SOL\'S"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  console.log("Acces au categorie sols...");

  const data = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll("div.col-md-3").forEach((el) => {
      const name = el.innerText.trim();
      results.push({
        category: name,
        products: [], 
      });
    });
    return results;
  });

    console.log("category data",data);

  const url = page.url();
  const title = await page.title();
  console.log("📍 Page  atteint :", title);

  // await browser.close(); // tu peux fermer le navigateur une fois terminé
}

run().catch(console.error);
