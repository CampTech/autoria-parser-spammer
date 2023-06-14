const { remote } = require('webdriverio');
const { execSync } = require('child_process');

async function runCalculatorTest() {
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

  console.log('YYYYYYEEEEEEEEEEAAAAAASSSSSS, BLEATSSS');


    //Step 1:
    // const buttonElement = (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/next_button")')).click();

    // await new Promise((resolve) => setTimeout(resolve, 15000));
    // executeADBCommand(`exec-out screencap -p > screenshotStep1.png`);

    //Step2:
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/eula_accept")').click();
    // await new Promise((resolve) => setTimeout(resolve, 15000));
    // executeADBCommand(`exec-out screencap -p > screenshotStep2.png`);

    //Step3:
    // await driver.$('android=new UiSelector().text("United States")').click();
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/menuitem_search")').click();
    // await driver.$('android= new UiSelector().resourceId("com.whatsapp:id/search_src_text")').setValue('Ukraine');
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // const country = await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/country_first_name")');
    // await country.click();
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_phone")').setValue("688400671");
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_submit")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await driver.$('android=new UiSelector().resourceId("android:id/button1")').click();
    // await new Promise((resolve) => setTimeout(resolve, 15000));
    // executeADBCommand(`exec-out screencap -p > screenshotStep3.png`);


    //Step4:
    //Sms code
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/verify_sms_code_input")').setValue('595131');

    //Permissions (use only new accounts and new emulator)
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/submit")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await driver.$('android=new UiSelector().text("Allow")').click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));  //2x maybe
    // await driver.$('android= new UiSelector().text("Skip")').click();
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    //Added info to user
    // const userName = 'Spammer';
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/registration_name")').setValue(userName);
    // await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/register_name_accept")').click();
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    const client_name = "Taras";
    const client_last_name = "Client2";
    const client_phone = "663895605";
    const message = 'Привіт, ми тут';

    async function reloadApp() {
      await driver.closeApp();
      await new Promise((resolve) => setTimeout(resolve, 30000));
      await driver.launchApp();
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }

    async function addNewClient(client_name, client_last_name, client_phone) {
      try{
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
      try{
        await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/fab")')).click();
      } catch {
        try {
          await (await driver.$('android=new UiSelector().text("Send message")')).click();
        } catch {
          console.log('Element not find, back to main app');
        }
        console.log('Element not find, back to main app');
      }
      await new Promise((resolve) => setTimeout(resolve, 15000));
      await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/menuitem_search")')).click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await (await driver.$('android=new UiSelector().text("Search name or number…")')).setValue(client_phone);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/contactpicker_text_container")')).click();
      await new Promise((resolve) => setTimeout(resolve, 15000));
      await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/entry")')).setValue(message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await (await driver.$('android=new UiSelector().resourceId("com.whatsapp:id/send")')).click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }


    // await driver.$('android=new UiSelector().description("Navigate up")').click();

    //get All Xml on the page
    // console.log(await driver.getPageSource());

    // await reloadApp();

    // await sendMessage('380'+client_phone, message);

    // await addNewClient(client_name, client_last_name, client_phone);

    //Screenshot
    await new Promise((resolve) => setTimeout(resolve, 3000));
    executeADBCommand(`exec-out screencap -p > screenshotStep.png`);
  await driver.deleteSession();
}

runCalculatorTest();

function executeADBCommand(command) {
    try {
      const output = execSync(`docker exec --privileged androidContainer adb ${command}`);
      return output;
    } catch (error) {
      console.error('Ошибка выполнения команды ADB:', error);
      throw error;
    }
  }

//emulator @nexus -no-window -no-snapshot -noaudio -no-boot-anim -memory 648 -accel on -gpu off -camera-back none -scale -0.3 -cores 4



