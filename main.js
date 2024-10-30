const fs = require('fs');
const path = require('path');

// Define the base folder containing all subdirectories
const baseFolder = './DO';  // Replace with your main folder path
// Define the target folder to store extracted PDF files
const targetFolder = './extracted_pdfs';  // This folder will hold the copied PDFs

// Ensure the target folder exists
if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
}

/**
 * Recursively collects PDF files from nested folders
 * @param {string} folderPath - Path to the folder to search 
 * @param {Array} pdfFiles - Array to collect PDF file paths
 * @returns {Array} - Array of PDF file paths
 */
function getAllPDFsFromFolder(folderPath, pdfFiles = []) {
    try {
        // Read all files and directories in the current folder
        const files = fs.readdirSync(folderPath);

        // Iterate through each file/folder in the directory
        files.forEach(file => {
            const fullPath = path.join(folderPath, file);

            // Check if the path is a directory or a file
            if (fs.statSync(fullPath).isDirectory()) {
                // Recursively call the function for nested directories
                getAllPDFsFromFolder(fullPath, pdfFiles);
            } else if (fullPath.toLowerCase().endsWith('.pdf')) {
                // If it's a PDF file, add it to the list
                pdfFiles.push(fullPath);
            }
        });

    } catch (err) {
        console.error(`Error accessing folder: ${folderPath} - ${err.message}`);
    }

    return pdfFiles;
}

/**
 * Copy all found PDF files to the target folder
 * @param {Array} pdfFiles - Array of PDF file paths
 */
function copyPDFsToTarget(pdfFiles) {
    pdfFiles.forEach((pdfFile, index) => {
        const fileName = path.basename(pdfFile);
        const targetPath = path.join(targetFolder, fileName);

        try {
            // Copy the PDF to the target folder
            fs.copyFileSync(pdfFile, targetPath);
            console.log(`[${index + 1}/${pdfFiles.length}] Copied: ${pdfFile} -> ${targetPath}`);
        } catch (err) {
            console.error(`Failed to copy ${pdfFile} - ${err.message}`);
        }
    });
}

/**
 * Count the number of PDF files in the extracted_pdfs folder
 */
function countExtractedPDFs() {
    try {
        const files = fs.readdirSync(targetFolder);
        const pdfCount = files.filter(file => file.toLowerCase().endsWith('.pdf')).length;
        console.log(`Total number of PDF files in '${targetFolder}': ${pdfCount}`);
    } catch (err) {
        console.error(`Error accessing '${targetFolder}': ${err.message}`);
    }
}

// Run the function to collect all PDF files
const allPDFs = getAllPDFsFromFolder(baseFolder);

// Check if any PDF files were found
if (allPDFs.length > 0) {
    console.log(`Found ${allPDFs.length} PDF files. Copying to ${targetFolder}...`);
    copyPDFsToTarget(allPDFs);
    // Count the extracted PDF files
    countExtractedPDFs();
} else {
    console.log('No PDF files found in the specified directory.');
}
