serve:
	cdvlive browser

install-android:
	cordova build android
	adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk