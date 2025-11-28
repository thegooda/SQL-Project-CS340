// app.js
// Main server file for CS340 Project Step 3
// Team Uma Sim: Tom Haney and Philip Nguyen

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7079; // Change this whatever port to be used

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
        const [results] = await db.query(`CALL PopulateHorses();`);
        const horses = results[0] // The first result should contain the actual data, second is metadata

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

// Add horse with user supplied data
app.post('/horses/add', async (req, res) => {
  // Account for null support card
  const card_id = req.body.card_id === "" ? null : req.body.card_id;

  try {
    await db.query(`CALL InsertHorse(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [req.body.horse_name, req.body.base_speed, req.body.base_stamina, req.body.base_gut,
      req.body.base_strength, req.body.base_wit, req.body.style, req.body.preferred_race_distance,
      req.body.preferred_race_surface, card_id]);
    
    res.redirect('/horses');
  } catch (err) {
    console.error('Error adding horse:', err);
    res.status(500).send('Database error while adding horse');
  }
});

// Edit horse form
app.get('/horses/edit/:id', async (req, res) => {
  try {
    const [results] = await db.query(`CALL GetHorseById(?);`, [req.params.id]);
    const horseRows = results[0];
    const [cards] = await db.query(`SELECT card_id, name FROM Support_Cards ORDER BY name;`);
    if (horseRows.length === 0) return res.status(404).send('Horse not found');
    res.render('horses_edit', { title: 'Edit Horse', horse: horseRows[0], cards });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Render delete horse confirmation page
app.get('/horses/delete/:id', async (req, res) => {
  try {
    const [results] = await db.query(`CALL GetHorseById(?);`, [req.params.id]);
    const rows = results[0];

    if (rows.length === 0) {
      return res.status(404).send('Horse not found');
    }
    
    res.render('horses_delete', { title: 'Delete Horse', horse: rows[0] });
  } catch (err) {
    console.error('Error loading horse for delete:', err);
    res.status(500).send('Database error while loading horse for delete.');
  }
});

// Post after user confirms the delete
app.post('/horses/delete/:id', async (req, res) => {
  console.log('POST /horses/delete/:id hit with id:', req.params.id);
  try {
    // Delete the horse
    const [result] = await db.query(`CALL DeleteHorseById(?);`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Horse not found or already deleted');
    }

    res.redirect('/horses');
  } catch (err) {
    console.error('Error deleting horse:', err);
    res.status(500).send('Database error while deleting horse: ' + err.message);
  }
});


// ==================== RACES ROUTES ====================

// Browse all races
app.get('/races', async (req, res) => {
  try {
    const [results] = await db.query(`CALL PopulateRaces();`);
    const races = results[0];

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

// Add race with user supplied data
app.post('/races/add', async (req, res) => {
  try {
    await db.query(`CALL InsertRace(?, ?, ?);`, [req.body.race_name, req.body.surface_type, req.body.distance]);

    res.redirect('/races');
  }
  catch (err) {
    console.error('Error adding horse:', err);
    res.status(500).send('Database error while adding race');
  }
});

// Render edit race form
app.get('/races/edit/:id', async (req, res) => {
  try {
    const [results] = await db.query('CALL GetRaceById(?);', [req.params.id]);
    const rows = results[0];
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
    const [results] = await db.query('CALL GetRaceById(?);', [req.params.id]);
    const rows = results[0];
    if (rows.length === 0) {
      return res.status(404).send('Race not found');
    }
    res.render('races_delete', { title: 'Delete Race', race: rows[0] });
  } catch (err) {
    console.error('Error loading race for delete:', err);
    res.status(500).send('Database error while loading race for delete.');
  }
});

// Post after user confirms the delete
app.post('/races/delete/:id', async (req, res) => {
  try {
    // Delete the race
    const [result] = await db.query(`CALL DeleteRaceById(?);`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Race not found or already deleted');
    }

    res.redirect('/races');
  } catch (err) {
    console.error('Error deleting race:', err);
    res.status(500).send('Database error while deleting race: ' + err.message);
  }
});

// ==================== SUPPORT CARDS ROUTES ====================

// Browse all support cards
app.get('/support-cards', async (req, res) => {
  try {
    const [results] = await db.query(`CALL PopulateSupportCards();`);
    const cards = results[0];
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

// Add support card with user supplied data
app.post('/support-cards/add', async (req, res) => {
  try {
    await db.query(`CALL InsertSupportCard(?, ?, ?);`,
      [req.body.name, req.body.stat_boosted, req.body.boost_amount]);
    
    res.redirect('/support-cards');
  } catch (err) {
    console.error('Error adding support card:', err);
    res.status(500).send('Database error while adding support card');
  }
});

// Render edit support card form
app.get('/support-cards/edit/:id', async (req, res) => {
  try {
    const [results] = await db.query('CALL GetSupportCardById(?);', [req.params.id]);
    const rows = results[0];
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
    const [results] = await db.query('CALL GetSupportCardById(?);', [req.params.id]);
    const rows = results[0];
    if (rows.length === 0) {
      return res.status(404).send('Support card not found');
    }
    res.render('support_cards_delete', { title: 'Delete Support Card', card: rows[0] });
  } catch (err) {
    console.error('Error loading support card for delete:', err);
    res.status(500).send('Database error while loading support card for delete.');
  }
});

// Post after user confirms the delete
app.post('/support-cards/delete/:id', async (req, res) => {
  try {
    // Delete the support card
    const [result] = await db.query(`CALL DeleteSupportCardById(?);`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Support card not found or already deleted');
    }

    res.redirect('/support-cards');
  } catch (err) {
    console.error('Error deleting support card:', err);
    res.status(500).send('Database error while deleting support card: ' + err.message);
  }
});

// ==================== SPARKS ROUTES ====================

// Browse all sparks
app.get('/sparks', async (req, res) => {
  try {
    const [results] = await db.query(`CALL PopulateSparks();`);
    const sparks = results[0];
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

// Add spark with user supplied data
app.post('/sparks/add', async (req, res) => {
  try {
    await db.query(`CALL InsertSpark(?, ?, ?);`, [req.body.spark_name, req.body.stat_boosted, req.body.star_amount]);

    res.redirect('/sparks');
  }
  catch (err) {
    console.error('Error adding horse:', err);
    res.status(500).send('Database error while adding spark');
  }
});

// Render edit spark form
app.get('/sparks/edit/:id', async (req, res) => {
  try {
    const [results] = await db.query(`CALL GetSparkById(?);`, [req.params.id]);
    const rows = results[0];
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
    const [results] = await db.query(`CALL GetSparkById(?);`, [req.params.id]);
    const rows = results[0];
    if (rows.length === 0) {
      return res.status(404).send('Spark not found');
    }
    res.render('sparks_delete', { title: 'Delete Spark', spark: rows[0] });
  } catch (err) {
    console.error('Error loading spark for delete:', err);
    res.status(500).send('Database error while loading spark for delete.');
  }
});

// Post after user confirms the delete
app.post('/sparks/delete/:id', async (req, res) => {
  try {
    // Delete the spark
    const [result] = await db.query(`CALL DeleteSparkById(?);`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Spark not found or already deleted');
    }

    res.redirect('/sparks');
  } catch (err) {
    console.error('Error deleting spark:', err);
    res.status(500).send('Database error while deleting spark: ' + err.message);
  }
});


// ==================== RACESHORSES (M:N) ROUTES ====================

// Browse all race entries with horse and race names
app.get('/races-horses', async (req, res) => {
  try {
    const [results] = await db.query(`CALL PopulateRacesHorses();`);
    const entries = results[0];
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
    const [results] = await db.query(`CALL GetRacesHorsesById(?);`, [req.params.id]);
    const rows = results[0];

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
    const [results] = await db.query(`CALL GetRacesHorsesDetailsById(?);`, [req.params.id]);
    const rows = results[0];

    if (rows.length === 0) return res.status(404).send('Race entry not found');

    const entry = rows[0];
    res.render('races-horses_delete', { title: 'Delete Race Entry', entry });
  } catch (err) {
    console.error('Error loading race entry for delete:', err);
    res.status(500).send('Database error while loading race entry for delete.');
  }
});

// Post after user confirms the delete
app.post('/races-horses/delete/:id', async (req, res) => {
  try {
    const [result] = await db.query(`CALL DeleteRacesHorsesById(?);`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Race entry not found or already deleted');
    }

    res.redirect('/races-horses');
  } catch (err) {
    console.error('Error deleting race entry:', err);
    res.status(500).send('Database error while deleting race entry: ' + err.message);
  }
});

// ==================== HORSESSPARKS (M:N) ROUTES ====================

// Browse all horse-spark assignments
app.get('/horses-sparks', async (req, res) => {
    try {
        const [results] = await db.query(`CALL PopulateHorsesSparks();`);
        const assignments = results[0];
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
    const [results] = await db.query('CALL GetRacesHorsesById(?);', [req.params.id]);
    const assignmentRows = results[0];

    if (assignmentRows.length === 0) return res.status(404).send('Assignment not found');

    const assignment = assignmentRows[0];

    const [horses] = await db.query('SELECT horse_id, name FROM Horses ORDER BY name');
    const [sparks] = await db.query('SELECT spark_id, name FROM Sparks ORDER BY name');

    // Mark the selected horse and spark
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
        const [results] = await db.query(`CALL GetHorsesSparksDetailsById(?);`,[req.params.id]);
        const assignmentRows = results[0];

        if (assignmentRows.length === 0) return res.status(404).send('Assignment not found');

        const assignment = assignmentRows[0];
        res.render('horses-sparks_delete', { title: 'Delete Horses to Sparks', assignment });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading delete horse-spark page');
    }
});

// Post after user confirms the delete
app.post('/horses-sparks/delete/:id', async (req, res) => {
  try {
    const [result] = await db.query(`CALL DeleteHorsesSparksById(?);`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Horse-spark assignment not found or already deleted');
    }

    res.redirect('/horses-sparks');
  } catch (err) {
    console.error('Error deleting horse-spark assignment:', err);
    res.status(500).send('Database error while deleting assignment: ' + err.message);
  }
});

// =================== RESET ROUTE =========================

app.get('/reset', (req, res) => {
  res.render('reset', { title: 'Reset Database' });
});

// Actually perform the reset
app.post('/reset', async (req, res) => {
  try {

    await db.query('CALL ResetTables();');

    res.redirect('/?reset=success');
  } catch (err) {
    console.error('Error resetting database:', err);
    res.status(500).send('Database error while resetting: ' + err.message);
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