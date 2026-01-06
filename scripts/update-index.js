import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DATA_DIR = path.join(__dirname, '../public/_data');
const INDEX_FILE = path.join(PUBLIC_DATA_DIR, 'index.json');

/**
 * Update the index.json file with all available dates
 */
function updateIndex() {
    try {
        console.log('Updating index.json...');

        // Ensure directory exists
        if (!fs.existsSync(PUBLIC_DATA_DIR)) {
            console.warn(`Directory ${PUBLIC_DATA_DIR} does not exist. Skipping.`);
            return;
        }

        // Get all json files in the data directory
        const files = fs.readdirSync(PUBLIC_DATA_DIR);

        const dates = files
            .filter(file => file.match(/^\d{4}-\d{2}-\d{2}\.json$/)) // Match YYYY-MM-DD.json
            .map(file => file.replace('.json', '')); // Extract date

        // Sort descending (newest first)
        const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        // Write unique list
        const uniqueDates = [...new Set(sortedDates)];

        if (uniqueDates.length > 0) {
            fs.writeFileSync(INDEX_FILE, JSON.stringify(uniqueDates, null, 2));
            console.log(`Successfully updated index.json with ${uniqueDates.length} editions.`);
        } else {
            console.log('No valid edition files found.');
        }
    } catch (error) {
        console.error('Error updating index:', error);
        process.exit(1);
    }
}

updateIndex();
