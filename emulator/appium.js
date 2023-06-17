const { remote } = require('webdriverio');
const { execSync } = require('child_process');
const fs = require('fs');
const { getFileData, setFileData } = require('./../functions.js');

async function runWhatsappSpammer(clients_list, message) {
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

  console.log(clients_list);
  let index = 0;

  await reloadApp();
  for (const client_list of clients_list) {
    for (const client of client_list.clients) {
      index++;
      const number = client.number;
      let client_phone = number.replace(/[()]/g, "");
      console.log(client_phone);
      client_phone = '0635201674';
      if (await sendMessage('38' + client_phone, message)) {
        client_list.status = 'complete';
      }
      await new Promise((resolve) => setTimeout(resolve, 30000));
      executeADBCommand(`exec-out screencap -p > screenshotStep${index}.png`);
      await reloadApp();
    }

    getFileData('./assets/clients.json', (json) => {
      const data = JSON.parse(json);
      const client = data.find(filter => filter.filter_id === client_list.filter_id);

      client.status = 'complete';
      console.log(data);

      setFileData('./assets/clients.json', data);
    })
  }
  // console.log(clients_list);

  async function auth() {
    //Step 1:
    const buttonElement = (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/next_button")')).click();
    await new Promise((resolve) => setTimeout(resolve, 25000));

    // //Step2:
    await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/eula_accept")').click();
    await new Promise((resolve) => setTimeout(resolve, 25000));

    // //Step3:
    await driver.$('android=new UiSelector().text("United States")').click();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/menuitem_search")').click();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await driver.$('android= new UiSelector().resourceId("com.whatsapp:id/search_src_text")').setValue('Ukraine');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const country = await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/country_first_name")');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await country.click();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_phone")').setValue("688400671");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_submit")').click();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await driver.$('android=new UiSelector().resourceId("android:id/button1")').click();
    await new Promise((resolve) => setTimeout(resolve, 15000));


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

  async function findElement(element, timeout = 16000) {
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
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await driver.launchApp();
    await new Promise((resolve) => setTimeout(resolve, 10000));
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
    if (await findElement('resourceId("com.whatsapp:id/fab")')) {
      await elClick('resourceId("com.whatsapp:id/fab")');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await elClick('resourceId("com.whatsapp:id/menuitem_search")');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await elClick('resourceId("com.whatsapp:id/search_src_text")');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await elSetValue('resourceId("com.whatsapp:id/search_src_text")', client_phone);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (await findElement(`text("No results found for '${client_phone}'")`)) {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await elClick('resourceId("com.whatsapp:id/contactpicker_text_container")');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await elSetValue('resourceId("com.whatsapp:id/entry")', message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (await findElement('resourceId("com.whatsapp:id/send")')) {
        await elClick('resourceId("com.whatsapp:id/send")');
        return true;
      }
    }
    return false;
  }

  async function screenshot() {
    await new Promise((resolve) => setTimeout(resolve, 10000));
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

// runWhatsappSpammer([{'number': '0635201674', 'name': 'Andriy'}], 'Youu pidar');

//docker exec -it --privileged androidContainer emulator @nexus -no-window -no-snapshot -noaudio -no-boot-anim -memory 648 -accel on -gpu swiftshader_indirect -camera-back none -cores 4

module.exports = {
  runWhatsappSpammer
};
