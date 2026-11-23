package com.vtlo.osint;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.Toast;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private WebView web;
    private final ExecutorService pool = Executors.newFixedThreadPool(4);

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        LinearLayout root = new LinearLayout(this);
        root.setBackgroundColor(Color.parseColor("#0C0E12"));
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#43497D"));
        root.addView(web, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(false);
        s.setAllowUniversalAccessFromFileURLs(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setTextZoom(100);
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                String u = r.getUrl().toString();
                if (u.startsWith("file:///android_asset/")) return false;
                openLink(u, "inapp");
                return true;
            }
        });
        web.loadUrl("file:///android_asset/www/index.html");
    }

    private void openLink(String url, String mode) {
        Uri uri = Uri.parse(url);
        String sc = uri.getScheme() == null ? "" : uri.getScheme();
        if ("inapp".equals(mode) && (sc.equals("http") || sc.equals("https"))) {
            Intent i = new Intent(this, BrowserActivity.class);
            i.putExtra("url", url);
            startActivity(i);
        } else {
            try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
            catch (Exception e) { Toast.makeText(this, "Impossible d'ouvrir le lien", Toast.LENGTH_SHORT).show(); }
        }
    }

    public class Bridge {
        @JavascriptInterface public void open(final String url, final String mode) { runOnUiThread(() -> openLink(url, mode)); }
        @JavascriptInterface public void copy(final String text) {
            runOnUiThread(() -> {
                ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                cm.setPrimaryClip(ClipData.newPlainText("VTLOsint", text));
            });
        }
        @JavascriptInterface public void share(final String text) {
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(i, "Exporter"));
            });
        }
        @JavascriptInterface public void exit() { runOnUiThread(() -> finishAndRemoveTask()); }
        @JavascriptInterface public void fetch(final String url, final int id) {
            pool.execute(() -> {
                int status = 0; byte[] body = new byte[0];
                try {
                    if (!url.startsWith("https://") && !url.startsWith("http://")) throw new Exception("bad url");
                    HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                    c.setConnectTimeout(15000); c.setReadTimeout(20000);
                    c.setInstanceFollowRedirects(true);
                    c.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14) VTLOsint_mod/1.0");
                    c.setRequestProperty("Accept", "application/json,text/plain,*/*");
                    status = c.getResponseCode();
                    InputStream in = status >= 400 ? c.getErrorStream() : c.getInputStream();
                    if (in != null) {
                        ByteArrayOutputStream o = new ByteArrayOutputStream();
                        byte[] buf = new byte[8192]; int n; int tot = 0;
                        while ((n = in.read(buf)) > 0 && tot < 6_000_000) { o.write(buf, 0, n); tot += n; }
                        body = o.toByteArray(); in.close();
                    }
                } catch (Exception e) { status = 599; }
                final String b64 = android.util.Base64.encodeToString(body, android.util.Base64.NO_WRAP);
                final int st = status;
                runOnUiThread(() -> web.evaluateJavascript("window.__fetchCb(" + id + "," + st + ",'" + b64 + "')", null));
            });
        }
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(window.__back&&window.__back())===true", v -> {
            if (!"true".equals(v)) finish();
        });
    }

    @Override protected void onDestroy() { pool.shutdownNow(); super.onDestroy(); }
}
