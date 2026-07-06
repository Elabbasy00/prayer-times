import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import { usePrayerStore } from '../store/prayerStore';
import { useUIStore } from '../store';
import { CalculationMethod } from '../types/prayer';
import { TRANSLATIONS, Language } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.secondaryLight,
            textAlign: 'auto',
            fontFamily: typography.fontFamily.bold,
          },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

const SettingRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text
        style={[
          styles.label,
          {
            color: colors.secondaryLight,
            fontFamily: typography.fontFamily.medium,
          },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};

export const PrayerSettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useUIStore();
  const { colors, typography } = useTheme();
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

  const { location, settings, setLocation, updateSettings } = usePrayerStore();

  // Local State for Explicit Save
  const [localLocation, setLocalLocation] = useState(location);
  const [localSettings, setLocalSettings] = useState(settings);

  const [latInput, setLatInput] = useState(location.latitude.toString());
  const [longInput, setLongInput] = useState(location.longitude.toString());
  const [cityInput, setCityInput] = useState(location.city || '');

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [methodModalVisible, setMethodModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const navigation = useNavigation();
  // Ordered list of iqama prayers for consistent rendering
  const iqamaPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

  // Sync local state when store changes (only if not dirty)
  useEffect(() => {
    if (!isDirty) {
      setLocalLocation(location);
      setLocalSettings(settings);
      setLatInput(location.latitude.toString());
      setLongInput(location.longitude.toString());
      setCityInput(location.city || '');
    }
  }, [location, settings, isDirty]);

  const handleSave = () => {
    const lat = parseFloat(latInput);
    const long = parseFloat(longInput);

    if (isNaN(lat) || isNaN(long)) {
      Alert.alert(t.error, 'Invalid coordinates');
      return;
    }

    // Commit to Store
    setLocation({
      ...localLocation,
      latitude: lat,
      longitude: long,
      city: cityInput,
    });

    updateSettings(localSettings);
    setIsDirty(false);

    Alert.alert(t.success, t.settingsSaved);
  };

  const handelChangeLanguage = (lang: string) => {
    try {
      setLanguage(lang);

      if (lang === 'ar') {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      } else {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
      setLanguageModalVisible(false);
    } catch (error: any) {
      Alert.alert(error?.message);
    }
  };
  const handleGetCurrentLocation = () => {
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setLatInput(latitude.toString());
        setLongInput(longitude.toString());

        let cityName = t.autoLocation;

        try {
          // Reverse Geocoding via OpenStreetMap (Nominatim)
          // Note: This requires internet. If offline, it falls back to "Auto Location"
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'PrayerTimesApp/1.0', // Required by OSM
              },
            },
          );
          const data = await response.json();
          if (data && data.address) {
            // Try to find the most relevant city name
            cityName =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              t.autoLocation;
          }
        } catch (error) {
          console.log('Reverse geocoding failed:', error);
          // Fallback is already set
        }

        setCityInput(cityName);

        setLocalLocation({
          ...localLocation,
          latitude,
          longitude,
          city: cityName,
          manual: false,
        });

        setLoadingLocation(false);
        Alert.alert(t.success, t.locationUpdated);
      },
      error => {
        setLoadingLocation(false);
        Alert.alert(t.error, `Location error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const methods: CalculationMethod[] = [
    'MuslimWorldLeague',
    'Egyptian',
    'Karachi',
    'UmmAlQura',
    'Dubai',
    'MoonsightingCommittee',
    'NorthAmerica',
    'Kuwait',
    'Qatar',
    'Singapore',
    'Tehran',
    'Turkey',
    'Other',
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* Language Section */}
      <SettingsSection title={t.language}>
        <SettingRow label={t.selectLanguage}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondaryLight }]}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Text
              style={{
                color: colors.textOnPrimary,
                fontFamily: typography.fontFamily.medium,
              }}
            >
              {language === 'ar' ? 'العربية' : 'English'}
            </Text>
          </TouchableOpacity>
        </SettingRow>
      </SettingsSection>

      <SettingsSection title={t.location}>
        <SettingRow label={t.manualEntry}>
          <Switch
            value={localLocation.manual}
            onValueChange={val =>
              setLocalLocation({ ...localLocation, manual: val })
            }
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </SettingRow>

        {!localLocation.manual && (
          <TouchableOpacity
            style={[styles.gpsButton, { backgroundColor: colors.secondary }]}
            onPress={handleGetCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text
                style={{
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontFamily: typography.fontFamily.bold,
                }}
              >
                {t.getCurrentLocation}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {localLocation.manual && (
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.inputLabel,
                  {
                    color: colors.textSecondary,

                    fontFamily: typography.fontFamily.regular,
                  },
                ]}
              >
                {t.cityName}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.secondaryLight,
                    borderColor: colors.border,

                    fontFamily: typography.fontFamily.regular,
                  },
                ]}
                value={cityInput}
                onChangeText={setCityInput}
                placeholder={t.cityName}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={styles.inputWrapper}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: colors.textSecondary,
                      textAlign: 'left',
                      fontFamily: typography.fontFamily.regular,
                    },
                  ]}
                >
                  {t.latitude}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.secondaryLight,
                      borderColor: colors.border,
                      textAlign: 'left',
                      fontFamily: typography.fontFamily.regular,
                    },
                  ]}
                  value={latInput}
                  onChangeText={setLatInput}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: colors.textSecondary,
                      textAlign: 'left',
                      fontFamily: typography.fontFamily.regular,
                    },
                  ]}
                >
                  {t.longitude}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.secondaryLight,
                      borderColor: colors.border,
                      textAlign: 'left',
                      fontFamily: typography.fontFamily.regular,
                    },
                  ]}
                  value={longInput}
                  onChangeText={setLongInput}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}
      </SettingsSection>

      <SettingsSection title={t.iqama}>
        {iqamaPrayers.map(prayer => (
          <View style={styles.inputWrapper} key={prayer}>
            <Text
              style={[
                styles.inputLabel,
                {
                  color: colors.textSecondary,

                  fontFamily: typography.fontFamily.regular,
                },
              ]}
            >
              {t.iqamaKey[`iqama${prayer}` as keyof typeof t.iqamaKey]}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.secondaryLight,
                  borderColor: colors.border,

                  fontFamily: typography.fontFamily.regular,
                },
              ]}
              value={localSettings.iqama[prayer].toString()}
              keyboardType="numeric"
              onChangeText={val => {
                setIsDirty(true);
                setLocalSettings(prev => ({
                  ...prev,
                  iqama: {
                    ...prev.iqama,
                    [prayer]: (val && parseInt(val, 10)) || 0,
                  },
                }));
              }}
              placeholder={
                t.iqamaKey[`iqama${prayer}` as keyof typeof t.iqamaKey]
              }
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        ))}
      </SettingsSection>

      <SettingsSection title={t.calculation}>
        <SettingRow label={t.method}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={() => setMethodModalVisible(true)}
          >
            <Text
              style={{
                color: colors.textOnPrimary,
                fontFamily: typography.fontFamily.medium,
              }}
            >
              {localSettings.calculationMethod}
            </Text>
          </TouchableOpacity>
        </SettingRow>

        <SettingRow label={t.madhab}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={() => {
              setLocalSettings({
                ...localSettings,
                madhab: localSettings.madhab === 'Shafi' ? 'Hanafi' : 'Shafi',
              });
            }}
          >
            <Text
              style={{
                color: colors.textOnPrimary,
                fontFamily: typography.fontFamily.medium,
              }}
            >
              {localSettings.madhab}
            </Text>
          </TouchableOpacity>
        </SettingRow>
      </SettingsSection>

      <SettingsSection title={t.timeDst}>
        <View style={{ paddingVertical: 8 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 8,
              textAlign: 'left',
              fontFamily: typography.fontFamily.regular,
            }}
          >
            {t.timeDisclaimer}
          </Text>
        </View>
        <SettingRow label={t.manualTimezone}>
          <Switch
            value={localSettings.useManualTimezone}
            onValueChange={val =>
              setLocalSettings({ ...localSettings, useManualTimezone: val })
            }
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </SettingRow>

        {localSettings.useManualTimezone && (
          <SettingRow label={t.offsetHours}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: colors.border }]}
                onPress={() =>
                  setLocalSettings({
                    ...localSettings,
                    timezoneOffset: localSettings.timezoneOffset - 0.5,
                  })
                }
              >
                <Text style={{ fontFamily: typography.fontFamily.bold }}>
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.valueText,
                  {
                    color: colors.text,
                    fontFamily: typography.fontFamily.bold,
                  },
                ]}
              >
                {localSettings.timezoneOffset}
              </Text>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: colors.border }]}
                onPress={() =>
                  setLocalSettings({
                    ...localSettings,
                    timezoneOffset: localSettings.timezoneOffset + 0.5,
                  })
                }
              >
                <Text style={{ fontFamily: typography.fontFamily.bold }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </SettingRow>
        )}
      </SettingsSection>

      {/* Save Button */}
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.secondary }]}
          onPress={handleSave}
        >
          <Text
            style={[
              styles.saveButtonText,
              { fontFamily: typography.fontFamily.bold },
            ]}
          >
            {t.save}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calculation Method Modal */}
      <Modal
        visible={methodModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMethodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, fontFamily: typography.fontFamily.bold },
              ]}
            >
              {t.selectMethod}
            </Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {methods.map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.modalItem,
                    {
                      borderBottomColor: colors.border,
                      backgroundColor:
                        localSettings.calculationMethod === method
                          ? colors.secondary
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setLocalSettings({
                      ...localSettings,
                      calculationMethod: method,
                    });
                    setMethodModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      textAlign: 'center',
                      fontFamily: typography.fontFamily.medium,
                    }}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setMethodModalVisible(false)}
            >
              <Text
                style={{
                  color: '#FFF',
                  fontFamily: typography.fontFamily.bold,
                }}
              >
                {t.close}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, fontFamily: typography.fontFamily.bold },
              ]}
            >
              {t.selectLanguage}
            </Text>

            <TouchableOpacity
              style={[styles.modalItem, { borderBottomColor: colors.border }]}
              onPress={() => handelChangeLanguage('en')}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: typography.fontFamily.medium,
                }}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalItem, { borderBottomColor: colors.border }]}
              onPress={() => handelChangeLanguage('ar')}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: typography.fontFamily.medium,
                }}
              >
                العربية
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text
                style={{
                  color: '#FFF',
                  fontFamily: typography.fontFamily.bold,
                }}
              >
                {t.close}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  section: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 12,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gpsButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  smallButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
