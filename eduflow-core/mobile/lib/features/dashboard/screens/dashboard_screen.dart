import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme_manager.dart';
import '../auth/screens/login_screen.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<void> _logout(BuildContext context) async {
    const storage = FlutterSecureStorage();
    await storage.deleteAll();
    
    if (context.mounted) {
      Provider.of<ThemeManager>(context, listen: false).resetToDefault();
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeManager = Provider.of<ThemeManager>(context);
    final theme = themeManager.currentTheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(theme.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: theme.secondaryColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: theme.secondaryColor),
              ),
              child: Text(
                'Plan: ${theme.subscriptionTier}',
                style: TextStyle(
                  color: theme.secondaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 32),
            Icon(
              Icons.dashboard,
              size: 100,
              color: theme.primaryColor,
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome to ${theme.name}',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: theme.primaryColor,
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(32.0),
              child: Text(
                'The dashboard UI and features are securely managed and dynamically loaded based on your role and subscription tier.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
