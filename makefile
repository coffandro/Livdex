default: install-emulator

serve:
	cdvlive browser

install-all:
	cordova build android
	adb -s emulator-5554 install platforms/android/app/build/outputs/apk/debug/app-debug.apk
	adb -s R58MC387MQV install platforms/android/app/build/outputs/apk/debug/app-debug.apk

install-android:
	cordova build android
	adb -s R58MC387MQV install platforms/android/app/build/outputs/apk/debug/app-debug.apk

install-emulator:
	cordova build android
	adb -s emulator-5554 install platforms/android/app/build/outputs/apk/debug/app-debug.apk
