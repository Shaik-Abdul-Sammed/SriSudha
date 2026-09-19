import 'dart:io';

void main() {
  final file = File('about_screen.dart');
  String content = file.readAsStringSync();
  
  // Add imports
  content = content.replaceFirst(
    "import 'package:flutter/material.dart';",
    "import 'package:flutter/material.dart';\nimport 'dart:convert';\nimport 'package:http/http.dart' as http;\nimport 'app_config.dart';"
  );
  
  // Change to StatefulWidget
  content = content.replaceFirst(
    "class AboutScreen extends StatelessWidget {",
    "class AboutScreen extends StatefulWidget {\n  const AboutScreen({super.key});\n\n  @override\n  State<AboutScreen> createState() => _AboutScreenState();\n}\n\nclass _AboutScreenState extends State<AboutScreen> {"
  );
  
  content = content.replaceFirst(
    "const AboutScreen({super.key});",
    ""
  );

  // Add state variables and initState
  content = content.replaceFirst(
    "@override\n  Widget build(BuildContext context) {",
    "  List<dynamic> perksList = [];\n  bool isLoadingPerks = true;\n\n  @override\n  void initState() {\n    super.initState();\n    _fetchPerks();\n  }\n\n  Future<void> _fetchPerks() async {\n    try {\n      final response = await http.get(Uri.parse('\${AppConfig.apiBaseUrl}/user/dashboard-perks'));\n      if (response.statusCode == 200) {\n        final data = jsonDecode(response.body);\n        setState(() {\n          perksList = data['perks'] ?? [];\n          isLoadingPerks = false;\n        });\n      }\n    } catch (e) {\n      setState(() { isLoadingPerks = false; });\n    }\n  }\n\n  @override\n  Widget build(BuildContext context) {"
  );

  // Replace _buildPerks body
  final oldPerks = r"""  Widget _buildPerks(BuildContext context) {
    // In a real app, this would use a FutureBuilder fetching from /api/v1/user/dashboard-perks
    return _buildResponsiveGrid(
      context: context,
      childAspectRatio: 1.2,
      children: [
        _buildIconCard(context, '📍', 'Live Bus GPS', 'Real-time tracking enabled.'),
        _buildIconCard(context, '📄', 'AI Reports', 'Smart analytics activated.'),
        _buildIconCard(context, '🎯', 'Placement Radar', 'Career matching active.'),
        _buildIconCard(context, '📈', 'Student Analytics', 'Deep insights unlocked.'),
        _buildIconCard(context, '📚', 'Mock Interviews', 'AI interview prep ready.'),
        _buildIconCard(context, '🧾', 'Resume Builder', 'Auto CV generation on.'),
        _buildIconCard(context, '🤖', 'AI Assistant', '24/7 administrative help.'),
      ],
    );
  }""";
  
  final newPerks = r"""  Widget _buildPerks(BuildContext context) {
    if (isLoadingPerks) {
      return const Center(child: CircularProgressIndicator());
    }
    if (perksList.isEmpty) {
      return const Center(child: Text('No active perks found.'));
    }
    return _buildResponsiveGrid(
      context: context,
      childAspectRatio: 1.2,
      children: perksList.map((p) => _buildIconCard(
        context, 
        p['icon'] ?? '✨', 
        p['title'] ?? '', 
        p['subtitle'] ?? ''
      )).toList(),
    );
  }""";
  
  content = content.replaceFirst(oldPerks, newPerks);
  
  file.writeAsStringSync(content);
}
