import { AppDataSource } from '../data-source';
import * as fs from 'fs';
import * as path from 'path';

export async function loadInitialData(): Promise<void> {
  try {
    // Check if we already have data
    const coachCount = await AppDataSource.query('SELECT COUNT(*) FROM coaches');
    const quizCount = await AppDataSource.query('SELECT COUNT(*) FROM quiz_schema');
    
    if (parseInt(coachCount[0].count) > 0 || parseInt(quizCount[0].count) > 0) {
      console.log('📊 Database already has data, skipping initial data load');
      return;
    }

    console.log('📥 Loading initial data from SQL files...');

    const dataDir = path.join(__dirname, '../../data');
    
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️  No data directory found, skipping initial data load');
      return;
    }

    // Get all SQL files and sort them alphabetically
    const sqlFiles = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (sqlFiles.length === 0) {
      console.log('⚠️  No SQL files found in data directory');
      return;
    }

    console.log(`Found ${sqlFiles.length} SQL file(s) to load`);

    // Execute each SQL file in order
    for (const file of sqlFiles) {
      const filePath = path.join(dataDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`  Loading ${file}...`);
      
      try {
        // Split by semicolon and execute each statement
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const statement of statements) {
          if (statement.trim()) {
            await AppDataSource.query(statement);
          }
        }
        
        console.log(`  ✓ ${file} loaded successfully`);
      } catch (error) {
        console.error(`  ✗ Error loading ${file}:`, error instanceof Error ? error.message : error);
        throw error;
      }
    }

    // Verify data was loaded
    const finalCoachCount = await AppDataSource.query('SELECT COUNT(*) FROM coaches');
    const finalQuizCount = await AppDataSource.query('SELECT COUNT(*) FROM quiz_schema');
    const finalSlotCount = await AppDataSource.query('SELECT COUNT(*) FROM slots');

    console.log('✅ Initial data loaded successfully!');
    console.log(`   - Coaches: ${finalCoachCount[0].count}`);
    console.log(`   - Quiz questions: ${finalQuizCount[0].count}`);
    console.log(`   - Slots: ${finalSlotCount[0].count}`);

  } catch (error) {
    console.error('❌ Error loading initial data:', error);
    throw error;
  }
}

