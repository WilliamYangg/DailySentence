import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Button,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EntryScreen() {
  const router = useRouter();
  const [sentence, setSentence] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [isImportant, setIsImportant] = useState(false);

  const moodOptions = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];

  const handleSubmit = () => {
    if (!sentence || mood === null) return;

    // TODO: Save sentence, mood, and isImportant to AsyncStorage or context
    console.log({
      sentence,
      mood,
      important: isImportant,
    });

    router.replace('/calendar');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How was your day?</Text>

      <TextInput
        style={styles.input}
        placeholder="Summarize in one sentence"
        value={sentence}
        onChangeText={setSentence}
      />

      <Text style={styles.subtitle}>Your Mood:</Text>
      <View style={styles.moodContainer}>
        {moodOptions.map((option) => (
          <TouchableOpacity key={option} onPress={() => setMood(option)}>
            <Text style={[styles.moodButton, mood === option && styles.selectedMood]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.importantToggle}>
        <Text style={styles.subtitle}>Mark as Important</Text>
        <Switch value={isImportant} onValueChange={setIsImportant} />
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  subtitle: { fontSize: 18, marginBottom: 10 },
  moodContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  moodButton: { fontSize: 16, padding: 10, backgroundColor: '#eee', borderRadius: 10, margin: 4 },
  selectedMood: { backgroundColor: 'blue', color: 'white', fontWeight: 'bold' },
  importantToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
