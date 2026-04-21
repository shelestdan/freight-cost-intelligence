import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { webkit } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, "..", "public", "examples", "real");

const entries = [
  { slug: "site-stripe", url: "https://stripe.com/" },
  { slug: "site-aesop", url: "https://www.aesop.com/" },
  { slug: "site-apple", url: "https://www.apple.com/macbook-air/" },
  { slug: "service-linear", url: "https://linear.app/" },
  { slug: "service-trello", url: "https://trello.com/" },
  { slug: "service-notion", url: "https://www.notion.so/product" },
  { slug: "service-apple-store", url: "https://www.apple.com/us/shop" },
  { slug: "service-nike-shop", url: "https://www.nike.com/w/mens-shoes-nik1zy7ok" },
  { slug: "service-zara-shop", url: "https://www.zara.com/us/en/woman-new-in-l1180.html" }
];

const cleanupCss = `
  [role="dialog"],
  [aria-modal="true"],
  .modal,
  .popup,
  .cookie,
  .cookies,
  .consent,
  .newsletter,
  .intercom-lightweight-app,
  .osano-cm-dialog,
  .fc-consent-root,
  #onetrust-banner-sdk,
  .ot-sdk-container,
  iframe {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }

  * {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;

await mkdir(outputDir, { recursive: true });

const browser = await webkit.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 980 },
  deviceScaleFactor: 1
});

await page.route(/\.(woff2?|ttf|otf|mp4|webm|mov|avi)(\?.*)?$/i, (route) =>
  route.abort()
);

page.setDefaultNavigationTimeout(45000);
page.setDefaultTimeout(15000);

for (const entry of entries) {
  try {
    await page.goto(entry.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3500);
    await page.addStyleTag({ content: cleanupCss });
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outputDir, `${entry.slug}.png`)
    });
    console.log(`captured ${entry.slug}`);
  } catch (error) {
    console.error(`failed ${entry.slug}:`, error);
  }
}

await browser.close();
