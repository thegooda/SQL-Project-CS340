// app.js
// Main server file for CS340 Project Step 3
// Team Uma Sim: Tom Haney and Philip Nguyen

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7878; // Change this to your assigned port

// Configure Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ==================== ROUTES ====================

// Home/Index page - lists all available pages
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Horse Racing Database'
    });
});

// ==================== HORSES ROUTES ====================

const db = require('./db');

app.get('/horses', async (req, res) => {
    try {
        const [horses] = await db.query(`
            SELECT h.horse_id, h.name, h.base_speed, h.base_stamina, h.base_gut, 
                h.base_strength, h.base_wit, h.style, h.preferred_race_distance, 
                h.preferred_race_surface, h.card_id, sc.name AS support_card_name
            FROM Horses h
            LEFT JOIN Support_Cards sc ON h.card_id = sc.card_id
            ORDER BY h.name
        `);

        res.render('horses', { title: 'Browse Horses', horses });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching horses');
    }
});

// Add horse form
app.get('/horses/add', async (req, res) => {
  try {
    const [cards] = await db.query(`SELECT card_id, name FROM Support_Cards ORDER BY name;`);
    res.render('horses_add', { title: 'Add New Horse', cards });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Edit horse form
app.get('/horses/edit/:id', async (req, res) => {
  try {
    const [horseRows] = await db.query(`SELECT * FROM Horses WHERE horse_id = ?`, [req.params.id]);
    const [cards] = await db.query(`SELECT card_id, name FROM Support_Cards ORDER BY name;`);
    if (horseRows.length === 0) return res.status(404).send('Horse not found');
    res.render('horses_edit', { title: 'Edit Horse', horse: horseRows[0], cards });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Delete horse form
app.get('/horses/delete/:id', async (req, res) => {
  try {
    const [horseRows] = await db.query(`
      SELECT h.horse_id, h.name, h.base_speed, h.base_stamina, h.base_gut,
             h.base_strength, h.base_wit, h.style, h.preferred_race_distance,
             h.preferred_race_surface, h.card_id, sc.name AS support_card_name
      FROM Horses h
      LEFT JOIN Support_Cards sc ON h.card_id = sc.card_id
      WHERE h.horse_id = ?
    `, [req.params.id]);

    if (horseRows.length === 0) return res.status(404).send('Horse not found');

    // Make sure the object passed has all the fields
    const horse = horseRows[0];
    res.render('horses_delete', { title: 'Delete Horse', horse });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while loading horse');
  }
});

// ==================== RACES ROUTES ====================

// Browse all races
app.get('/races', async (req, res) => {
  try {
    const [races] = await db.query(`
      SELECT race_id, name, surface_type, distance
      FROM Races
      ORDER BY name;
    `);
    res.render('races', { title: 'Browse Races', races });
  } catch (err) {
    console.error('Error fetching races:', err);
    res.status(500).send('Database error while fetching races.');
  }
});

// Render add race form
app.get('/races/add', (req, res) => {
  res.render('races_add', { title: 'Add New Race' });
});

// Render edit race form
app.get('/races/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Races WHERE race_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Race not found');
    }
    res.render('races_edit', { title: 'Edit Race', race: rows[0] });
  } catch (err) {
    console.error('Error loading race for edit:', err);
    res.status(500).send('Database error while loading race for edit.');
  }
});

// Render delete confirmation page
app.get('/races/delete/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Races WHERE race_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Race not found');
    }
    res.render('races_delete', { title: 'Delete Race', race: rows[0] });
  } catch (err) {
    console.error('Error loading race for delete:', err);
    res.status(500).send('Database error while loading race for delete.');
  }
});

// ==================== SUPPORT CARDS ROUTES ====================

// Browse all support cards
app.get('/support-cards', async (req, res) => {
  try {
    const [cards] = await db.query(`
      SELECT card_id, name, stat_boosted, boost_amount
      FROM Support_Cards
      ORDER BY name;
    `);
    res.render('support_cards', { title: 'Browse Support Cards', cards });
  } catch (err) {
    console.error('Error fetching support cards:', err);
    res.status(500).send('Database error while fetching support cards.');
  }
});

// Render add support card form
app.get('/support-cards/add', (req, res) => {
  res.render('support_cards_add', { title: 'Add New Support Card' });
});

// Render edit support card form
app.get('/support-cards/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Support_Cards WHERE card_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Support card not found');
    }
    res.render('support_cards_edit', { title: 'Edit Support Card', card: rows[0] });
  } catch (err) {
    console.error('Error loading support card for edit:', err);
    res.status(500).send('Database error while loading support card for edit.');
  }
});

// Render delete support card confirmation
app.get('/support-cards/delete/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Support_Cards WHERE card_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Support card not found');
    }
    res.render('support_cards_delete', { title: 'Delete Support Card', card: rows[0] });
  } catch (err) {
    console.error('Error loading support card for delete:', err);
    res.status(500).send('Database error while loading support card for delete.');
  }
});


// ==================== SPARKS ROUTES ====================

// Browse all sparks
app.get('/sparks', async (req, res) => {
  try {
    const [sparks] = await db.query(`
      SELECT spark_id, name, stat_boosted, star_amount
      FROM Sparks
      ORDER BY name;
    `);
    res.render('sparks', { title: 'Browse Sparks', sparks });
  } catch (err) {
    console.error('Error fetching sparks:', err);
    res.status(500).send('Database error while fetching sparks.');
  }
});

// Render add spark form
app.get('/sparks/add', (req, res) => {
  res.render('sparks_add', { title: 'Add New Spark' });
});

// Render edit spark form
app.get('/sparks/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Sparks WHERE spark_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Spark not found');
    }
    res.render('sparks_edit', { title: 'Edit Spark', spark: rows[0] });
  } catch (err) {
    console.error('Error loading spark for edit:', err);
    res.status(500).send('Database error while loading spark for edit.');
  }
});

// Render delete spark confirmation
app.get('/sparks/delete/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Sparks WHERE spark_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Spark not found');
    }
    res.render('sparks_delete', { title: 'Delete Spark', spark: rows[0] });
  } catch (err) {
    console.error('Error loading spark for delete:', err);
    res.status(500).send('Database error while loading spark for delete.');
  }
});


// ==================== RACESHORSES (M:N) ROUTES ====================

// Browse all race entries with horse and race names
app.get('/races-horses', async (req, res) => {
  try {
    const [entries] = await db.query(`
  SELECT rh.race_horse_id, rh.horse_id, h.name AS horse_name,
         rh.race_id, r.name AS race_name,
         r.surface_type, r.distance
    FROM RacesHorses rh
    JOIN Horses h ON rh.horse_id = h.horse_id
    JOIN Races r ON rh.race_id = r.race_id
    ORDER BY rh.race_horse_id;
`);
    res.render('races_horses', { title: 'Manage Horse Race Entries', entries });
  } catch (err) {
    console.error('Error fetching race entries:', err);
    res.status(500).send('Database error while fetching race entries.');
  }
});

// Render form to enter horse in a race
app.get('/races-horses/add', async (req, res) => {
  try {
    const [horses] = await db.query('SELECT horse_id, name FROM Horses ORDER BY name;');
    const [races] = await db.query('SELECT race_id, name FROM Races ORDER BY name;');
    res.render('races-horses_add', { title: 'Enter Horse in Race', horses, races });
  } catch (err) {
    console.error('Error loading horses or races for add:', err);
    res.status(500).send('Database error while loading horses or races.');
  }
});

// Render form to edit a specific race entry
app.get('/races-horses/edit/:id', async (req, res) => {
  try {
    // 1. Get the race entry
    const [rows] = await db.query(
      'SELECT * FROM RacesHorses WHERE race_horse_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).send('Race entry not found');
    }

    const entry = rows[0];

    // 2. Get all horses and races
    const [horses] = await db.query(
      'SELECT horse_id, name FROM Horses ORDER BY name;'
    );
    const [races] = await db.query(
      'SELECT race_id, name FROM Races ORDER BY name;'
    );

    // 3. Mark which horse and race should be selected
    horses.forEach(horse => {
      horse.selected = horse.horse_id === entry.horse_id ? 'selected' : '';
    });

    races.forEach(race => {
      race.selected = race.race_id === entry.race_id ? 'selected' : '';
    });

    // 4. Render the edit page
    res.render('races-horses_edit', {
      title: 'Edit Race Entry',
      entry,
      horses,
      races,
    });
  } catch (err) {
    console.error('Error loading race entry for edit:', err);
    res.status(500).send('Database error while loading race entry for edit.');
  }
});


// Render delete confirmation for a specific race entry
app.get('/races-horses/delete/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT rh.race_horse_id, rh.horse_id, h.name AS horse_name,
             rh.race_id, r.name AS race_name
      FROM RacesHorses rh
      JOIN Horses h ON rh.horse_id = h.horse_id
      JOIN Races r ON rh.race_id = r.race_id
      WHERE rh.race_horse_id = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).send('Race entry not found');

    const entry = rows[0];
    res.render('races-horses_delete', { title: 'Delete Race Entry', entry });
  } catch (err) {
    console.error('Error loading race entry for delete:', err);
    res.status(500).send('Database error while loading race entry for delete.');
  }
});


// ==================== HORSESSPARKS (M:N) ROUTES ====================

// Browse all horse-spark assignments
app.get('/horses-sparks', async (req, res) => {
    try {
        const [assignments] = await db.query(
            `SELECT hs.horse_spark_id, 
                    h.horse_id, h.name AS horse_name, 
                    s.spark_id, s.name AS spark_name,
                    s.stat_boosted, s.star_amount
             FROM HorsesSparks hs
             JOIN Horses h ON hs.horse_id = h.horse_id
             JOIN Sparks s ON hs.spark_id = s.spark_id
             ORDER BY h.name, s.name`
        );
        res.render('horses_sparks', { title: 'Manage Horse Sparks', assignments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving horse-spark assignments');
    }
});

// Add new horse-spark assignment
app.get('/horses-sparks/add', async (req, res) => {
    try {
        const [horses] = await db.query('SELECT horse_id, name FROM Horses ORDER BY name');
        const [sparks] = await db.query('SELECT spark_id, name FROM Sparks ORDER BY name');
        res.render('horses-sparks_add', { title: 'Assign Spark to Horse', horses, sparks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading add horse-spark page');
    }
});

// Edit a horse-spark assignment
app.get('/horses-sparks/edit/:id', async (req, res) => {
  try {
    const [assignmentRows] = await db.query(
      `SELECT hs.horse_spark_id, hs.horse_id, hs.spark_id,
              h.name AS horse_name, s.name AS spark_name
       FROM HorsesSparks hs
       JOIN Horses h ON hs.horse_id = h.horse_id
       JOIN Sparks s ON hs.spark_id = s.spark_id
       WHERE hs.horse_spark_id = ?`,
      [req.params.id]
    );

    if (assignmentRows.length === 0) return res.status(404).send('Assignment not found');

    const assignment = assignmentRows[0];
    const [horses] = await db.query('SELECT horse_id, name FROM Horses ORDER BY name');
    const [sparks] = await db.query('SELECT spark_id, name FROM Sparks ORDER BY name');

    // ✅ Mark the selected horse and spark
    horses.forEach(horse => {
      horse.selected = horse.horse_id === assignment.horse_id ? 'selected' : '';
    });

    sparks.forEach(spark => {
      spark.selected = spark.spark_id === assignment.spark_id ? 'selected' : '';
    });

    res.render('horses-sparks_edit', {
      title: 'Edit Horses to Sparks',
      assignment,
      horses,
      sparks
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading edit horse-spark page');
  }
});

// Delete a horse-spark assignment
app.get('/horses-sparks/delete/:id', async (req, res) => {
    try {
        const [assignmentRows] = await db.query(
            `SELECT hs.horse_spark_id, hs.horse_id, hs.spark_id, 
                    h.name AS horse_name, s.name AS spark_name
            FROM HorsesSparks hs
            JOIN Horses h ON hs.horse_id = h.horse_id
            JOIN Sparks s ON hs.spark_id = s.spark_id
            WHERE hs.horse_spark_id = ?`,
            [req.params.id]
        );

        if (assignmentRows.length === 0) return res.status(404).send('Assignment not found');

        const assignment = assignmentRows[0];
        res.render('horses-sparks_delete', { title: 'Delete Horses to Sparks', assignment });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading delete horse-spark page');
    }
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
});