import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/_data');
const INDEX_FILE = path.join(PUBLIC_DATA_DIR, 'index.json');

/**
 * Main function to process the payload
 */
function processPayload() {
    // 1. Get arguments
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node process-payload.js <path-to-json-file>');
        process.exit(1);
    }

    const payloadPath = args[0];

    try {
        // 2. Read and Parse Payload
        const rawData = fs.readFileSync(payloadPath, 'utf8');
        const payload = JSON.parse(rawData);

        // Validate basic structure
        if (!payload.data || !Array.isArray(payload.data)) {
            console.error('Invalid payload: missing "data" array');
            process.exit(1);
        }

        let processedCount = 0;
        let errors = 0;

        // 3. Iterate through editions
        payload.data.forEach(item => {
            // Only process completed items
            if (item.status !== 'completed') {
                return;
            }

            const edition = item.output;

            // Validate Edition Structure
            if (!edition || !edition.date || !Array.isArray(edition.articles)) {
                console.warn(`Skipping invalid edition item: ${item.id}`, edition);
                errors++;
                return;
            }

            // 4. Write Edition File
            const filename = `${edition.date}.json`;
            const filePath = path.join(PUBLIC_DATA_DIR, filename);

            // Ensure directory exists
            if (!fs.existsSync(PUBLIC_DATA_DIR)) {
                fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
            }

            fs.writeFileSync(filePath, JSON.stringify(edition, null, 2));
            console.log(`Saved edition: ${filename}`);
            processedCount++;
        });

        // 5. Update Index
        if (processedCount > 0) {
            updateIndex();
        } else {
            console.log('No new completed editions found to process.');
        }

    } catch (error) {
        console.error('Error processing payload:', error);
        process.exit(1);
    }
}

/**
 * Update the index.json file with all available dates
 */
function updateIndex() {
    try {
        // Get all json files in the data directory
        const files = fs.readdirSync(PUBLIC_DATA_DIR);

        const dates = files
            .filter(file => file.match(/^\d{4}-\d{2}-\d{2}\.json$/)) // Match YYYY-MM-DD.json
            .map(file => file.replace('.json', '')); // Extract date

        // Sort descending (newest first)
        const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));

        // Write unique list
        const uniqueDates = [...new Set(sortedDates)];

        if (uniqueDates.length > 0) {
            fs.writeFileSync(INDEX_FILE, JSON.stringify(uniqueDates, null, 2));
            console.log(`Updated index.json with ${uniqueDates.length} editions.`);
        }
    } catch (error) {
        console.error('Error updating index:', error);
    }
}

// Run
processPayload();
