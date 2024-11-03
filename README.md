## How to Compile and Run the App

(1)
Extract the Zip file, and open it by using IDE(e.g.VSCode) (Recommended)

Or

Clone the Code from the CareConnect Repository.
Open your terminal and run the following command:

git clone https://github.com/ShawnWang86b/CareConnect.git

(If you use git clone, then you need to configure the environment additionally. Add the .env file under the Care-Connect path and copy the environment contents at the bottom into it.)


## Navigate to the Project Folder

(2)
After cloning the code, change to the project directory. For example:

cd Desktop/CareConnect
(Replace Desktop/CareConnect with the path to your project folder.)

Install Dependencies

In the project folder, run:

npm install

This will automatically install all the required dependencies.

## Install a Simulator

(3)
To run the app on a simulator, you may need to set up one according to your system:

For an Android emulator: Follow these instructions. https://docs.expo.dev/workflow/android-studio-emulator/
For an iOS simulator: Follow these instructions. https://docs.expo.dev/workflow/ios-simulator/

## start the Development Server

(4)
After completing the setup, start the project by running:

npm run start
Or
npm run start -c 
Open the App on a Simulator

Once the development server is running, you'll see a QR code in the terminal. You can:

Type i to open the app in the iOS simulator.
Type a to open the app in the Android emulator.

And you can scan the QR code by using Android phone, to run react native project in an Expo app, in Android or iOS phone.

We suggest to type 'a' to open the app in the Android emulator.


## Test
Email feature:
Since our approach with the email feature (Resend) requires an existing domain to allow specific users to receive an email, and could cost at least 20 AUD per year, the current implementation only allows our testing account to receive emails. Therefore, to test whether users' heartrate data has been sent successfully, we provide this account for verification.

Email: careconnect90018@gmail.com
Password: COMP90018

Once users click on the "Send Heart Rate Report" button, the account should receive a measured heartrate array formatted in a template.

## Environment

EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dmFzdC1wcmltYXRlLTU1LmNsZXJrLmFjY291bnRzLmRldiQ

DATABASE_URL =postgresql://Uber_owner:dC9K8JZvibMh@ep-raspy-lab-a75xs3g6.ap-southeast-2.aws.neon.tech/Uber?sslmode=require

EXPO_PUBLIC_SERVER_URL=https://uber.com/

EXPO_PUBLIC_GEOAPIFY_API_KEY=c659f5655b844b1ebf1aea465014990f

EXPO_PUBLIC_GOOGLE_API_KEY=AIzaSyAewff02BDFeen5NR93EzH4jsYoCId57_k

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51PprseLsS3KSTHZl0zWrTlXF71nwUdxitQ9B6XZ9wtWoV8QYYDeHNNj12oK38xVUjd61GOoFylE3fXiDlBFofl9a00TjMekec3

STRIPE_SECRET_KEY =sk_test_51PprseLsS3KSTHZlNvkkuw42HwPbFEH3P1m37It9iA4I14Xj6rVjWQOa44IrJKHFPrqfATx82iv3EvnuVbPgoIFM00Sbth4Quw

OPEN_AI_SECRET_KEY =org-OAFrjk23Ea5lSEV6Rq6WkSRa

EXPO_PUBLIC_DATABASE=postgresql://Uber_owner:dC9K8JZvibMh@ep-raspy-lab-a75xs3g6.ap-southeast-2.aws.neon.tech/Uber?sslmode=requirev
