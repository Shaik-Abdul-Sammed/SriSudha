import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme_manager.dart';
import 'features/auth/screens/login_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeManager()),
      ],
      child: const EduFlowApp(),
    ),
  );
}

class EduFlowApp extends StatelessWidget {
  const EduFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeManager = Provider.of<ThemeManager>(context);

    return MaterialApp(
      title: 'EduFlow AI OS',
      theme: themeManager.themeData,
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(),
    );
  }
}
