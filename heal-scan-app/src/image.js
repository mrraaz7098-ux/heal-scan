import { manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

export async function prepareImageForUpload(uri, maxWidth = 1080) {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: 0.7, format: 'jpeg', base64: true }
  );
  return {
    dataUrl: `data:image/jpeg;base64,${result.base64}`,
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

export async function persistImage(uri, id) {
  try {
    const dir = `${FileSystem.documentDirectory}scans/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const dest = `${dir}${id}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch (e) {
    return uri;
  }
}
