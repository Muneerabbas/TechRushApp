import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import colors from './assets/utils/colors';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
export default function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [nameverify, setNameverify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailverify] = useState(false);
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = Font.useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  const OCR_API_KEY = 'K81881684388957';
  const PRESETS = {
    fast: { targetBytes: 120 * 1024, minWidth: 800 },
    high: { targetBytes: 450 * 1024, minWidth: 1200 },
  };

  const [highQuality, setHighQuality] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  function log(m) {
    const s = typeof m === 'string' ? m : JSON.stringify(m);
    setLogs((p) => [s, ...p].slice(0, 60));
    console.log(s);
  }

  function handleNameverify(e) {
    setName(e);
    setNameverify(e.length > 1);
  }

  function handleEmailVerify(e) {
    setEmail(e);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailverify(emailRegex.test(e));
  }

  function handlePasswordValid(e) {
    setPassword(e);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordValid(passwordRegex.test(e));
  }

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const userdata = new FormData();
      userdata.append('name', name);
      userdata.append('email', email);
      userdata.append('password', password);

      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        userdata.append('profilePicture', {
          uri: image,
          name: filename,
          type,
        });
      }

      const res = await axios.post(
        `/auth/register`,
        userdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res) {
        Alert.alert('Success', 'Registered Successfully!');
        router.navigate('/login');
      } else {
        Alert.alert('Error', 'SignUp Failed');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      Alert.alert('Error', 'SignUp Failed!');
    } finally {
      setIsLoading(false);
    }
  }

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant permission to access your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function compressSmart(uri, preset) {
    const startTime = Date.now();
    const steps = [];
    let currentWidth = 2000;
    let finalResult = null;
    const minWidth = preset.minWidth || 600;

    async function binaryQualitySearch(inputUri, width, targetBytes, maxIter = 6) {
      let highQ = 0.95;
      let lowQ = 0.25;
      let best = null;
      let candidate = await ImageManipulator.manipulateAsync(inputUri, [{ resize: { width } }], {
        compress: highQ,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      let info = await FileSystem.getInfoAsync(candidate.uri);
      steps.push(`${Math.round(info.size / 1024)}KB@w${width}@q${highQ.toFixed(2)}`);
      if (info.size <= targetBytes) {
        best = { uri: candidate.uri, size: info.size, quality: highQ };
        return best;
      }
      let lo = lowQ;
      let hi = highQ;
      let iter = 0;
      while (iter < maxIter) {
        iter++;
        const mid = +(lo + (hi - lo) / 2).toFixed(3);
        const test = await ImageManipulator.manipulateAsync(candidate.uri, [], {
          compress: mid,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        const tinfo = await FileSystem.getInfoAsync(test.uri);
        steps.push(`${Math.round(tinfo.size / 1024)}KB@w${width}@q${mid.toFixed(2)}`);
        if (tinfo.size <= targetBytes) {
          best = { uri: test.uri, size: tinfo.size, quality: mid };
          lo = mid;
        } else {
          hi = mid;
        }
        if (Math.abs(hi - lo) < 0.02) break;
      }
      return best;
    }

    let attempt = 0;
    while (currentWidth >= minWidth && attempt < 5) {
      attempt++;
      log(`Attempt ${attempt} — width ${currentWidth}px`);
      const found = await binaryQualitySearch(uri, currentWidth, preset.targetBytes, 5);
      if (found) {
        finalResult = found;
        break;
      } else {
        currentWidth = Math.max(minWidth, Math.round(currentWidth * 0.7));
      }
    }

    if (!finalResult) {
      const finalWidth = minWidth;
      const finalQ = 0.23;
      const manipulated = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: finalWidth } }], {
        compress: finalQ,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const info = await FileSystem.getInfoAsync(manipulated.uri);
      steps.push(`final ${Math.round(info.size / 1024)}KB@w${finalWidth}@q${finalQ.toFixed(2)}`);
      finalResult = { uri: manipulated.uri, size: info.size, quality: finalQ };
    }

    const timeMs = Date.now() - startTime;
    return { uri: finalResult.uri, size: finalResult.size, steps, timeMs };
  }

  async function callOCRSpace(uri) {
    if (!OCR_API_KEY) {
      Alert.alert('API key missing', 'Set your OCR.Space API key in code.');
      return '';
    }

    setOcrLoading(true);
    const start = Date.now();
    try {
      const filename = uri.split('/').pop() || 'photo.jpg';
      const form = new FormData();
      form.append('file', { uri, name: filename, type: 'image/jpeg' });
      form.append('apikey', OCR_API_KEY);
      form.append('language', 'eng');
      form.append('isOverlayRequired', 'false');
      form.append('scale', 'true');
      form.append('OCREngine', '2');

      log('Uploading to OCR.Space...');
      const resp = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form,
      });

      const duration = Date.now() - start;
      if (!resp.ok) {
        const txt = await resp.text();
        log(`HTTP ${resp.status}: ${txt}`);
        Alert.alert('OCR request failed', `HTTP ${resp.status}`);
        return '';
      }

      const data = await resp.json();
      const parsed = data?.ParsedResults?.[0];
      if (parsed && parsed.ParsedText) {
        log(`OCR success (${(duration / 1000).toFixed(2)}s)`);
        return parsed.ParsedText.trim();
      } else {
        log('No ParsedText in response: ' + JSON.stringify(data));
        return '';
      }
    } catch (err) {
      console.error('callOCRSpace error', err);
      Alert.alert('Network / OCR error', String(err));
      return '';
    } finally {
      setOcrLoading(false);
    }
  }

  function extractNamesFromText(text) {
    if (!text) return [];
    const rawLines = text.split(/\r?\n/);
    const lines = rawLines.map((ln) => ln.replace(/\u00A0/g, ' '));
    const results = [];
    const inlineRegex = /^\s*(STUDENT|STAFF)\b\s*[:\-–—]?\s*(.+)$/i;
    const labelOnlyRegex = /^\s*(STUDENT|STAFF)(?:\s+NAME)?\s*[:\-–—]?\s*$/i;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const mInline = line.match(inlineRegex);
      if (mInline) {
        const label = mInline[1].toUpperCase();
        const nameRaw = mInline[2].trim();
        const name = cleanName(nameRaw);
        if (name) results.push({ label, name });
        continue;
      }
      const mLabelOnly = line.match(labelOnlyRegex);
      if (mLabelOnly) {
        const label = mLabelOnly[1].toUpperCase();
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === '') j++;
        if (j < lines.length) {
          const next = lines[j].trim();
          const name = cleanName(next);
          if (name) results.push({ label, name });
        }
        continue;
      }
      const contains = line.match(/\b(STUDENT|STAFF)\b/i);
      if (contains) {
        const label = contains[1].toUpperCase();
        const after = line.split(new RegExp(`\\b${label}\\b`, 'i'))[1]?.trim();
        if (after) {
          const name = cleanName(after);
          if (name) {
            results.push({ label, name });
            continue;
          }
        }
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === '') j++;
        if (j < lines.length) {
          const name = cleanName(lines[j].trim());
          if (name) results.push({ label, name });
        }
      }
    }
    const unique = [];
    const seen = new Set();
    for (const r of results) {
      const key = `${r.label}::${r.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    }
    return unique;
  }

  function cleanName(s) {
    if (!s) return '';
    let out = s.trim();
    out = out.replace(/^(?:Name|NAME|Full Name)\s*[:\-–—]\s*/i, '');
    out = out.replace(/[\r\n]+/g, ' ').trim();
    if (out.length > 200) out = out.slice(0, 200).trim();
    return out;
  }

  async function handleScanId() {
    setExtractedTemp([]);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow camera access to scan the ID.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (res.canceled) return;
    const uri = res.assets[0].uri;
    const preset = highQuality ? PRESETS.high : PRESETS.fast;
    try {
      setOcrLoading(true);
      log('Starting ID scan...');
      const { uri: finalUri } = await compressSmart(uri, preset);
      const ocrText = await callOCRSpace(finalUri);
      if (!ocrText) {
        Alert.alert('No text detected', 'Could not extract text from the ID. Try again with better lighting.');
        return;
      }
      const names = extractNamesFromText(ocrText);
      if (names.length > 0) {
        const first = names[0].name;
        setName(first);
        setNameverify(first.length > 1);
      } else {
        Alert.alert('Name not found', 'Could not find STUDENT/STAFF name on the ID.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Scan error', String(err));
    } finally {
      setOcrLoading(false);
    }
  }

  const [extractedTemp, setExtractedTemp] = useState([]);


  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { fontFamily: 'Poppins-SemiBold' }]}>SignUp For</Text>
      <Text style={styles.heading}>Campus Pay!</Text>

      <View style={styles.main}>
        <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center' }}>
          <View
            style={{
              backgroundColor: colors.white,
              height: 90,
              width: 90,
              margin: 10,
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 90,
              padding: 4,
              position: 'absolute',
              top: -60,
              overflow: 'none',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            ) : (
              <Ionicons name="person" size={50} color="#333333" />
            )}
          </View>
        </TouchableOpacity>
        <View style={[{ marginTop: 40 }, styles.input]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="person" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Name"
            value={name}
            editable={false}
            onChangeText={handleNameverify}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handleScanId} style={{ paddingHorizontal: 10 }}>
            {ocrLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="id-card" size={22} color="#333" />
            )}
          </TouchableOpacity>
        </View>
        {name.length > 1 && !nameverify && (
          <Text style={styles.errorText}>Name must be at least 2 characters</Text>
        )}

        <View style={[{ marginTop: 20 }, styles.input]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="mail" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Email"
            value={email}
            onChangeText={handleEmailVerify}
            style={styles.textInput}
          />
        </View>
        {email.length > 1 && !emailVerify && (
          <Text style={styles.errorText}>Enter a valid email address</Text>
        )}

        <View style={[{ marginTop: 20 }, styles.input]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="key" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Password"
            value={password}
            onChangeText={handlePasswordValid}
            secureTextEntry={secure}
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.eyeWrapper} onPress={() => setSecure(!secure)}>
            <Ionicons name={secure ? 'eye-off' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>
        {password.length > 0 && !passwordValid && (
          <Text style={styles.errorText}>
            Password must be 8+ characters and contain letters and numbers
          </Text>
        )}

        <View style={[{ marginTop: 25 }, styles.input]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="key" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirm}
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.eyeWrapper} onPress={() => setSecureConfirm(!secureConfirm)}>
            <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>
        {confirmPassword.length > 0 && confirmPassword !== password && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <Text style={styles.logintxt}>SignUp</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
          <Text style={styles.noaccountText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/login')}>
            <Text style={styles.signuptext}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
          <Text style={styles.noaccountText}>Admin/Teacher?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
            <Text style={styles.signuptext}>SignUp Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 5,
  },
  heading: {
    color: colors.text,
    marginLeft: 20,
    fontSize: 32,
    lineHeight: 50,
    textAlign: 'left',
    fontFamily: 'Poppins-Bold',
  },
  main: {
    width: '90%',
    paddingVertical: 20,
    marginTop: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 15,
    backgroundColor: 'white',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  iconWrapper: {
    backgroundColor: colors.background,
    height: 30,
    width: 30,
    marginTop: 0,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeWrapper: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '30%',
    height: 45,
    borderRadius: 22,
    alignSelf: 'center',
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  logintxt: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },
  noaccountText: {
    fontFamily: 'Poppins-Regular',
    color: colors.white,
  },
  signuptext: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondary,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 25,
    marginTop: 5,
  },
});