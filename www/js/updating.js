var appVersion = 0;

function downloadAndProcessJson(url, _callback = null, errorCallback = null) {
	// Fetch the JSON file from the URL
	fetch(url)
		.then((response) => {
			// Check if the request was successful (status code 200)
			if (!response.ok) {
				if (errorCallback != null) {
					errorCallback(error);
				} else {
					console.error('Error Connecting to get data:', error);
				}
			}
			return response.json(); // Parse the JSON from the response
		})
		.then((data) => {
			if (_callback != null) {
				_callback(data);
			} else {
				return data;
			}
		})
		.catch((error) => {
			// Handle any errors (e.g., network issues, JSON parsing issues)

			if (errorCallback != null) {
				errorCallback(error);
			} else {
				console.error('Error fetching JSON:', error);
			}
		});
}

function canUpdate() {
	var networkState = navigator.connection.type;

	if (networkState != Connection.NONE) {
		return true;
	} else {
		return false;
	}
}

function getAppVersion() {
	cordova.getAppVersion.getVersionCode(function (version) {
		appVersion = version;
	});
}

function update() {
	downloadAndProcessJson(
		'https://github.com/coffandro/Livdex/releases/latest/download/output-metadata.json',
		function (data) {
			if (appVersion < parseFloat(data['elements'][0]['versionCode'])) {
				ApkUpdater.download(
					'https://github.com/coffandro/Livdex/releases/latest/download/app-debug.apk',
					{
						onDownloadProgress: console.log,
					},
					function () {
						ApkUpdater.install(console.log, console.error);
					},
					console.error
				);
				// Download APK somehow
				// Install APK, preferabbly via some update function in android but also via just deleting self
			}
		}
	);
}
