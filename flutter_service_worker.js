'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "af188f1ea49651a9b52a3f5f531124b6",
"index.html": "d2d18fa04b32b046cd6a89a4c313c498",
"/": "d2d18fa04b32b046cd6a89a4c313c498",
"main.dart.js": "0d5c53fac4eb24fa764722a929cbe2f6",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "14268a0a8033940154ad3f8ec6586f28",
"icons/Icon-192.png": "6e600f5d4278c97f793cafad4c674f06",
"icons/Icon-maskable-192.png": "6e600f5d4278c97f793cafad4c674f06",
"icons/Icon-maskable-512.png": "c67a4239b7d29ea3ba7a8741327721ef",
"icons/Icon-512.png": "c67a4239b7d29ea3ba7a8741327721ef",
"manifest.json": "315669feb1b6325b274eb75986b198b7",
"assets/images/danger_level/1.5x/rating-considerable.png": "321297fd2996a4addf0065c6f3e11392",
"assets/images/danger_level/1.5x/rating-low.png": "176edb57341638e83e8705f8e647b201",
"assets/images/danger_level/1.5x/rating-no.png": "8a2fd9cb77bc73349d39606bec4d2b5d",
"assets/images/danger_level/1.5x/rating-moderate.png": "1a466a4d5382f170955541138a84542b",
"assets/images/danger_level/1.5x/rating-high.png": "13d51505c3cccd68eec490e78d2522a5",
"assets/images/danger_level/rating-considerable.png": "5fd982ef91b743d27f192c51f4e3ee46",
"assets/images/danger_level/rating-low.png": "e1e037c2717b50e8ff4150cc285c5ff6",
"assets/images/danger_level/2.0x/rating-considerable.png": "2da9913a417c49320e1f5f60df7d4287",
"assets/images/danger_level/2.0x/rating-low.png": "f91f48b4fc7ab397be7740f2ac4c6d1a",
"assets/images/danger_level/2.0x/rating-no.png": "05bf04570dd170d0b64405f2dd3d257b",
"assets/images/danger_level/2.0x/rating-moderate.png": "82b290fafc50104716a9b43a7dbcabd9",
"assets/images/danger_level/2.0x/rating-high.png": "be4a3879ad55dd963dcd33293c9cc709",
"assets/images/danger_level/rating-no.png": "666345220c5dba66c588a140031d4cda",
"assets/images/danger_level/3.0x/rating-considerable.png": "65031199d1277a3f2d70bf84c4c7a46c",
"assets/images/danger_level/3.0x/rating-low.png": "5fb0225acdd241e09d26331a4ad93ab5",
"assets/images/danger_level/3.0x/rating-no.png": "a8dd3b2c2be7936a2cd3f227d0acbeec",
"assets/images/danger_level/3.0x/rating-moderate.png": "7eaaf0567843565d519c9c76afdbde8b",
"assets/images/danger_level/3.0x/rating-high.png": "9ded207208dde035f3e5a72ebab31040",
"assets/images/danger_level/rating-moderate.png": "520c32ce6e4b96f9e58685455d621556",
"assets/images/danger_level/4.0x/rating-considerable.png": "a5099cd6cc7a788b518c008657a4d254",
"assets/images/danger_level/4.0x/rating-low.png": "668a9c010b84b34b97c5da474fe5f18f",
"assets/images/danger_level/4.0x/rating-no.png": "37f8444de931c41ef5fc1e4e9ff36f4e",
"assets/images/danger_level/4.0x/rating-moderate.png": "721b453433aa9d7b3d1764554888a68e",
"assets/images/danger_level/4.0x/rating-high.png": "08e9010749c2d51d33aa8615686b342b",
"assets/images/danger_level/rating-high.png": "b10efe3736e64b7a69fe4d28db26fbab",
"assets/AssetManifest.json": "9a81375bc4b70dffe3097371eba9679a",
"assets/NOTICES": "b7be179a02731fc09ee5b7e8efe89788",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "b578949ef84473e7e3afec548b165299",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
