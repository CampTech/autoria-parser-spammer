const { remote } = require('webdriverio');
const { execSync } = require('child_process');

async function runWhatsappSpammer(clients, message) {
  const driver = await remote({
    path: '/',
    port: 5900,
    capabilities: {
      platformName: 'Android',
      'appium:deviceName': 'Nexus 6',
      'appium:appPackage': 'com.whatsapp',
      'appium:appActivity': 'com.whatsapp.Main',
      "appium:automationName": 'uiautomator2',
      'appium:noReset': true,
      'appium:fullReset': false,
    }
  });

  try {
    await auth();
  } catch { }

  for (const client of clients) {
    const number = client.number;
    const client_phone = number.replace(/[()]/g, "");
    await sendMessage(client_phone, message)
    await driver.back();
  }

  async function auth() {
    //Step 1:
    // const buttonElement = (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/next_button")')).click();
    // await new Promise((resolve) => setTimeout(resolve, 25000));

    // //Step2:
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/eula_accept")').click();
    // await new Promise((resolve) => setTimeout(resolve, 25000));

    // //Step3:
    // await driver.$('android=new UiSelector().text("United States")').click();
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/menuitem_search")').click();
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // await driver.$('android= new UiSelector().resourceId("com.whatsapp:id/search_src_text")').setValue('Ukraine');
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // const country = await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/country_first_name")');
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // await country.click();
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_phone")').setValue("688400671");
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_submit")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await driver.$('android=new UiSelector().resourceId("android:id/button1")').click();
    // await new Promise((resolve) => setTimeout(resolve, 15000));


    //Step4:
    // Sms code
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/verify_sms_code_input")').setValue('981436');

    //Permissions (use only new accounts and new emulator)
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/submit")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await driver.$('android=new UiSelector().text("Allow")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));  //2x maybe
    // await driver.$('android=new UiSelector().text("Allow")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000)); 
    // await driver.$('android= new UiSelector().text("Skip")').click();
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    //Added info to user
    const userName = 'Spammer';
    await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_name")').setValue(userName);
    await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/register_name_accept")').click();
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  async function findElement(element, timeout = 30000) {
    try {
      const selector = `android=new UiSelector().${element}`;
      await driver.$(selector).waitForDisplayed({ timeout: timeout });
      return await driver.$(selector);
    } catch { return null; }
  }

  async function elClick(el) {
    try {
      const element = await findElement(el);
      if (element !== null) {
        await element.click();
      } else console.log('fuck^');
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }

  async function elSetValue(el, value) {
    try {
      const element = await findElement(el);
      if (element !== null) {
        await element.setValue(value);
      } else console.log('fuck^');
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }

  async function reloadApp() {
    await driver.closeApp();
    await new Promise((resolve) => setTimeout(resolve, 30000));
    await driver.launchApp();
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }

  async function addNewClient(client_name, client_last_name, client_phone) {
    try {
      await (await driver.$('android=new UiSelector().text("New contact")')).click();
      await new Promise((resolve) => setTimeout(resolve, 25000));
      const first_name = await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/first_name_field")');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await first_name.click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await first_name.setValue(client_name);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const last_name = await driver.$('android=new UiSelector().text("Last name")');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await last_name.click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await last_name.setValue(client_last_name);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/country_code_field")')).click();
      await new Promise((resolve) => setTimeout(resolve, 30000));
      await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/menuitem_search")')).click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await (await driver.$('android= new UiSelector().resourceId("com.whatsapp:id/search_src_text")')).setValue('Ukraine');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const country = await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/country_first_name")');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await country.click();
      await new Promise((resolve) => setTimeout(resolve, 30000));
      await (await driver.$('android=new UiSelector().text("Phone")')).setValue(client_phone);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await (await driver.$('android=new UiSelector().text("SAVE")')).click();
      await new Promise((resolve) => setTimeout(resolve, 30000));
    } catch {
      console.log('User not been added');
    }
  }

  async function sendMessage(client_phone, message) {
    await elClick('resourceId("com.whatsapp:id/fab")');
    await elClick('resourceId("com.whatsapp:id/menuitem_search")');
    await elSetValue('text("Search name or number…")', client_phone);
    await elClick('resourceId("com.whatsapp:id/contactpicker_text_container")');
    await elSetValue('resourceId("com.whatsapp:id/entry")', message);
    await elClick('resourceId("com.whatsapp:id/send")');
  }

  async function screenshot() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    executeADBCommand(`exec-out screencap -p > screenshotStep.png`);
  }

  //get All Xml on the page
  // console.log(await driver.getPageSource());

  await screenshot();

  await driver.deleteSession();
}

function executeADBCommand(command) {
  try {
    const output = execSync(`docker exec --privileged androidContainer adb ${command}`);
    return output;
  } catch (error) {
    console.error('Ошибка выполнения команды ADB:', error);
    throw error;
  }
}

// runWhatsappSpammer(['(063)5201674'], 'Youu pidar');

//emulator @nexus -no-window -no-snapshot -noaudio -no-boot-anim -memory 648 -accel on -gpu off -camera-back none -cores 4

module.exports = {
  runWhatsappSpammer
};
