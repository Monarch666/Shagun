export interface CeremonyPreset {
  id: string;
  name: string;
  description: string;
  defaultVenue: string;
  suggestedDurationHours: number;
}

export interface TraditionCategory {
  id: string;
  title: string;
  subtitle: string;
  blessingTerm: string; // e.g. "Blessings & Wishes" / "Dua & Mubarak" / "Ashirwad" / "Ardas"
  ceremonies: CeremonyPreset[];
}

export const TRADITION_PRESETS: Record<string, TraditionCategory> = {
  all_faith: {
    id: 'all_faith',
    title: 'Interfaith / Contemporary Celebration',
    subtitle: 'Warm, modern celebrations welcoming family and friends of all backgrounds',
    blessingTerm: 'Blessings & Wishes',
    ceremonies: [
      {
        id: 'welcome_dinner',
        name: 'Welcome Dinner & Cocktails',
        description: 'An informal evening to welcome family and out-of-town guests.',
        defaultVenue: 'Garden Lawns & Terrace',
        suggestedDurationHours: 4,
      },
      {
        id: 'musical_night',
        name: 'Sangeet & Musical Evening',
        description: 'Music, performances, and dance celebrations together.',
        defaultVenue: 'Grand Ballroom',
        suggestedDurationHours: 5,
      },
      {
        id: 'wedding_ceremony',
        name: 'Wedding Ceremony & Vow Exchange',
        description: 'The union ceremony and celebration of vows.',
        defaultVenue: 'The Central Pavilion',
        suggestedDurationHours: 3,
      },
      {
        id: 'reception_dinner',
        name: 'Reception Dinner & Toast',
        description: 'Dinner, toasts, speeches, and collective celebration.',
        defaultVenue: 'The Grand Banquet Hall',
        suggestedDurationHours: 4,
      },
    ],
  },
  muslim: {
    id: 'muslim',
    title: 'Muslim / Nikah & Walima',
    subtitle: 'Sacred Nikah vows and celebratory Walima feast with Duas and Mubarak',
    blessingTerm: 'Duas & Mubarak',
    ceremonies: [
      {
        id: 'manjha_mehendi',
        name: 'Manjha & Mehendi Celebration',
        description: 'Turmeric and henna celebration with close family and folk songs.',
        defaultVenue: 'Courtyard Hall',
        suggestedDurationHours: 4,
      },
      {
        id: 'nikah_ceremony',
        name: 'Nikah Ceremony (Qubool Hai)',
        description: 'Solemnization of marriage, signing of the Nikahnama, and Khutbah.',
        defaultVenue: 'Grand Nikah Pavilion',
        suggestedDurationHours: 3,
      },
      {
        id: 'walima_banquet',
        name: 'Dawat-e-Walima (Reception Banquet)',
        description: 'The auspicious feast and reception hosted to celebrate the marriage.',
        defaultVenue: 'Royal Banquet Hall',
        suggestedDurationHours: 5,
      },
    ],
  },
  christian: {
    id: 'christian',
    title: 'Christian / Holy Matrimony',
    subtitle: 'Church service, solemn exchange of vows, rings, and festive reception',
    blessingTerm: 'Blessings & Grace',
    ceremonies: [
      {
        id: 'roce_shower',
        name: 'Roce / Bridal Shower',
        description: 'Traditional coconut milk blessing and bridal celebration.',
        defaultVenue: 'Family Residence & Garden',
        suggestedDurationHours: 3,
      },
      {
        id: 'church_nuptials',
        name: 'Holy Matrimony & Nuptial Mass',
        description: 'Solemn exchange of vows, blessing of rings, and Holy Communion.',
        defaultVenue: 'St. Mary’s Cathedral / Church',
        suggestedDurationHours: 2,
      },
      {
        id: 'wedding_reception',
        name: 'Wedding Reception, First Dance & Toast',
        description: 'Cake cutting, first dance, speeches, banquet dinner, and dancing.',
        defaultVenue: 'The Ballroom Lawns',
        suggestedDurationHours: 5,
      },
    ],
  },
  sikh: {
    id: 'sikh',
    title: 'Sikh / Anand Karaj',
    subtitle: 'Sacred bliss of Anand Karaj at Gurdwara with Lavan and Ardas',
    blessingTerm: 'Ardas & Blessings',
    ceremonies: [
      {
        id: 'maiyan_sangeet',
        name: 'Maiyan & Sangeet',
        description: 'Rangoli, oil cleansing ceremony, and lively musical celebrations.',
        defaultVenue: 'Banquet Terrace',
        suggestedDurationHours: 4,
      },
      {
        id: 'anand_karaj',
        name: 'Anand Karaj (Gurdwara Ceremony)',
        description: 'The four sacred Lavan around the Guru Granth Sahib and Ardas.',
        defaultVenue: 'Gurdwara Sahib Hall',
        suggestedDurationHours: 3,
      },
      {
        id: 'reception_dinner',
        name: 'Wedding Reception Dinner',
        description: 'Evening banquet and celebration with family and friends.',
        defaultVenue: 'Grand Palace Lawns',
        suggestedDurationHours: 4,
      },
    ],
  },
  hindu: {
    id: 'hindu',
    title: 'Hindu & Vedic Traditions',
    subtitle: 'Festive multi-day ceremonies including Sangeet, Haldi, Varmala, and Pheras',
    blessingTerm: 'Blessings & Ashirwad',
    ceremonies: [
      {
        id: 'haldi_mehendi',
        name: 'Haldi & Mehendi Celebration',
        description: 'Turmeric cleansing, henna applications, and daytime celebration.',
        defaultVenue: 'Courtyard Poolside',
        suggestedDurationHours: 4,
      },
      {
        id: 'sangeet_night',
        name: 'Sangeet & Dance Night',
        description: 'Family dance performances, music, and celebration.',
        defaultVenue: 'Chandra Mahal Ballroom',
        suggestedDurationHours: 5,
      },
      {
        id: 'varmala_pheras',
        name: 'Wedding Ceremony (Varmala & Pheras)',
        description: 'Garland exchange, sacred fire circumambulation (Saptapadi), and blessings.',
        defaultVenue: 'Lakeside Mandap',
        suggestedDurationHours: 4,
      },
      {
        id: 'reception_dinner',
        name: 'Reception Dinner',
        description: 'Dinner banquet welcoming all extended family and community members.',
        defaultVenue: 'Palace Gardens & Lawns',
        suggestedDurationHours: 4,
      },
    ],
  },
};

