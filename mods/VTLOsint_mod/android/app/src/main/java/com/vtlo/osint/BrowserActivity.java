package com.vtlo.osint;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

public class BrowserActivity extends Activity {
    private WebView web;
    private TextView title;
    private ProgressBar bar;

    private TextView btn(String t, int sizeSp) {
        TextView v = new TextView(this);
        v.setText(t); v.setTextSize(sizeSp); v.setTextColor(Color.parseColor("#66D0DF"));
        v.setGravity(Gravity.CENTER); v.setTypeface(Typeface.DEFAULT_BOLD);
        return v;
    }

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        final String url = getIntent().getStringExtra("url");
        float d = getResources().getDisplayMetrics().density;
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#0C0E12"));

        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setBackgroundColor(Color.parseColor("#222858"));
        top.setGravity(Gravity.CENTER_VERTICAL);
        TextView close = btn("✕", 22);
        close.setOnClickListener(v -> finish());
        top.addView(close, new LinearLayout.LayoutParams((int) (52 * d), (int) (52 * d)));
        title = new TextView(this);
        title.setTextColor(Color.WHITE); title.setTextSize(14); title.setSingleLine(true);
        title.setEllipsize(android.text.TextUtils.TruncateAt.END); title.setText(url);
        top.addView(title, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView ext = btn("↗", 22);
        ext.setOnClickListener(v -> { String u = web.getUrl() != null ? web.getUrl() : url;
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(u))); });
        top.addView(ext, new LinearLayout.LayoutParams((int) (52 * d), (int) (52 * d)));
        root.addView(top, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, (int) (52 * d)));

        bar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        bar.setMax(100);
        root.addView(bar, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, (int) (3 * d)));

        web = new WebView(this);
        root.addView(web, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        setContentView(root);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setBuiltInZoomControls(true); s.setDisplayZoomControls(false);
        s.setLoadWithOverviewMode(true); s.setUseWideViewPort(true);
        s.setAllowFileAccess(false);
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView v, int p) { bar.setProgress(p); bar.setVisibility(p >= 100 ? View.GONE : View.VISIBLE); }
            @Override public void onReceivedTitle(WebView v, String t) { if (t != null && !t.isEmpty()) title.setText(t); }
        });
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                String sc = r.getUrl().getScheme();
                if ("http".equals(sc) || "https".equals(sc)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, r.getUrl())); } catch (Exception e) { }
                return true;
            }
        });
        if (url != null) web.loadUrl(url);
    }

    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else finish(); }
    @Override protected void onDestroy() { if (web != null) web.destroy(); super.onDestroy(); }
}
