const { remote } = require('webdriverio');
const { execSync } = require('child_process');
const fs = require('fs');
const { getFileData, setFileData } = require('./../functions.js');
// const { launch } = require('puppeteer');

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

  let index = 0;
  await reloadApp();
  if (findElement('text("Send message")')) {
    await elClick('text("Send message")');
    await addNewClient('SCFW', 'Maker', '0635201674');
  }

  for (const client_list of clients_list) {
    for (const client of client_list.clients) {
      index++;
      await reloadApp();
      const number = client.number;
      let client_phone = number.replace(/[()]/g, "");
      // client_phone = '0635201674';
      if (await sendMessage('38' + client_phone, message)) {
        client_list.status = 'complete';
        client_list.messanger = 'whatsapp';
        client_list.message_to = message;
      } else {
        client_list.messanger = 'none';
      }
      executeADBCommand(`exec-out screencap -p > screenshotStep${index}.png`);
    }

    getFileData('./assets/clients.json', (json) => {
      const data = JSON.parse(json);
      const client = data.find(filter => filter.filter_id === client_list.filter_id);

      client.status = 'complete';
      console.log(data);
      setFileData('./assets/clients.json', data);
    })

    getFileData('./assets/processing.json', (json) => {
      const data = JSON.parse(json);

      const client = data.find(filter => filter.id === client_list.filter_id);
      client.status = 'complete';
      console.log(data);
      setFileData('./assets/processing.json', data);
    });
  }

  async function findElement(element, timeout = 6000) {
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
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }

  async function elSetValue(el, value) {
    try {
      const element = await findElement(el);
      if (element !== null) {
        await element.setValue(value);
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }

  async function reloadApp() {
    await driver.closeApp();
    await driver.launchApp();
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
    if (await findElement('text("Send message")')) {
      await elClick('text("Send message")');
    } else {
      await elClick('resourceId("com.whatsapp:id/fab")');
    }

    await elClick('resourceId("com.whatsapp:id/menuitem_search")');
    await elClick('resourceId("com.whatsapp:id/search_src_text")');
    await elSetValue('resourceId("com.whatsapp:id/search_src_text")', client_phone);
    if (await findElement(`text("No results found for '${client_phone}'")`)) {
      return false;
    }
    await elClick('resourceId("com.whatsapp:id/contactpicker_text_container")');
    await elSetValue('resourceId("com.whatsapp:id/entry")', message);
    if (await findElement('resourceId("com.whatsapp:id/send")')) {
      await elClick('resourceId("com.whatsapp:id/send")');
      return true;
    }
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

async function checkInterestedStatus() {
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

  async function check() {
    if (await findElement('resourceId("com.whatsapp:id/conversations_row_message_count")')) {
      await getInterested();
      await check();
    } else {
      console.log(false);
      await driver.closeApp();
      await driver.deleteSession();
      // return clients;
    }
  }

  async function getInterested() {
    await elClick('resourceId("com.whatsapp:id/conversations_row_message_count")');
    const numberElement = await findElement('resourceId("com.whatsapp:id/conversation_contact_name")');
    const messageElements = await driver.$$('android=new UiSelector().resourceId("com.whatsapp:id/message_text")');
    const messageElement = await messageElements[messageElements.length - 1];
    const number = await numberElement.getText();
    const message = await messageElement.getText()
    await clients.push({
      'number': number,
      'message': message
    })
  }

  async function findElement(element, timeout = 6000) {
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
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }


  await driver.closeApp();
  await driver.launchApp();

  // await executeADBCommand(`exec-out screencap -p > screenshotStep.png`);


  const clients = [];
  await check();
  console.log(clients);
  return clients;

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

async function checkAuth() {
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

  await elClick('resourceId("com.whatsapp:id/next_button")');
  if (await findElement('resourceId("com.whatsapp:id/eula_accept")')) {
    await driver.deleteSession();
    return false;
  }
  await driver.deleteSession();
  return true;

  async function findElement(element, timeout = 6000) {
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
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }
}

async function logout() {
  const driver = await remote({
    path: '/',
    port: 5900,
    capabilities: {
      platformName: 'Android',
      'appium:deviceName': 'Nexus 6',
      'appium:appPackage': 'com.whatsapp',
      'appium:appActivity': 'com.whatsapp.Main',
      "appium:automationName": 'uiautomator2',
      'appium:noReset': false,
      'appium:fullReset': true,
    }
  });

  await driver.resetApp();
  await driver.resetApp();
  await driver.deleteSession();
}

async function auth(number) {
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

  const registration_phone = number.replace(/^\+380/, "");
  //Step 1:
  await elClick('resourceId("com.whatsapp:id/next_button")');
  await new Promise((resolve) => setTimeout(resolve, 25000));

  if (await findElement('resourceId("com.whatsapp:id/eula_accept")')) {
    // //Step2:
    await elClick('resourceId("com.whatsapp:id/eula_accept")');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // //Step3:
    await elClick('text("United States")');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await elClick('resourceId("com.whatsapp:id/menuitem_search")');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await elSetValue('resourceId("com.whatsapp:id/search_src_text")', 'Ukraine');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await elClick('resourceId("com.whatsapp:id/country_first_name")');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await elSetValue('resourceId("com.whatsapp:id/registration_phone")', registration_phone);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await elClick('resourceId("com.whatsapp:id/registration_submit")');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await elClick('resourceId("android:id/button1")');
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
  await driver.deleteSession();

  async function findElement(element, timeout = 6000) {
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
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }

  async function elSetValue(el, value) {
    try {
      const element = await findElement(el);
      if (element !== null) {
        await element.setValue(value);
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }
}

async function authNextStep(bot_name, code) {
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

  await elSetValue('resourceId("com.whatsapp:id/verify_sms_code_input")', code);
  await elClick('resourceId("com.whatsapp:id/submit")');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await elClick('text("Allow")');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await elClick('text("Allow")');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await elClick('text("Skip")');
  await new Promise((resolve) => setTimeout(resolve, 10000));

  await elSetValue('resourceId("com.whatsapp:id/registration_name")', bot_name);
  await elClick('resourceId("com.whatsapp:id/register_name_accept")');
  await new Promise((resolve) => setTimeout(resolve, 10000));

  await driver.deleteSession();


  async function findElement(element, timeout = 6000) {
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
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }

  async function elSetValue(el, value) {
    try {
      const element = await findElement(el);
      if (element !== null) {
        await element.setValue(value);
      }
    } catch (err) {
      console.log(`element ${el} undefined` + '' + err);
    }
  }
}


// runWhatsappSpammer([{ "filter_id": 1, "clients": [{ "id": 1, "number": "(063)2591205", "name": " Олексій", "car": "Audi Q7 2008", "interested": "No" }, { "id": 2, "number": "(050)9487347", "name": " Владимир", "car": "Audi Q7 2019", "interested": "No" }], "status": "sending" }], 'Youu pidar');

//docker exec -it --privileged androidContainer emulator @nexus -no-window -no-snapshot -noaudio -no-boot-anim -memory 648 -accel on -gpu swiftshader_indirect -camera-back none -cores 4
//docker exec --privileged -it androidContainer bash -c "appium -p 5900"

module.exports = {
  runWhatsappSpammer,
  checkInterestedStatus,
  auth,
  authNextStep,
  checkAuth,
  logout
};
