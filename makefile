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

uninstall-all: uninstall-android uninstall-emulator

uninstall-android:
	adb -s R58MC387MQV uninstall com.coffandro.livdex

uninstall-emulator:
	adb -s emulator-5554 uninstall com.coffandro.livdex
