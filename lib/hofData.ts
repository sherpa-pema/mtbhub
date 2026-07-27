export interface HofInductee {
  id: string;
  name: string;
  yearInducted: number;
  era: '1980s' | '1990s' | '2000s' | '2010s' | '2020s';
  category: 'Pioneers' | 'Downhill Champions' | 'Cross Country Legends' | 'Endurance & Altitude Records' | 'Trailbuilders & Conservationists';
  role: string;
  quote: string;
  imageUrl: string;
  highlights: string[];
  description: string;
}

export const HOF_DATA: HofInductee[] = [
  {
    id: 'first-ktm-pokhara',
    name: 'The 1988 Expedition',
    yearInducted: 1988,
    era: '1980s',
    category: 'Pioneers',
    role: 'Early Pioneers',
    quote: '"We didn\'t know if it was possible, we just knew we had to try."',
    imageUrl: 'https://images.unsplash.com/photo-1579294212574-e8b95da6a908?q=80&w=600',
    highlights: ['First recorded long-distance MTB trip in Nepal', 'Navigated purely by local advice and old mapping', 'Set the stage for future exploration'],
    description: 'A small group of intrepid cyclists undertook the first major recorded off-road mountain bike journey from Kathmandu to Pokhara, navigating through remote villages, carrying their own gear, and proving that Nepal\'s rugged terrain was rideable.'
  },
  {
    id: 'annapurna-dawn',
    name: 'Dawn of Annapurna Circuit Rides',
    yearInducted: 1997,
    era: '1990s',
    category: 'Pioneers',
    role: 'High-Altitude Trailblazers',
    quote: '"Pushing a bike over Thorong La was half the adventure."',
    imageUrl: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=600',
    highlights: ['Pioneered the Thorong La Pass at 5,416m on a bicycle', 'Opened the Annapurna Circuit to MTB tourism', 'Established high-altitude riding protocols'],
    description: 'In 1997, riders began systematically attempting the Annapurna Circuit on mountain bikes, crossing the formidable Thorong La pass. This marked the birth of high-altitude commercial mountain biking in Nepal.'
  },
  {
    id: 'yak-attack',
    name: 'Yak Attack Founders',
    yearInducted: 2007,
    era: '2000s',
    category: 'Endurance & Altitude Records',
    role: 'Race Organizers & First Participants',
    quote: '"The highest mountain bike race on Earth."',
    imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=600',
    highlights: ['Established the world\'s highest MTB stage race', 'Brought international competitive racing to the Himalayas', 'Tested human endurance to the absolute limit'],
    description: 'The inaugural Yak Attack race redefined extreme endurance sports. Traversing the Annapurna Circuit, it remains one of the toughest, highest, and most visually stunning mountain bike stage races globally.'
  },
  {
    id: 'rj-ripper',
    name: 'Rajesh Magar (RJ Ripper)',
    yearInducted: 2014,
    era: '2010s',
    category: 'Downhill Champions',
    role: 'National & Asian Continental Champion',
    quote: '"I build my own bikes because I wanted to fly."',
    imageUrl: 'https://images.unsplash.com/photo-1533561797500-4bad47320079?q=80&w=600',
    highlights: ['4-time Asian Continental Downhill Champion', 'Subject of the award-winning documentary "RJ Ripper"', 'Rose from a mechanic building scrap bikes to an international icon'],
    description: 'Rajesh Magar\'s story is the stuff of legend. Starting by welding together scrap metal to build a rudimentary downhill bike, RJ rose to dominate the Asian Downhill scene, putting Nepali talent on the global map.'
  },
  {
    id: 'pioneering-women',
    name: 'Aayushma Shrestha & Laxmi Magar',
    yearInducted: 2017,
    era: '2010s',
    category: 'Cross Country Legends',
    role: 'XC & Enduro Champions',
    quote: '"We ride to break barriers, not just records."',
    imageUrl: 'https://images.unsplash.com/photo-1522204683050-0a2569bd5fbc?q=80&w=600',
    highlights: ['First Nepali women to compete internationally in Enduro and XC', 'Multiple national championship titles', 'Inspiring the next generation of female riders'],
    description: 'Aayushma and Laxmi broke significant cultural and sporting barriers in Nepal. They dominated the local XC and Enduro scenes and represented Nepal internationally, becoming powerful role models for young female athletes.'
  },
  {
    id: 'ratnange',
    name: 'Ratnange Trail Community',
    yearInducted: 2021,
    era: '2020s',
    category: 'Trailbuilders & Conservationists',
    role: 'Community Trail Builders',
    quote: '"Built by the community, for the world."',
    imageUrl: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=600',
    highlights: ['Created a world-class DH/Enduro trail network in Phaplu', 'Community-driven eco-tourism initiative', 'Hosted the first Asian Enduro Series in Nepal'],
    description: 'The community of Phaplu banded together to transform Ratnange into a premier mountain biking destination. Their sustainable trail building efforts have created an international caliber Enduro network.'
  },
  {
    id: 'fkt-records',
    name: 'Himalayan FKT Setters',
    yearInducted: 2024,
    era: '2020s',
    category: 'Endurance & Altitude Records',
    role: 'Ultra-Endurance Athletes',
    quote: '"Speed in the Himalayas is about respecting the mountain."',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c4618c?q=80&w=600',
    highlights: ['Set new Fastest Known Times (FKT) for the Annapurna Circuit', 'Pushed the boundaries of unsupported ultra-endurance riding', 'Combined alpinism with mountain biking'],
    description: 'A new breed of athletes in 2024 began tackling the classic Himalayan loops with a focus on speed and minimalism, setting staggering Fastest Known Times (FKTs) on the Annapurna and Mustang circuits.'
  }
];
