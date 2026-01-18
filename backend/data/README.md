# Database Initial Data

Place your SQL files here to automatically load initial data into the database.

## How It Works

1. SQL files in this directory are automatically loaded by the backend after migrations complete
2. Files are executed in alphabetical order
3. Data loading only happens if the database is empty (no existing coaches or quiz data)
4. The backend checks for data on every startup and loads it if needed

## File Naming Convention

Use numbered prefixes to control execution order:

```
01-schema.sql       # Schema creation (if not using migrations)
02-coaches.sql      # Seed coach data
03-quiz-schema.sql  # Quiz questions and schema
04-slots.sql        # Available time slots
```

## Example Files

### 02-coaches.sql
```sql
INSERT INTO coaches (name, specialization, experience_years, rating, bio, available, created_at, updated_at)
VALUES 
  ('Dr. Sarah Johnson', 'Hair Loss Specialist', 8, 4.8, 'Expert in treating various types of hair loss', true, NOW(), NOW()),
  ('Dr. Michael Chen', 'Trichologist', 12, 4.9, 'Specialized in scalp health and hair restoration', true, NOW(), NOW()),
  ('Dr. Priya Sharma', 'Dermatologist', 10, 4.7, 'Focus on hair and skin health', true, NOW(), NOW());
```

### 03-quiz-schema.sql
```sql
INSERT INTO quiz_schema (question_text, question_type, options, order_number, category, created_at, updated_at)
VALUES 
  ('What is your primary concern?', 'single_choice', 
   '["Hair Loss", "Hair Thinning", "Scalp Issues", "Hair Growth"]', 
   1, 'initial_assessment', NOW(), NOW());
```

## Resetting the Database

To reload the data files:

```bash
# Stop and remove the database volume
docker-compose -f docker-compose.local.yml down -v

# Start fresh (will reload all SQL files automatically)
docker-compose -f docker-compose.local.yml up -d
# or
./start-local.sh
```

The backend will automatically:
1. Run migrations to create tables
2. Check if data exists
3. Load all SQL files if the database is empty
4. Display a summary of loaded data

## Notes

- SQL files should contain valid PostgreSQL syntax
- Make sure your SQL doesn't conflict with existing migrations
- Large data files might take time to import
- Check logs if import fails: `docker-compose -f docker-compose.local.yml logs postgres`

