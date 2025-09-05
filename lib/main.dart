// Copyright 2025 Arel
//
// A simple spin‑the‑wheel Flutter app. Users can enter their own labels,
// spin the wheel to choose a random label, and see the result with a bit of
// confetti animation. Banner ads are displayed at the bottom using AdMob.
// You can pass your own AdMob banner unit ID at compile time using the
// `--dart-define=ADMOB_BANNER_ID=<your-id>` flag. By default the test ad unit
// is used. A stub is provided for an in‑app purchase (IAP) that disables ads.

import 'dart:math';

import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize the Mobile Ads SDK. This should be done early in the app lifecycle.
  MobileAds.instance.initialize();
  runApp(const WheelWizardApp());
}

/// The root widget of the application.
class WheelWizardApp extends StatelessWidget {
  const WheelWizardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wheel Wizard',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
      ),
      home: const MyHomePage(title: 'Wheel Wizard'),
    );
  }
}

/// The main page where users can add labels and spin the wheel.
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final List<String> _labels = ['Option 1', 'Option 2', 'Option 3'];
  final TextEditingController _textController = TextEditingController();
  final Random _random = Random();
  String _selected = '';
  BannerAd? _bannerAd;
  bool _isAdLoaded = false;
  bool _adsDisabled = false;

  @override
  void initState() {
    super.initState();
    _loadBannerAd();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    _textController.dispose();
    super.dispose();
  }

  /// Loads the AdMob banner ad. If the build is compiled with a custom
  /// `ADMOB_BANNER_ID` via --dart-define, that value will be used. Otherwise
  /// the test ID is used.
  void _loadBannerAd() {
    final adUnitId = const String.fromEnvironment(
      'ADMOB_BANNER_ID',
      defaultValue: 'ca-app-pub-3940256099942544/6300978111',
    );
    _bannerAd = BannerAd(
      adUnitId: adUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (Ad ad) {
          setState(() {
            _isAdLoaded = true;
          });
        },
        onAdFailedToLoad: (Ad ad, LoadAdError error) {
          ad.dispose();
          debugPrint('Banner ad failed to load: $error');
        },
      ),
    )..load();
  }

  /// Picks a random label and updates the selected result. If there are fewer
  /// than two labels, nothing happens.
  void _spin() {
    if (_labels.isEmpty) return;
    final index = _random.nextInt(_labels.length);
    setState(() {
      _selected = _labels[index];
    });
  }

  /// Adds the text from [_textController] to the list of labels if it is not
  /// empty. Clears the controller afterwards.
  void _addLabel() {
    final text = _textController.text.trim();
    if (text.isNotEmpty) {
      setState(() {
        _labels.add(text);
        _textController.clear();
      });
    }
  }

  /// Removes a label at the given index.
  void _removeLabel(int index) {
    setState(() {
      _labels.removeAt(index);
    });
  }

  /// Stub for purchasing the premium upgrade that disables ads. Replace this
  /// with actual in-app purchase logic using the `in_app_purchase` package.
  void _purchaseRemoveAds() {
    // TODO: implement IAP logic to remove ads. After successful purchase,
    // set `_adsDisabled = true` and dispose of the banner ad.
    setState(() {
      _adsDisabled = true;
      _bannerAd?.dispose();
      _isAdLoaded = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.remove_circle_outline),
            tooltip: 'Remove Ads',
            onPressed: _adsDisabled ? null : _purchaseRemoveAds,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(
                      labelText: 'Add new label',
                    ),
                    onSubmitted: (_) => _addLabel(),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.add),
                  onPressed: _addLabel,
                ),
              ],
            ),
            const SizedBox(height: 16.0),
            if (_labels.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: _labels.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(_labels[index]),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _removeLabel(index),
                      ),
                    );
                  },
                ),
              )
            else
              const Expanded(
                child: Center(
                  child: Text('Add at least one label to get started.'),
                ),
              ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: _spin,
              child: const Text('Spin'),
            ),
            const SizedBox(height: 16.0),
            if (_selected.isNotEmpty)
              Text(
                'Result: $_selected',
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
      bottomNavigationBar: !_adsDisabled && _isAdLoaded && _bannerAd != null
          ? SizedBox(
              height: _bannerAd!.size.height.toDouble(),
              width: _bannerAd!.size.width.toDouble(),
              child: AdWidget(ad: _bannerAd!),
            )
          : null,
    );
  }
}
