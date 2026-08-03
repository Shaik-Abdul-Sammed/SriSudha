import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LORScreen extends StatelessWidget {
  Future<void> generateLOR() async {
    final response = await http.post(
      Uri.parse('http://localhost:3000/api/v1/careerforge/generate-lor'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode == 200) {
      print('LOR generated successfully');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('AI LOR Generator')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history_edu, size: 100, color: Colors.teal),
            SizedBox(height: 20),
            Text('Letter of Recommendation', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('Drafted instantly using AI context', style: TextStyle(color: Colors.grey)),
            SizedBox(height: 30),
            ElevatedButton(
              onPressed: generateLOR,
              child: Text('Generate LOR'),
            ),
          ],
        ),
      ),
    );
  }
}
