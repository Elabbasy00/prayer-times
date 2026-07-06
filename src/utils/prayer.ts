import {
  Coordinates,
  CalculationMethod as AdhanMethod,
  PrayerTimes,
  Madhab as AdhanMadhab,
} from 'adhan';
import moment from 'moment-hijri';

import {
  Location,
  PrayerSettings,
  HijriDate,
  PrayerTimeEntry,
  CalculationMethod,
  GregorianDate,
} from '../types/prayer';
import { addMinutes } from './formatters';

// Map our string types to Adhan's objects
const getCalculationMethod = (method: CalculationMethod) => {
  switch (method) {
    case 'MuslimWorldLeague':
      return AdhanMethod.MuslimWorldLeague();
    case 'Egyptian':
      return AdhanMethod.Egyptian();
    case 'Karachi':
      return AdhanMethod.Karachi();
    case 'UmmAlQura':
      return AdhanMethod.UmmAlQura();
    case 'Dubai':
      return AdhanMethod.Dubai();
    case 'MoonsightingCommittee':
      return AdhanMethod.MoonsightingCommittee();
    case 'NorthAmerica':
      return AdhanMethod.NorthAmerica();
    case 'Kuwait':
      return AdhanMethod.Kuwait();
    case 'Qatar':
      return AdhanMethod.Qatar();
    case 'Singapore':
      return AdhanMethod.Singapore();
    case 'Tehran':
      return AdhanMethod.Tehran();
    case 'Turkey':
      return AdhanMethod.Turkey();
    case 'Other':
      return AdhanMethod.Other();
    default:
      return AdhanMethod.Egyptian();
  }
};

export const getPrayerTimes = (
  date: Date,
  location: Location,
  settings: PrayerSettings,
  language: string,
): PrayerTimeEntry[] => {
  const coordinates = new Coordinates(location.latitude, location.longitude);
  const params = getCalculationMethod(settings.calculationMethod);

  // Set Madhab
  params.madhab =
    settings.madhab === 'Hanafi' ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;

  // Set Adjustments
  params.adjustments.fajr = settings.adjustments.fajr;
  params.adjustments.sunrise = settings.adjustments.sunrise;
  params.adjustments.dhuhr = settings.adjustments.dhuhr;
  params.adjustments.asr = settings.adjustments.asr;
  params.adjustments.maghrib = settings.adjustments.maghrib;
  params.adjustments.isha = settings.adjustments.isha;

  // Create PrayerTimes instance
  // Adhan uses the date object passed to it.
  // If we want to support manual timezone, we might need to adjust the input date or the output.
  // Adhan returns times in the local system timezone of the device running the code.
  // If we want to force a timezone, we might need to shift the times.

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  // Shift a Date by the manual timezone offset (if enabled)
  const applyOffset = (time: Date): Date => {
    if (!settings.useManualTimezone) return time;
    // time is in the system/local timezone.
    // We want it as if the device were in the target timezone.
    // Shift: convert to UTC ms, then add the offset hours.
    const utcMs = time.getTime() + time.getTimezoneOffset() * 60000;
    return new Date(utcMs + settings.timezoneOffset * 3600000);
  };

  const formatTime = (time: Date): string => {
    const finalTime = moment(time).locale('en');

    let formatted = finalTime.format('h:mm A');
    if (language === 'ar') {
      formatted = formatted.replace('AM', 'ص').replace('PM', 'م');
    }
    return formatted;
  };

  // Apply offset to all raw times first
  const fajr = applyOffset(prayerTimes.fajr);
  const sunrise = applyOffset(prayerTimes.sunrise);
  const duha = applyOffset(addMinutes(prayerTimes.sunrise, 15));
  const dhuhr = applyOffset(prayerTimes.dhuhr);
  const asr = applyOffset(prayerTimes.asr);
  const maghrib = applyOffset(prayerTimes.maghrib);
  const isha = applyOffset(prayerTimes.isha);

  return [
    {
      name: 'Fajr',
      time: fajr,
      formatted: formatTime(fajr),
      iqama: addMinutes(fajr, settings.iqama.fajr),
    },
    {
      name: 'Sunrise',
      time: sunrise,
      formatted: formatTime(sunrise),
    },
    {
      name: 'Duha',
      time: duha,
      formatted: formatTime(duha),
    },
    {
      name: 'Dhuhr',
      time: dhuhr,
      formatted: formatTime(dhuhr),
      iqama: addMinutes(dhuhr, settings.iqama.dhuhr),
    },
    {
      name: 'Asr',
      time: asr,
      formatted: formatTime(asr),
      iqama: addMinutes(asr, settings.iqama.asr),
    },
    {
      name: 'Maghrib',
      time: maghrib,
      formatted: formatTime(maghrib),
      iqama: addMinutes(maghrib, settings.iqama.maghrib),
    },
    {
      name: 'Isha',
      time: isha,
      formatted: formatTime(isha),
      iqama: addMinutes(isha, settings.iqama.isha),
    },
  ];
};

export const getNextPrayer = (
  prayers: PrayerTimeEntry[],
  location: Location,
  settings: PrayerSettings,
  language: string,
): {
  current: PrayerTimeEntry;
  next: PrayerTimeEntry;
  phase: 'waiting' | 'adhan' | 'iqama';
} | null => {
  const now = new Date();

  // Find the first prayer where iqama has not passed yet (or time if no iqama)
  const nextIndex = prayers.findIndex(p =>
    p?.iqama ? p.iqama > now : p.time > now,
  );

  if (nextIndex === -1) {
    // All prayers for today passed.
    // The "Current" is Isha (last one).
    // The "Next" is Fajr of TOMORROW.

    // Calculate tomorrow's times
    const tomorrow = moment(now).add(1, 'day').toDate();
    const tomorrowPrayers = getPrayerTimes(
      tomorrow,
      location,
      settings,
      language,
    );
    const nextFajr = tomorrowPrayers[0]; // Fajr is the first one

    return {
      current: prayers[prayers.length - 1], // Isha
      next: nextFajr,
      phase: 'waiting',
    };
  }

  const nextPrayer = prayers[nextIndex];
  const prevPrayer =
    nextIndex === 0 ? prayers[prayers.length - 1] : prayers[nextIndex - 1];

  // Determine the current phase:
  // - If we're before the next adhan time: phase = 'waiting', current is prev, next is nextPrayer
  // - If we're past next adhan but before iqama: phase = 'iqama', current is nextPrayer (we're in it!)
  // - Note: 'adhan' phase could be a brief moment at exact adhan time, we'll treat it as part of 'iqama' window

  if (nextPrayer.time <= now && nextPrayer.iqama && nextPrayer.iqama > now) {
    // We are between adhan and iqama of this prayer
    return {
      current: nextPrayer,
      next: nextPrayer, // Still counting down to iqama
      phase: 'iqama',
    };
  }

  // We're waiting for the next prayer
  return {
    current: prevPrayer,
    next: nextPrayer,
    phase: 'waiting',
  };
};

export const getHijriDate = (
  date: Date,
  adjustment: number = 0,
  language: string = 'en',
): HijriDate => {
  const mEn = moment(date).locale('en');
  const mAr = moment(date).locale('ar-sa');

  if (adjustment) {
    mEn.add(adjustment, 'days');
    mAr.add(adjustment, 'days');
  }

  const isAr = language === 'ar';
  const monthName = isAr ? mAr.format('iMMMM') : mEn.format('iMMMM');
  const dayNameNum = mEn.format('iD');
  const yearStr = mEn.format('iYYYY');

  return {
    day: mEn.iDate(),
    month: mEn.iMonth(),
    year: parseInt(yearStr, 10),
    monthName,
    dayName: dayNameNum,
    formatted: `${dayNameNum} ${monthName}, ${yearStr}`,
  };
};

export const gregorianDate = (
  date: Date | string | number,
  language: string,
): GregorianDate => {
  const d = new Date(date);
  const isAr = language === 'ar';

  const mEn = moment(d).locale('en');
  const mAr = moment(d).locale('ar-sa');

  return {
    day: mEn.format('D'),
    dayName: isAr ? mAr.format('dddd') : mEn.format('dddd'),
    month: isAr ? mAr.format('MMMM') : mEn.format('MMMM'),
    year: mEn.format('YYYY'),
  };
};
