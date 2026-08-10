import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingOverlay from '../components/LoadingOverlay';
import { prepareImageForUpload, persistImage } from '../image';
import { scanHealth, scanFood, pingServer } from '../api';
import { getSettings, saveScan, uid } from '../storage';
import { colors, gradients, radii, shadow3D } from '../theme';

const MODE_CONFIG = {
  health: {
    title: 'Health Scanner',
    instruction: 'Position the skin area inside the frame',
    icon: 'medical-outline',
  },
  food: {
    title: 'Food Scanner',
    instruction: 'Position the food inside the frame',
    icon: 'nutrition-outline',
  },
};

export default function ScannerScreen({ route, navigation, mode: modeProp }) {
  const mode = modeProp || route.params?.mode || 'health';
  const config = MODE_CONFIG[mode];

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [capturing, setCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const cameraRef = useRef(null);

  const analyze = async (sourceUri) => {
    setCapturing(true);
    setLoading(true);
    try {
      const online = await pingServer();
      if (!online) {
        Alert.alert(
          'Server offline',
          'Could not reach the Heal Scan AI server. Make sure it is running and try again.'
        );
        return;
      }
      const prepared = await prepareImageForUpload(sourceUri);
      const result =
        mode === 'health'
          ? await scanHealth(prepared.dataUrl)
          : await scanFood(prepared.dataUrl);

      const id = uid();
      const persistedUri = await persistImage(prepared.uri, id);
      const settings = await getSettings();

      let record = {
        id,
        type: mode,
        title: result.title || (mode === 'health' ? 'Health Scan' : 'Food Scan'),
        imageUri: persistedUri,
        result,
      };
      if (settings.saveHistory !== false) {
        record = await saveScan(record);
      }

      navigation.replace(
        mode === 'health' ? 'HealthResult' : 'FoodResult',
        { record, autoSaved: true }
      );
    } catch (e) {
      Alert.alert('Analysis failed', e.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
      setCapturing(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || capturing) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      await analyze(photo.uri);
    } catch (e) {
      Alert.alert('Camera error', 'Could not capture photo.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
      if (!res.canceled && res.assets.length > 0) {
        setPreview(res.assets[0].uri);
        await analyze(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Gallery error', 'Could not open photo library.');
    }
  };

  if (!permission) return <View style={styles.flex} />;

  if (!permission.granted) {
    return (
      <View style={[styles.flex, styles.permissionWrap]}>
        <LinearGradient colors={gradients.primary} style={styles.permissionIcon}>
          <Ionicons name="camera-outline" size={44} color="#fff" />
        </LinearGradient>
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionSub}>
          Heal Scan uses your camera to scan symptoms and food. Your photos never
          leave your device without your action.
        </Text>
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {preview ? (
        <Image source={{ uri: preview }} style={styles.flex} resizeMode="cover" />
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.flex}
          facing={facing}
          flash={flash}
          mode="picture"
        />
      )}

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            style={styles.topBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
          <View style={styles.topTitleWrap}>
            <Text style={styles.topTitle}>{config.title}</Text>
          </View>
          <Pressable style={styles.topBtn} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}>
            <Ionicons
              name={flash === 'on' ? 'flash' : 'flash-outline'}
              size={24}
              color={flash === 'on' ? colors.warning : '#fff'}
            />
          </Pressable>
        </View>

        <View style={styles.frameArea}>
          <View style={styles.instructionPill}>
            <Ionicons name={config.icon} size={16} color={colors.neonSky} />
            <Text style={styles.instruction}>{config.instruction}</Text>
          </View>

          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <View style={styles.frameTint} />
          </View>

          <Text style={styles.helper}>
            Hold steady • Good lighting helps accuracy
          </Text>
        </View>

        <View style={styles.bottomBar}>
          <Pressable style={styles.sideBtn} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={24} color="#fff" />
            <Text style={styles.sideLabel}>Gallery</Text>
          </Pressable>

          <Pressable
            style={[styles.captureBtnWrap, shadow3D]}
            onPress={takePicture}
            disabled={capturing}
          >
            <LinearGradient
              colors={gradients.scan}
              style={styles.captureBtn}
            >
              <View style={styles.captureInner} />
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.sideBtn}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            <Text style={styles.sideLabel}>Flip</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <LoadingOverlay
        visible={loading}
        message={mode === 'health' ? 'Analyzing symptom...' : 'Analyzing food...'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  overlay: { ...StyleSheet.absoluteFillObject },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitleWrap: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  topTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  frameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(0,163,255,0.4)',
    marginBottom: 18,
  },
  instruction: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Poppins_500Medium',
  },
  frame: {
    width: 300,
    height: 340,
    borderRadius: 24,
    overflow: 'hidden',
  },
  frameTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,163,255,0.06)',
  },
  corner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderColor: colors.neonSky,
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 14 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 14 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 14 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 14 },
  helper: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 18,
    fontFamily: 'Poppins_400Regular',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingVertical: 22,
  },
  sideBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sideLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Poppins_500Medium',
  },
  captureBtnWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(0,163,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  permissionWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  permissionIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  permissionSub: {
    color: colors.textSoft,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 26,
    fontFamily: 'Poppins_400Regular',
  },
  permissionBtn: {
    backgroundColor: colors.neonBlue,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: radii.pill,
  },
  permissionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
});
