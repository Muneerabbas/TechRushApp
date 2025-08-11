import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const OCR_API_KEY = 'K81881684388957';
const PRESETS = {
  fast: { targetBytes: 120 * 1024, minWidth: 800 },
  high: { targetBytes: 450 * 1024, minWidth: 1200 },
};

async function compressSmart(uri, preset, log, steps) {
  const startTime = Date.now();
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

async function callOCRSpace(uri, log) {
  if (!OCR_API_KEY) {
    Alert.alert('API key missing', 'Set your OCR.Space API key in code.');
    return '';
  }

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
    throw err;
  }
}

function cleanName(s) {
  if (!s) return '';
  let out = s.trim();
  out = out.replace(/^(?:Name|NAME|Full Name)\s*[:\-–—]\s*/i, '');
  out = out.replace(/[\r\n]+/g, ' ').trim();
  if (out.length > 200) out = out.slice(0, 200).trim();
  return out;
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

export const scanIdCard = async (highQuality, log) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please allow camera access to scan the ID.');
    return null;
  }
  const res = await ImagePicker.launchCameraAsync({ quality: 1 });
  if (res.canceled) return null;
  
  const uri = res.assets[0].uri;
  const preset = highQuality ? PRESETS.high : PRESETS.fast;
  
  try {
    log('Starting ID scan...');
    const { uri: finalUri, steps } = await compressSmart(uri, preset, log, []);
    const ocrText = await callOCRSpace(finalUri, log);
    
    if (!ocrText) {
      Alert.alert('No text detected', 'Could not extract text from the ID. Try again with better lighting.');
      return null;
    }
    
    const names = extractNamesFromText(ocrText);
    if (names.length > 0) {
      return names[0].name;
    } else {
      Alert.alert('Name not found', 'Could not find STUDENT/STAFF name on the ID.');
      return null;
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Scan error', String(err));
    throw err;
  }
};
