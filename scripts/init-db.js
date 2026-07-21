const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDB() {
  console.log('Connecting to PostgreSQL database using configuration object...');
  const client = new Client({
    user: 'postgres',
    password: '*kB%.2ANtPf?HZ8',
    host: 'db.fykhrbfbhecytqetyudk.supabase.co',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');

    // Read and run schema.sql
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Running base schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      await client.query(`
        create extension if not exists postgis;
        create extension if not exists pgcrypto;
      `);
      
      try {
        await client.query(schemaSql);
        console.log('Base Schema executed successfully.');
      } catch (err) {
        console.log('Schema notice (some existing tables skipped):', err.message);
      }
    }

    // Apply Schema Alterations for new feature fields
    console.log('Applying feature column enhancements...');
    const alterQueries = `
      -- Profiles update
      alter table profiles add column if not exists role text default 'rider';
      alter table profiles add column if not exists full_name text;

      -- Listings update for contact info, multiple images & shop relation
      alter table listings add column if not exists contact_name text;
      alter table listings add column if not exists contact_phone text;
      alter table listings add column if not exists images text[];
      alter table listings add column if not exists shop_id uuid references shops(id) on delete cascade;

      -- Events update for images & registration form configuration
      alter table events add column if not exists images text[];
      alter table events add column if not exists has_registration_form boolean default true;
      alter table events add column if not exists registration_instructions text;

      -- Tours update for images & location
      alter table tours add column if not exists images text[];
      alter table tours add column if not exists location text;
      alter table tours add column if not exists company_name text;

      -- Posts update for multiple media images
      alter table posts add column if not exists images text[];
      alter table posts add column if not exists author_name text;
      alter table posts add column if not exists author_avatar text;
      alter table posts add column if not exists author_role text;

      -- Shops update
      alter table shops add column if not exists image_url text;
    `;
    await client.query(alterQueries);
    console.log('Feature enhancements applied successfully.');

    // Seed Data
    console.log('Seeding initial Kathmandu trails, events, shops, tours, and listings...');

    // 1. Trails
    await client.query(`
      insert into trails (slug, name, description, location_text, distance_km, elevation_gain_m, difficulty, trail_type, avg_rating, status)
      values 
      ('nagarjun-forest-loop', 'Nagarjun Forest Loop', 'Dense jungle canopy, punchy climbs, singletrack descent inside Shivapuri Nagarjun National Park.', 'Shivapuri Nagarjun National Park, Kathmandu', 18, 650, 'blue', 'xc', 4.7, 'verified'),
      ('godavari-phulchowki-climb', 'Godavari to Phulchowki Climb', 'The ultimate summit challenge in Kathmandu Valley reaching 2760m elevation with rocky downhill tracks.', 'Godavari, Lalitpur', 22, 1250, 'black', 'enduro', 4.9, 'verified'),
      ('lakuri-bhanjyang-outer-rim', 'Lakuri Bhanjyang Outer Rim', 'Panoramic Himalayan views facing Langtang, technical rock gardens, fast village fire roads.', 'Bhaktapur / Lalitpur Rim', 32, 890, 'blue', 'xc', 4.6, 'verified'),
      ('kakani-singla-enduro', 'Kakani Singla Enduro', 'Pine needle singletrack, flowy berms, famous trout farming stopover, fast descent to Trishuli highway.', 'Kakani, Nuwakot', 14, 450, 'black', 'enduro', 4.8, 'verified'),
      ('shivapuri-peak-trail', 'Shivapuri Peak & Bishnudwar', 'Hike-a-bike section to Nagi Gumba and sacred Bishnudwar stream headwaters. High technical difficulty.', 'Budhanilkantha, Kathmandu', 16, 920, 'double_black', 'enduro', 4.8, 'verified')
      on conflict (slug) do update set name = excluded.name;
    `);

    // 2. Events
    await client.query(`
      insert into events (slug, title, description, event_type, start_at, location_text, difficulty, distance_km, max_participants, registration_fee, images, has_registration_form)
      values 
      ('kathmandu-kora-2026', 'Kathmandu Kora Cycling Challenge 2026', 'Nepal biggest charity cycling event. 50k, 75k, and 100k routes around the valley rim raising funds for rural healthcare.', 'charity', '2026-07-19 06:00:00+00', 'Kathmandu Valley Rim', 'blue', 50, 5000, 0, array['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'], true),
      ('ratnange-enduro-2026', 'Ratnange Enduro Stage Race', 'Timed downhill stage race on custom trail builds in Ratnange. Full face helmet & armor mandatory.', 'enduro', '2026-09-20 08:00:00+00', 'Ratnange, Kathmandu', 'black', 20, 150, 1500, array['https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800'], true),
      ('monsoon-madness-pokhara', 'Monsoon Madness XC & Downhill', 'Slippery mud, root sections, high energy crowd racing along Sarangkot ridge.', 'race', '2026-08-15 07:30:00+00', 'Pokhara Ridge', 'blue', 30, 200, 1000, array['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800'], true)
      on conflict (slug) do update set title = excluded.title;
    `);

    // 3. Shops
    await client.query(`
      insert into shops (slug, name, type, description, location_text, address, phone, whatsapp, image_url)
      values 
      ('epic-mountain-bike-thamel', 'Epic Mountain Bike Nepal', 'shop', 'Full service bike shop, high end Santa Cruz and Trek rentals, suspension tuning, and certified guides.', 'Thamel, Kathmandu', 'Z-Street, Thamel, Kathmandu', '+977-9801234567', '+977-9801234567', 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'),
      ('himalayan-singletrack-lhotseshop', 'Himalayan Singletrack Hub', 'workshop', 'Custom wheel building, hydraulic brake bleed service, Shimano & SRAM spare parts inventory.', 'Jhamsikhel, Lalitpur', 'Jhamsikhel Road, Lalitpur', '+977-9841987654', '+977-9841987654', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800'),
      ('pokhara-trail-head-rentals', 'Pokhara Trailhead Bikes & Gear', 'rental', 'E-bikes, Enduro mountain bikes for Upper Mustang tours, guided day rides.', 'Lakeside, Pokhara', 'Lakeside Street 6, Pokhara', '+977-9812345678', '+977-9812345678', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800')
      on conflict (slug) do update set name = excluded.name;
    `);

    // 4. Tours
    await client.query(`
      insert into tours (slug, title, location, company_name, days, difficulty, price, itinerary, images)
      values 
      ('upper-mustang-mtb-expedition', 'Upper Mustang Forbidden Kingdom MTB Expedition', 'Upper Mustang, Nepal', 'Himalayan Singletrack Tours', 12, 'black', 245000, 
       '[{"day": 1, "title": "Fly to Jomsom & Ride to Kagbeni", "desc": "Assemble bikes, test ride along Kali Gandaki riverbed to Kagbeni ancient gateway."}, {"day": 2, "title": "Kagbeni to Chele", "desc": "Climb over steep Himalayan passes, enter restricted Upper Mustang territory."}, {"day": 3, "title": "Chele to Syangboche", "desc": "Technical singletrack descents into reddish canyon gorges."}, {"day": 4, "title": "Lo Manthang Walled City Arrival", "desc": "Ride through ancient royal Mustang palaces and cave monasteries."}]'::jsonb,
       array['https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=800', 'https://images.unsplash.com/photo-1544191696-102ab03d4c01?q=80&w=800']
      ),
      ('annapurna-circuit-thorong-la-pass', 'Annapurna Circuit & Thorong La Pass (5416m)', 'Manang & Mustang', 'Epic Nepal Adventures', 10, 'double_black', 185000,
       '[{"day": 1, "title": "Besi Sahar to Chame", "desc": "Warm up ride through waterfalls and lush Marsyangdi river valley."}, {"day": 2, "title": "Chame to Manang (3540m)", "desc": "High altitude acclimatization ride under Annapurna massif."}, {"day": 3, "title": "Thorong Phedi to Pass Summit", "desc": "Epic hike-a-bike over 5416m pass followed by 2000m continuous singletrack descent to Muktinath!"}]'::jsonb,
       array['https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800']
      )
      on conflict (slug) do update set title = excluded.title;
    `);

    // 5. Marketplace Listings
    await client.query(`
      insert into listings (title, category, condition, price, description, location_text, contact_name, contact_phone, images)
      values 
      ('Santa Cruz Megatower C 2024 Enduro Bike', 'bike', 'Like New', 420000, 'Fox 38 Factory fork, RockShox Super Deluxe Select+, SRAM GX Eagle 12spd. Serviced regularly at Epic Thamel.', 'Kathmandu', 'Aarav Shrestha', '+977-9801122334', array['https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800', 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800']),
      ('Fox Racing Dropframe Pro Helmet (Medium)', 'accessory', 'Good', 18500, 'Used for one season in Kakani. No crashes, clean padding, MIPS technology.', 'Lalitpur', 'Sajan Maharjan', '+977-9841556677', array['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800']),
      ('SRAM GX Eagle 12-Speed Cassette 10-52T', 'component', 'Brand New', 22000, 'Brand new in box, unused build spare.', 'Kathmandu', 'Rohan Gurung', '+977-9812998877', array['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800'])
    `);

    // 6. Community Posts
    await client.query(`
      insert into posts (content, author_name, author_avatar, author_role, images)
      values 
      ('Crisp morning ride up Nagarjun forest loop! Trail conditions are 10/10 dry and tacky after yesterday rain. Who is hitting Godavari this weekend?', 'Pasang Sherpa', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', 'rider', array['https://images.unsplash.com/photo-1544191696-102ab03d4c01?q=80&w=800']),
      ('Just restocked new Maxxis Assegai & Minion DHR tires at Epic Mountain Bike Thamel! Drop by if you need fresh rubber before Kathmandu Kora.', 'Bikash (Epic MTB)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 'shop_owner', array['https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'])
    `);

    console.log('Database initialization & seeding completed successfully!');
  } catch (error) {
    console.error('Database Initialization Error:', error);
  } finally {
    await client.end();
  }
}

initDB();
