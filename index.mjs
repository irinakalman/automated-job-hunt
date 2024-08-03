import puppeteer from 'puppeteer';
import { MAIN_WORLD } from 'puppeteer';

/*** * * ***/

const browser = await puppeteer.launch({
  headless: false, 
  defaultViewport: null, 
  args: ['--start-maximized'] });

const page = await browser.newPage();

/*** * * ***/

const checkUrlJobs = (url, callback) => {
  console.log("checkUrlJobs"); // stub

  const prefix = "https://www.linkedin.com/jobs/search/?"

  if (! url.includes(prefix)) {
    return;
  }

  if (! url.length > prefix.length) {
    return;
  }

  callback()
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const clickElement = async (selector, condition) => {
  if (typeof selector === "undefined") {
    return
  }

  const el = document.querySelector(selector);

  if (! el) {
    console.log("not el")
    return;
  }

  if (typeof condition === "undefined") {
    console.log("cond undef")
    console.log(typeof el)
    el.click();
  }

  if (!condition || condition(el)) {
    el.click();
  }
};

const easyApplyAllJobs = async () => {
  console.log("easyApplyAllJobs");

  const jobs = document.querySelectorAll('.job-card-container');
  for (let job of jobs) {
    await sleep(1000);
    job.click()

    try {
      await sleep(1000);
      await clickElement('.jobs-apply-button', (el) => el.ariaLabel.includes("Easy Apply"));

      // while (nextButton) ... sleep(1000); nextButton.click()

      await sleep(1000);
      await clickElement('[aria-label="Submit application"]');
      
    } catch (err) {
      console.log(err);
    }

    await sleep(1000);

    // Close all dialogs
    while (document.querySelector('[role="dialog"]')) {
      await sleep(1000);
      await clickElement("[aria-label='Dismiss']");
      await sleep(1000);
      await clickElement("[data-control-name='discard_application_confirm_btn']");
    }
  }

  await nextUrlJobs();
}

const nextUrlJobs = async () => {
  console.log("nextUrlJobs");

  await sleep(1000);

  // go to next page

  await easyApplyAllJobs();
}

/*** * * ***/

const main = async () => {
  await page.goto('https://www.linkedin.com/');

  page.on('framenavigated', (frame) => {
    const url = frame.url();
    checkUrlJobs(url, easyApplyAllJobs);
  });
}

main();

