import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import Modal from 'react-native-modal';

const moodColors: Record<string, string> = {
  Great: '#4CAF50',
  Good: '#81C784',
  Okay: '#2196F3',
  Bad: '#E57373',
  Terrible: '#F44336',
};

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [modalVisible, setModalVisible] = useState(false);
  const [tempMood, setTempMood] = useState('');
  const [tempSentence, setTempSentence] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const [entries, setEntries] = useState<Record<
    string,
    { mood: string; sentence: string; important?: boolean }
  >>({
    '2025-05-22': {
      mood: 'Okay',
      sentence: 'Watched a movie.',
      important: true,
    },
    [dayjs().format('YYYY-MM-DD')]: {
      mood: 'Great',
      sentence: 'Built a cool calendar app!',
    },
  });

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const entry = entries[day.dateString];
    setTempMood(entry?.mood || '');
    setTempSentence(entry?.sentence || '');
    setIsImportant(entry?.important || false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!tempMood || !tempSentence) return;
    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        mood: tempMood,
        sentence: tempSentence,
        important: isImportant,
      },
    }));
    setModalVisible(false);
  };

  const getMarkedDates = () => {
    const marked: any = {};

    for (const date of Object.keys(entries)) {
      const { mood, important } = entries[date];

      marked[date] = {
        selected: date === selectedDate,
        selectedColor: '#007AFF',
        customStyles: {
          container: {
            backgroundColor: moodColors[mood] || 'gray',
            borderRadius: 4,
            paddingTop: 0,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        },
        marked: important,
        dotColor: '#FFD700',
        disableTouchEvent: false,
        customTextStyle: important
          ? {
              fontSize: 14,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              text: '⭐',
            }
          : undefined,
      };
    }

    if (!entries[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#007AFF',
        customStyles: {
          container: {
            backgroundColor: 'gray',
            borderRadius: 4,
          },
          text: {
            color: 'white',
          },
        },
      };
    }

    return marked;
  };

  const moodOptions = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];

  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={handleDayPress}
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled
        showScrollIndicator
        markingType="custom"
        markedDates={getMarkedDates()}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Day: {selectedDate}</Text>
          {entries[selectedDate] ? (
            <>
              <Text>Mood: {entries[selectedDate].mood}</Text>
              <Text>Note: {entries[selectedDate].sentence}</Text>
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Add your entry:</Text>
              <TextInput
                style={styles.input}
                placeholder="Your one-sentence summary"
                value={tempSentence}
                onChangeText={setTempSentence}
              />

              <Text style={styles.inputLabel}>Pick a mood:</Text>
              <View style={styles.moodOptions}>
                {moodOptions.map((mood) => (
                  <TouchableOpacity key={mood} onPress={() => setTempMood(mood)}>
                    <Text
                      style={[
                        styles.moodButton,
                        tempMood === mood && styles.selectedMood,
                      ]}
                    >
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.importantToggle}>
                <Text style={styles.inputLabel}>Mark as Important</Text>
                <Switch value={isImportant} onValueChange={setIsImportant} />
              </View>

              <Button title="Save Entry" onPress={handleSave} />
            </>
          )}
        </KeyboardAvoidingView>
      </Modal>

      <Button title="Back to Entry" onPress={() => router.replace('/entry')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputLabel: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  moodButton: {
    fontSize: 14,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 10,
    margin: 4,
  },
  selectedMood: {
    backgroundColor: '#007AFF',
    color: 'white',
    fontWeight: 'bold',
  },
  importantToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
