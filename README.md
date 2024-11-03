# How to Compile and Run the App

## (1)
Extract the Zip file, and open it by using IDE(e.g.VSCode)
Or
Clone the Code from the CareConnect Repository

Open your terminal and run the following command:

git clone https://github.com/ShawnWang86b/CareConnect.git
Navigate to the Project Folder


## (2)
After cloning the code, change to the project directory. For example:

cd Desktop/CareConnect
(Replace Desktop/CareConnect with the path to your project folder.)

Install Dependencies

In the project folder, run:

npm install

This will automatically install all the required dependencies.

Install a Simulator


## (3)
To run the app on a simulator, you may need to set up one according to your system:

For an Android emulator: Follow these instructions. https://docs.expo.dev/workflow/android-studio-emulator/
For an iOS simulator: Follow these instructions. https://docs.expo.dev/workflow/ios-simulator/
Start the Development Server


## (4)
After completing the setup, start the project by running:

npm run start
Or
npm run start -c 
Open the App on a Simulator

Once the development server is running, you'll see a QR code in the terminal. You can:

Type i to open the app in the iOS simulator.
Type a to open the app in the Android emulator.

And you can scan the QR code by using Android phone, to run react native project in an Expo app, in Android or iOS phone.

We suggest to type a to open the app in the Android emulator.




Email feature:
Since our approach with the email feature (Resend) requires an existing domain to allow specific users to receive an email, and could cost at least 20 AUD per year, the current implementation only allows our testing account to receive emails. Therefore, to test whether users' heartrate data has been sent successfully, we provide this account for verification.

Email: careconnect90018@gmail.com
Password: COMP90018

Once users click on the "Send Heart Rate Report" button, the account should receive a measured heartrate array formatted in a template.