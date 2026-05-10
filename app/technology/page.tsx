```diff
 export const metadata: Metadata = {
   title: 'Technology',
   description: 'Advanced robotic perception, navigation, and manipulation.',
+  openGraph: {
+    ...existingOpenGraph,
+    images: [
+      {
+        url: 'https://www.robottech.com/og-technology.jpg',
+        width: 1200,
+        height: 630,
+      },
+    ],
+  },
+  twitter: {
+    ...existingTwitter,
+    images: ['https://www.robottech.com/og-technology.jpg'],
+  },
 }
```